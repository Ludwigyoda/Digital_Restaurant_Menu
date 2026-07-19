// Capture réelle de la barre de nav (logos) — vérité terrain, pas de simulation.
import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = process.env.OUT || ".";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 1 }, // = kiosk
});
const page = await browser.newPage();
await page.goto("http://localhost:5173/", { waitUntil: "networkidle2" });
await sleep(900);

const nav = await page.$("nav");
await nav.screenshot({ path: `${OUT}/real-nav.png` });

const info = await page.evaluate(() =>
  [...document.querySelectorAll("nav img")].map((i) => ({
    alt: i.alt, css: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`,
    nat: `${i.naturalWidth}x${i.naturalHeight}`,
  }))
);
console.log(JSON.stringify(info, null, 0));
await browser.close();
console.log("done ->", `${OUT}/real-nav.png`);
