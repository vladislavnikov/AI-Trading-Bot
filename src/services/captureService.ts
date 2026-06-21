import screenshot from "screenshot-desktop";
import * as fs from "fs";
import * as path from "path";

const SCREENSHOTS_DIR = "screenshots";
const MAX_FILES = 4;

const files: string[] = [];

function ensureScreenshotsDir(): void {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
}

function deleteOldestIfNeeded(): void {
  if (files.length >= MAX_FILES) {
    const toDelete = files.shift();
    if (toDelete && fs.existsSync(toDelete)) {
      fs.unlinkSync(toDelete);
      console.log(`[capture] Deleted ${toDelete}`);
    }
  }
}

export async function captureScreen(): Promise<Buffer> {
  ensureScreenshotsDir();
  const img: Buffer = await screenshot({ format: "png" });
  const filename = path.join(SCREENSHOTS_DIR, `screenshot-${Date.now()}.png`);
  fs.writeFileSync(filename, img);
  console.log(`[capture] Saved ${filename}`);
  files.push(filename);
  deleteOldestIfNeeded();
  return img;
}

export function clearScreenshotsDir(): void {
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    fs.readdirSync(SCREENSHOTS_DIR).forEach((file) => {
      fs.unlinkSync(path.join(SCREENSHOTS_DIR, file));
    });
  }
  files.length = 0;
}
