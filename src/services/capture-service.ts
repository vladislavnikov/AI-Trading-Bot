import screenshot from "screenshot-desktop";
import * as fs from "fs";
import * as path from "path";

const files: string[] = [];

function ensureScreenshotsDir(): void {
  if (!fs.existsSync(process.env.SCREENSHOTS_DIR!)) {
    fs.mkdirSync(process.env.SCREENSHOTS_DIR!, {
      recursive: true,
    });
  }
}

function deleteOldestIfNeeded(): void {
  if (files.length >= parseInt(process.env.MAX_FILES!)) {
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
  const filename = path.join(
    process.env.SCREENSHOTS_DIR!,
    `screenshot-${Date.now()}.png`,
  );
  fs.writeFileSync(filename, img);
  console.log(`[capture] Saved ${filename}`);
  files.push(filename);
  deleteOldestIfNeeded();
  return img;
}

export function clearScreenshotsDir(): void {
  if (fs.existsSync(process.env.SCREENSHOTS_DIR!)) {
    fs.readdirSync(process.env.SCREENSHOTS_DIR!).forEach((file) => {
      fs.unlinkSync(path.join(process.env.SCREENSHOTS_DIR!, file));
    });
  }
  files.length = 0;
}
