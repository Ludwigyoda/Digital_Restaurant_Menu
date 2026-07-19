// Détecteur automatique de la bbox du verre + normalisation déterministe.
// Méthode : énergie de contour (Sobel) profilée par colonnes/lignes. Le fond
// des photos produit (flou/uni) a une énergie de contour faible ; le verre
// (net, reflets, arêtes) une énergie forte → seuillage des profils = bbox.
// Aucune retouche à l'œil : la bbox est mesurée, puis re-mesurée sur la sortie.
//
// Usage :
//   node scripts/glass-detect.mjs detect <id...>   -> imprime bbox + overlay contact-sheet
//   (la normalisation viendra dans un 2e temps une fois la détection validée)
import sharp from "sharp";
import { readFileSync } from "node:fs";

const OUT = process.env.OUT || ".";
const WORK_W = 320; // résolution de travail pour la détection (rapide, suffisant)

// Détecte la bbox du sujet dans une image.
// Signal : NETTETÉ locale (Laplacien) + saturation. Les photos ont une faible
// profondeur de champ → le fond est flou (Laplacien≈0) et le verre est net.
// On construit une carte de premier-plan, on la seuille (Otsu adaptatif), on
// garde la plus grande composante connexe centrale, et sa bbox = le verre.
// Retourne { x0,y0,x1,y1, cx } en FRACTIONS [0..1] de l'image d'origine.
export async function detectBBox(path, opts = {}) {
  const { satW = 0.6, closeR = 3 } = opts;
  const { data, info } = await sharp(path).resize({ width: WORK_W }).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const N = W * H;
  const lum = new Float32Array(N), sat = new Float32Array(N);
  for (let p = 0, i = 0; p < N; p++, i += C) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    lum[p] = 0.299 * r + 0.587 * g + 0.114 * b;
    sat[p] = mx <= 0 ? 0 : (mx - mn) / mx;
  }
  // |Laplacien| = netteté locale
  const lap = new Float32Array(N);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const p = y * W + x;
    lap[p] = Math.abs(4 * lum[p] - lum[p - 1] - lum[p + 1] - lum[p - W] - lum[p + W]);
  }
  // Somme de netteté sur fenêtre (image intégrale) → carte de netteté lissée
  const integ = new Float64Array((W + 1) * (H + 1));
  for (let y = 1; y <= H; y++) for (let x = 1; x <= W; x++)
    integ[y * (W + 1) + x] = lap[(y - 1) * W + (x - 1)] + integ[(y - 1) * (W + 1) + x] + integ[y * (W + 1) + x - 1] - integ[(y - 1) * (W + 1) + x - 1];
  const R = 4;
  const box = (x0, y0, x1, y1) => integ[y1 * (W + 1) + x1] - integ[y0 * (W + 1) + x1] - integ[y1 * (W + 1) + x0] + integ[y0 * (W + 1) + x0];
  const sh = new Float32Array(N);
  let shMax = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const xa = Math.max(0, x - R), ya = Math.max(0, y - R), xb = Math.min(W, x + R + 1), yb = Math.min(H, y + R + 1);
    const v = box(xa, ya, xb, yb) / ((xb - xa) * (yb - ya));
    sh[y * W + x] = v; if (v > shMax) shMax = v;
  }
  // Score premier-plan normalisé = netteté + saturation
  const fgScore = new Float32Array(N);
  for (let p = 0; p < N; p++) fgScore[p] = sh[p] / (shMax || 1) + satW * sat[p];
  // Seuil : moyenne + 0.6*écart-type du score
  let mean = 0; for (let p = 0; p < N; p++) mean += fgScore[p]; mean /= N;
  let sd = 0; for (let p = 0; p < N; p++) { const d = fgScore[p] - mean; sd += d * d; } sd = Math.sqrt(sd / N);
  const T = mean + 0.6 * sd;
  const mask = new Uint8Array(N);
  for (let p = 0; p < N; p++) mask[p] = fgScore[p] > T ? 1 : 0;
  // Fermeture morphologique (dilate puis érode) pour solidifier le verre
  const dil = (m, r) => {
    const o = new Uint8Array(N);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let v = 0;
      for (let dy = -r; dy <= r && !v; dy++) for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (m[ny * W + nx]) { v = 1; break; }
      }
      o[y * W + x] = v;
    }
    return o;
  };
  const ero = (m, r) => {
    const o = new Uint8Array(N);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let v = 1;
      for (let dy = -r; dy <= r && v; dy++) for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) { v = 0; break; }
        if (!m[ny * W + nx]) { v = 0; break; }
      }
      o[y * W + x] = v;
    }
    return o;
  };
  let m2 = ero(dil(mask, closeR), closeR);
  // Composantes connexes (BFS 8-voisins), on garde la meilleure = grande + centrale
  const label = new Int32Array(N).fill(0);
  let best = null, cur = 0;
  const stack = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (!m2[s] || label[s]) continue;
    cur++; let sp = 0; stack[sp++] = s; label[s] = cur;
    let area = 0, minx = W, miny = H, maxx = 0, maxy = 0, sumx = 0;
    while (sp) {
      const p = stack[--sp]; const px = p % W, py = (p / W) | 0;
      area++; sumx += px;
      if (px < minx) minx = px; if (px > maxx) maxx = px; if (py < miny) miny = py; if (py > maxy) maxy = py;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = px + dx, ny = py + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const np = ny * W + nx; if (m2[np] && !label[np]) { label[np] = cur; stack[sp++] = np; }
      }
    }
    // score : aire pondérée par la centralité horizontale du centroïde
    const cxx = sumx / area / W;
    const centrality = 1 - Math.min(1, Math.abs(cxx - 0.5) * 2); // 1 au centre, 0 au bord
    const score = area * (0.4 + 0.6 * centrality);
    if (!best || score > best.score) best = { score, minx, miny, maxx, maxy, area };
  }
  if (!best) return { x0: 0, y0: 0, x1: 1, y1: 1, cx: 0.5 };
  return {
    x0: best.minx / W, y0: best.miny / H, x1: (best.maxx + 1) / W, y1: (best.maxy + 1) / H,
    cx: (best.minx + best.maxx) / 2 / W,
  };
}

