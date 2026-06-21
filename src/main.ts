import { app, BrowserWindow } from "electron";
import path from "path";
import { captureScreen, clearScreenshotsDir } from "./services/captureService";
import { analyzeScreen } from "./services/ai-service";

let captureInterval: NodeJS.Timeout | null = null;

function startCapturing() {
  setInterval(async () => {
    try {
      await captureScreen();
    } catch (err) {
      console.error("[capture] Failed:", err);
    }
  }, 8000);
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
  clearScreenshotsDir()
  createWindow();
  startCapturing();
  
   setInterval(async () => {
    try {
      const buffer = await captureScreen();
      const response = await analyzeScreen(buffer, "What is on this screen?");
      console.log('[ai]', response);
    } catch (err) {
      console.error('[main] Error:', err);
    }
  }, 6000);
});

app.on("window-all-closed", () => {
  stopCapturing();
  if (process.platform !== "darwin") app.quit();
});
