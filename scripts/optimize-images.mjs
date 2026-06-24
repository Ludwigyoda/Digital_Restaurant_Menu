import sharp from "sharp";
import { readdir, stat, rm } from "node:fs/promises";
import { join } from "node:path";

const DIR = "src/assets/items";
const MAX_W = 1024;
const QUALITY = 78;

// Process both JPG and PNG. PNGs are converted to JPG (resized + compressed)
// and the original PNG is removed, so the kiosk only ships lightweight JPGs
// and the import.meta.glob never ends up with a .jpg/.png id collision.
const files = (await readdir(DIR)).filter((f) => f.endsWith(".jpg") || f.endsWith(".png"));
let totalBefore = 0;
let totalAfter = 0;

for (const f of files) {
  const p = join(DIR, f);
  const isPng = f.endsWith(".png");
  try {
    const before = (await stat(p)).size;
    // Skip already-optimized JPGs (below 250 KB likely already done).
    // PNGs are always processed (converted to JPG) regardless of size.
    if (!isPng && before < 250 * 1024) {
      console.log(`${f.padEnd(28)} skipped (${(before / 1024).toFixed(0)} KB, already small)`);
      continue;
    }
    const buf = await sharp(p)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();
    const outPath = isPng ? p.replace(/\.png$/, ".jpg") : p;
    await sharp(buf).toFile(outPath);
    if (isPng) await rm(p); // drop the original PNG once the JPG exists
    const after = (await stat(outPath)).size;
    totalBefore += before;
    totalAfter += after;
    const pct = ((1 - after / before) * 100).toFixed(0);
    const arrow = isPng ? `→ ${f.replace(/\.png$/, ".jpg")} ` : "";
    console.log(
      `${f.padEnd(28)} ${(before / 1024).toFixed(0).padStart(6)} KB → ${(after / 1024).toFixed(0).padStart(5)} KB  (-${pct}%) ${arrow}`,
    );
  } catch (err) {
    console.error(`${f.padEnd(28)} ERROR: ${err.message.split("\n")[0]}`);
  }
}

console.log(
  `\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB  (saved ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`,
);
