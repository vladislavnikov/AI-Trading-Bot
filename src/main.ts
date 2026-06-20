import { app, BrowserWindow } from "electron";
import path from "path";
import { captureScreen } from "./services/captureService";

let captureInterval: NodeJS.Timeout | null = null;

function startCapturing() {
  setInterval(async () => {
    try {
      await captureScreen();
    } catch (err) {
      console.error("[capture] Failed:", err);
    }
  }, 1000);
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
  createWindow();
  startCapturing();
});

app.on("window-all-closed", () => {
  stopCapturing();
  if (process.platform !== "darwin") app.quit();
});
