// screenshots of the demo at phone, laptop and projector widths, light and dark.
// usage: npm run screenshots   (builds the demo, serves it with vite preview, writes screenshots/)
import { mkdirSync } from "node:fs";
import { preview } from "vite";
import { chromium } from "playwright";

const SIZES = {
  phone: { width: 390, height: 844 },
  laptop: { width: 1440, height: 900 },
  projector: { width: 1920, height: 1080 },
};

mkdirSync("screenshots", { recursive: true });
const server = await preview({ preview: { port: 4179, strictPort: false } });
const base = server.resolvedUrls.local[0]; // ends with /ui/
const browser = await chromium.launch();
try {
  for (const [name, viewport] of Object.entries(SIZES)) {
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: name === "phone" ? 2 : 1 });
      await page.goto(`${base}?theme=${theme}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `screenshots/${name}-${theme}.png` });
      // full page (skipped on phone: 14,000 px tall at 2x)
      if (name !== "phone") await page.screenshot({ path: `screenshots/${name}-${theme}-full.png`, fullPage: true });
      // the app stage alone (with a chip popover open, except on phone where panes are bottom sheets)
      if (name !== "phone") {
        await page.getByRole("button", { name: /Monterey Bay/ }).first().click();
        await page.waitForTimeout(150);
      }
      await page.locator(".demo-sentence").locator("..").screenshot({ path: `screenshots/${name}-${theme}-app.png` });
      await page.close();
      console.log(`screenshots/${name}-${theme}*.png`);
    }
  }
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
