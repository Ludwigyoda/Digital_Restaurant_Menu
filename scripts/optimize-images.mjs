import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const DIR = "src/assets/items";
const MAX_W = 1024;
const QUALITY = 78;

const files = (await readdir(DIR)).filter((f) => f.endsWith(".jpg"));
let totalBefore = 0;
let totalAfter = 0;

for (const f of files) {
  const p = join(DIR, f);
  try {
    const before = (await stat(p)).size;
    // Skip already-optimized files (below 250 KB likely already done)
    if (before < 250 * 1024) {
      console.log(`${f.padEnd(28)} skipped (${(before / 1024).toFixed(0)} KB, already small)`);
      continue;
    }
    const buf = await sharp(p)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();
    await sharp(buf).toFile(p);
    const after = (await stat(p)).size;
    totalBefore += before;
    totalAfter += after;
    const pct = ((1 - after / before) * 100).toFixed(0);
    console.log(
      `${f.padEnd(28)} ${(before / 1024).toFixed(0).padStart(6)} KB → ${(after / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`,
    );
  } catch (err) {
    console.error(`${f.padEnd(28)} ERROR: ${err.message.split("\n")[0]}`);
  }
}

console.log(
  `\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB  (saved ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`,
);
