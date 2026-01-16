
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Noel AI Magic Studio",
    backgroundColor: '#0f172a', // Tránh vệt trắng khi khởi động
    show: false, // Chỉ hiện khi đã load xong
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:5173');
    // Nếu vẫn bị đen màn hình, bạn có thể bỏ comment dòng dưới để debug:
    // win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  win.once('ready-to-show', () => {
    win.show();
  });

  win.setMenuBarVisibility(false);
}

app.on('web-contents-created', (event, contents) => {
  contents.session.setPermissionCheckHandler(() => true);
  contents.session.setPermissionRequestHandler((webContents, permission, callback) => callback(true));
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