// ---- mode detect : overlay + print ----
const [mode, ...ids] = process.argv.slice(2);
if (mode === "detect") {
  const DIR = "src/assets/items";
  const tiles = [];
  const TH = 640;
  for (const id of ids) {
    const p = `${DIR}/${id}.jpg`;
    const bb = await detectBBox(p);
    const meta = await sharp(p).metadata();
    const arW = Math.round(TH * (meta.width / meta.height));
    // dessine la bbox (en fractions) sur une vignette hauteur TH
    const rx = Math.round(bb.x0 * arW), rw = Math.round((bb.x1 - bb.x0) * arW);
    const ry = Math.round(bb.y0 * TH), rh = Math.round((bb.y1 - bb.y0) * TH);
    const cxp = Math.round(bb.cx * arW);
    const svg = Buffer.from(
      `<svg width="${arW}" height="${TH}">
        <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="none" stroke="#00ff00" stroke-width="3"/>
        <line x1="${cxp}" y1="0" x2="${cxp}" y2="${TH}" stroke="#00b4ff" stroke-width="1"/>
        <line x1="0" y1="${ry + rh}" x2="${arW}" y2="${ry + rh}" stroke="#ff3b3b" stroke-width="1"/>
        <rect x="0" y="0" width="${arW}" height="18" fill="black" opacity="0.6"/>
        <text x="3" y="14" fill="#0ff" font-size="12" font-family="sans-serif">${id} h=${((bb.y1 - bb.y0) * 100).toFixed(0)}% base=${(bb.y1 * 100).toFixed(0)}% cx=${(bb.cx * 100).toFixed(0)}%</text>
      </svg>`);
    const buf = await sharp(p).resize({ height: TH }).composite([{ input: svg, left: 0, top: 0 }]).toBuffer();
    tiles.push({ buf, w: arW });
    console.log(`${id.padEnd(18)} bbox h=${((bb.y1 - bb.y0) * 100).toFixed(1)}% base=${(bb.y1 * 100).toFixed(1)}% cx=${(bb.cx * 100).toFixed(1)}% x=[${(bb.x0 * 100).toFixed(0)}-${(bb.x1 * 100).toFixed(0)}]`);
  }
  let W = 0; for (const t of tiles) W += t.w + 2;
  let x = 0; const comps = [];
  for (const t of tiles) { comps.push({ input: t.buf, left: x, top: 0 }); x += t.w + 2; }
  await sharp({ create: { width: W, height: TH, channels: 3, background: { r: 20, g: 20, b: 20 } } })
    .composite(comps).jpeg({ quality: 88 }).toFile(`${OUT}/detect.jpg`);
  console.log("-> overlay:", `${OUT}/detect.jpg`);
}
