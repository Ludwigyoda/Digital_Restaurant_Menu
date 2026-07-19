// Capture le VRAI rendu de l'app (Chrome installé via puppeteer-core) + mesure
// DOM des cartes. Sert de vérité terrain — on ne valide plus sur simulation.
// Usage : OUT=<dir> node scripts/shoot.mjs <subLabel> [nbPages]
//   ex : node scripts/shoot.mjs Shots 3
import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "http://localhost:5173/";
const OUT = process.env.OUT || ".";
const SUB = process.argv[2] || "Shots";
const PAGES = parseInt(process.argv[3] || "1", 10);
const VIEW = { width: 1280, height: 800 }; // ~ kiosk paysage

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  defaultViewport: VIEW,
});
const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle2" });
await sleep(900);

async function clickText(txt) {
  return page.evaluate((t) => {
    const els = [...document.querySelectorAll("button")];
    const el = els.find((b) => b.textContent.replace(/\s+/g, " ").includes(t));
    if (el) { el.click(); return true; }
    return false;
  }, txt);
}

// Aller sur Drinks → <SUB> : ouvrir le menu catégorie "Revolucion Cocktail" puis cliquer le sous-onglet
await clickText("Revolucion Cocktail"); await sleep(500);
const ok = await clickText(SUB); await sleep(900);
if (!ok) { console.log("!! sous-onglet introuvable:", SUB); }

async function measure() {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll("[data-canvas] button")];
    return cards.map((c) => {
      const r = c.getBoundingClientRect();
      const img = c.querySelector("img");
      const name = (c.querySelector("h3")?.textContent || "").trim();
      return {
        name,
        w: Math.round(r.width), h: Math.round(r.height),
        ratio: +(r.width / r.height).toFixed(3),
        nat: img ? `${img.naturalWidth}x${img.naturalHeight}` : null,
      };
    }).filter((c) => c.w > 60);
  });
}

async function swipeLeft() {
  const box = await page.$eval("[data-canvas]", (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const cy = box.y + box.h / 2, sx = box.x + box.w * 0.72, ex = box.x + box.w * 0.28;
  await page.mouse.move(sx, cy); await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(sx + (ex - sx) * i / 12, cy); await sleep(18); }
  await page.mouse.up(); await sleep(750);
}

for (let p = 0; p < PAGES; p++) {
  const m = await measure();
  const file = `${OUT}/real-${SUB.toLowerCase()}-p${p + 1}.png`;
  await page.screenshot({ path: file });
  console.log(`\n=== ${SUB} page ${p + 1} → ${file}`);
  console.log(`   ratio carte: ${m.map((c) => c.ratio).join(", ")}`);
  m.forEach((c) => console.log(`   ${(c.name || "?").padEnd(22)} ${c.w}x${c.h} ratio=${c.ratio} nat=${c.nat}`));
  if (p < PAGES - 1) await swipeLeft();
}

await browser.close();
console.log("\ndone");
