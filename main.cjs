const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    transparent: true, // macOS glassmorphic aesthetic
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For local FS access simplicity in this sovereign mode
    },
    icon: path.join(__dirname, 'dist/vite.svg') // Use built asset
  });

  // Load the built app
  win.loadFile(path.join(__dirname, 'dist/index.html'));
  
  // Enforce "Ghost" state - standard window behavior but look like overlay
  win.setAlwaysOnTop(false); 
}

// Data Bridge for Electron (replacing Vite middleware for EXE)
// The renderer will hit this via IPC instead of fetch('/sync')
// We need to update the frontend to detect environment.

ipcMain.handle('save-file', async (event, { path: filePath, content }) => {
  try {
    // Save relative to the EXE location
    const storageDir = path.join(process.cwd(), 'Shadow_Data');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    
    const targetPath = path.join(storageDir, filePath || `note-${Date.now()}.md`);
    fs.writeFileSync(targetPath, content, 'utf-8');
    return { status: 'success', saved: targetPath };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
