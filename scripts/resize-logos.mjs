// Ré-échantillonne les PNG des logos à ~2× leur taille d'affichage réelle.
// Cause du flou kiosk : fichiers 620-1000px affichés à 56-64px → le vieux
// WebView X5/TBS réduit ÷10 avec un scaler pauvre (crénelage + RAM). En
// pré-réduisant proprement avec sharp (Lanczos), le kiosk n'a plus qu'une
// réduction douce → net. On ne change QUE la résolution du fichier (PNG +
// alpha conservés) ; la taille d'affichage CSS reste identique.
import sharp from "sharp";
import { writeFile, rename, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const DIR = "src/assets";
const BK = "C:/Users/ludwi/AppData/Local/Temp/claude/c--Users-ludwi-Desktop-Projet-Thibault-VERSION-FINAL/491b62f3-f1ff-46c7-ae92-cce85b23ef3a/scratchpad/logo-backup";

// { fichier: {w,h} } — boîte cible (fit:inside, ratio conservé, pas d'agrandissement)
const LOGOS = {
  "lalupita-logo2.png": { w: 360, h: 360 }, // largeur pilote (h_auto ~117) ; affiché ~173x56
  "revo-clean.png":     { w: 128, h: 128 }, // affiché 64x64
  "halal.png":          { w: 128, h: 128 }, // affiché 64x64
};

if (!existsSync(BK)) await mkdir(BK, { recursive: true });

for (const [file, { w, h }] of Object.entries(LOGOS)) {
  const p = `${DIR}/${file}`;
  const bkp = `${BK}/${file}`;
  // Idempotent : repartir de l'original sauvegardé si présent, sinon sauvegarder.
  if (existsSync(bkp)) await copyFile(bkp, p);
  else await copyFile(p, bkp);

  const before = await sharp(p).metadata();
  const out = await sharp(p)
    .resize({ width: w, height: h, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(p + ".tmp", out);
  await rename(p + ".tmp", p);
  const after = await sharp(p).metadata();
  console.log(
    `${file.padEnd(20)} ${before.width}x${before.height} (${Math.round(
      (before.size ?? 0) / 1024
    )}k) -> ${after.width}x${after.height} (${Math.round((after.size ?? 0) / 1024)}k)`
  );
}
console.log("done");
