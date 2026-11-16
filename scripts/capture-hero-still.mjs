// Captures the hero's still image from the finished 3D build, so the still and the live scene match.
// Run with the site serving on localhost:3000 (npm run build, npm start):
//   CHROME_PATH=<chrome or edge> node scripts/capture-hero-still.mjs
// Writes public/hero/duplex-628.webp and duplex-1256.webp. Re-run after changing the duplex model,
// the camera or the lighting, then rebuild.
import puppeteer from "puppeteer-core";

const url = process.env.SITE_URL ?? "http://localhost:3000/";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
  args: ["--no-first-run", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu"],
});
try {
  for (const scale of [1, 2]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: scale });
    await page.goto(url, { waitUntil: "networkidle0" });
    // the build has finished and the camera has settled
    await page.waitForSelector(".hero-visual__live [data-settled]", { timeout: 60000 });
    // only the 3D layer: no still, float card or replay button
    await page.addStyleTag({
      content:
        ".hero-visual__still,.hero-visual .ly-float,.hero-tools{display:none!important}.hero-visual{border-color:transparent!important;border-radius:0!important}",
    });
    await new Promise((r) => setTimeout(r, 400));
    const frame = await page.$(".hero-visual");
    const file = `public/hero/duplex-${628 * scale}.webp`;
    await frame.screenshot({ path: file, type: "webp", quality: 86 });
    console.log("wrote", file);
    await page.close();
  }
} finally {
  await browser.close();
}
