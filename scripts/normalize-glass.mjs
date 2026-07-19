// Normalisation déterministe de la présentation des verres.
// Entrée : bbox du verre MESURÉE (fractions, table ci-dessous) — mesurée une
// fois sur grille, donc reproductible. Sortie : toile fixe 960×1705 (ratio des
// cartes) où le verre a une HAUTEUR cible X%, sa BASE à Y%, et est CENTRÉ.
// Le sujet mis à l'échelle est posé sur un FOND FLOU de la même photo → permet
// de RÉDUIRE un sujet trop grand (ce qu'un crop ne peut pas) sans couture.
// 100% déterministe : mêmes entrées → même sortie.
import sharp from "sharp";
import { writeFile, rename, mkdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";

const OUTW = 960, OUTH = 1705; // ratio 0.563 = celui des cartes
const BK = "C:/Users/ludwi/AppData/Local/Temp/claude/c--Users-ludwi-Desktop-Projet-Thibault-VERSION-FINAL/491b62f3-f1ff-46c7-ae92-cce85b23ef3a/scratchpad/glass-backup";

// bbox du VERRE en fractions {x0,y0,x1,y1} + cible {X:hauteur, Y:base}.
// Mesurées sur grille 2 axes. Le bol noir (large) reçoit un X plus petit pour
// ne pas dominer (« trop grand »).
const ITEMS = {
  // --- Signature (validé) ---
  "sg-mr-dameisha":   { x0:.30,y0:.30,x1:.68,y1:.79, X:.46, Y:.84 },
  "sg-mrs-xiaomeisha":{ x0:.32,y0:.40,x1:.66,y1:.79, X:.46, Y:.84 },
  "sg-mrs-red":       { x0:.40,y0:.40,x1:.64,y1:.79, X:.46, Y:.84 },
  "sg-mr-white":      { x0:.38,y0:.35,x1:.62,y1:.86, X:.46, Y:.84 },
  "sg-mr-black":      { x0:.30,y0:.40,x1:.72,y1:.83, X:.36, Y:.84 },
  "sg-mr-yellow":     { x0:.42,y0:.34,x1:.62,y1:.81, X:.46, Y:.84 },
  "sg-mr-green":      { x0:.40,y0:.34,x1:.62,y1:.83, X:.46, Y:.84 },
  "sg-mr-orange":     { x0:.42,y0:.37,x1:.66,y1:.93, X:.46, Y:.84 },
  // --- Shots : calés sur les 9 non-normalisés (petits, verre ~22% carte, base
  // ~85%). Cibles réduites, à ajuster sur la CAPTURE RÉELLE (pas de sim). ---
  "sh-b52":           { x0:.38,y0:.70,x1:.60,y1:.95, X:.22, Y:.80 },
  "sh-blowjob":       { x0:.40,y0:.44,x1:.60,y1:.80, X:.24, Y:.84 },
  "sh-jager-bomb":    { x0:.36,y0:.42,x1:.66,y1:.80, X:.23, Y:.84 },
  // --- All-star : BKK à recentrer ---
  "as-bkk":           { x0:.30,y0:.25,x1:.74,y1:.82, X:.50, Y:.84 },
  // --- Bières Happy Hours + Draft (Carlsberg réduite au niveau Ducato) ---
  "hh-corona":        { x0:.44,y0:.30,x1:.68,y1:.88, X:.58, Y:.89 },
  "hh-carlsberg":     { x0:.30,y0:.15,x1:.70,y1:.90, X:.66, Y:.89 },
  "hh-ducato":        { x0:.30,y0:.22,x1:.70,y1:.90, X:.66, Y:.89 },
  "hh-margarita":     { x0:.28,y0:.28,x1:.72,y1:.92, X:.62, Y:.89 },
  "be-carlsberg":     { x0:.30,y0:.15,x1:.70,y1:.90, X:.66, Y:.89 },
  "be-ducato":        { x0:.30,y0:.22,x1:.70,y1:.90, X:.66, Y:.89 },
};

async function normalize(id, spec) {
  const p = `src/assets/items/${id}.jpg`;
  const meta = await sharp(p).metadata();
  const W = meta.width, H = meta.height;
  const vcx = (spec.x0 + spec.x1) / 2 * W;
  const vy1 = spec.y1 * H;                 // base du verre (px source)
  const vh = (spec.y1 - spec.y0) * H;       // hauteur du verre (px source)

  const s = (spec.X * OUTH) / vh;           // échelle : hauteur verre -> X% de la sortie
  const Ws = Math.round(W * s), Hs = Math.round(H * s);
  const ox = OUTW / 2 - vcx * s;            // centre verre -> centre toile
  const oy = spec.Y * OUTH - vy1 * s;       // base verre -> Y% de la toile

  // Fond : la même photo en cover 960×1705, floutée + assombrie (bouche les vides).
  // Pour un gros agrandissement, on floute/assombrit PLUS fort (spec.bgBlur/bgBright)
  // sinon le verre d'origine réapparaît en "fantôme" flou sous le verre net.
  const bg = await sharp(p).resize(OUTW, OUTH, { fit: "cover" })
    .blur(spec.bgBlur ?? 24).modulate({ brightness: spec.bgBright ?? 0.55 }).toBuffer();

  // Sujet mis à l'échelle
  const fg = await sharp(p).resize(Ws, Hs).toBuffer();

  // Fenêtre du sujet qui tombe dans la toile (gère offsets négatifs si s>1)
  const srcL = Math.max(0, Math.round(-ox));
  const srcT = Math.max(0, Math.round(-oy));
  const dstL = Math.max(0, Math.round(ox));
  const dstT = Math.max(0, Math.round(oy));
  const w = Math.min(Ws - srcL, OUTW - dstL);
  const h = Math.min(Hs - srcT, OUTH - dstT);
  const fgCrop = await sharp(fg).extract({ left: srcL, top: srcT, width: w, height: h }).toBuffer();

  const out = await sharp(bg)
    .composite([{ input: fgCrop, left: dstL, top: dstT }])
    .jpeg({ quality: 86, mozjpeg: false, progressive: false, chromaSubsampling: "4:4:4" })
    .toBuffer();

  await writeFile(p + ".tmp", out); await rename(p + ".tmp", p);
  return { id, s: s.toFixed(2), out: `${OUTW}x${OUTH}` };
}

if (!existsSync(BK)) await mkdir(BK, { recursive: true });
for (const [id, spec] of Object.entries(ITEMS)) {
  const p = `src/assets/items/${id}.jpg`;
  const bkp = `${BK}/${id}.jpg`;
  // Idempotent : si un backup de l'original existe, on repart de LUI (évite de
  // re-normaliser une image déjà normalisée) ; sinon on sauvegarde l'original.
  if (existsSync(bkp)) await copyFile(bkp, p);
  else await copyFile(p, bkp);
  const r = await normalize(id, spec);
  console.log(`${id.padEnd(18)} scale=${r.s} -> ${r.out}`);
}
console.log("done");
