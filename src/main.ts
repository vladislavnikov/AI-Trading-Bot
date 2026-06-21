import "dotenv/config";
import { app, BrowserWindow } from "electron";
import { captureScreen, clearScreenshotsDir } from "./services/capture-service";
import { analyzeScreen } from "./services/ai-service";

let captureInterval: NodeJS.Timeout | null = null;
let analyzing = false;

function startCapturing() {
  captureInterval = setInterval(async () => {
    if (analyzing) return;
    analyzing = true;
    try {
      const buffer = await captureScreen();
      if (buffer) {
        const response = await analyzeScreen(buffer);
        console.log("[ai]", response);
      }
    } catch (err) {
      console.error("[main] Error:", err);
    } finally {
      analyzing = false;
    }
  }, 10000);
}

function stopCapturing() {
  if (captureInterval) {
    clearInterval(captureInterval);
    captureInterval = null;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  clearScreenshotsDir();
  createWindow();
  startCapturing();
});

app.on("window-all-closed", () => {
  stopCapturing();
  if (process.platform !== "darwin") app.quit();
});
