const express = require('express');
const path = require('path');
const open = require('open');
const fs = require('fs');

const app = express();
const PORT = 4173; // Using the 'preview' port convention

// Middleware for persistence (The Bridge)
app.use(express.json());

// Resolve paths - checking if we are inside a pkg snapshot
const distPath = path.join(__dirname, 'dist');
const dataPath = process.cwd(); // Run from where the exe is

// Ensure shadow_os_data exists next to the exe
const storageDir = path.join(dataPath, 'shadow_os_data');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// 1. Serve Static Assets (The UI)
app.use(express.static(distPath));

// 2. The Persistence Bridge (API)
app.post('/sync', (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    const targetPath = path.join(storageDir, filePath || `note-${Date.now()}.md`);
    
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`[ShadowOS] Saved: ${targetPath}`);
    
    res.json({ status: 'success', saved: targetPath });
  } catch (e) {
    console.error('[ShadowOS] Save Error:', e);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// 3. Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server & Launch
app.listen(PORT, async () => {
  console.log(`[ShadowOS] Server active on http://localhost:${PORT}`);
  console.log(`[ShadowOS] Storage: ${storageDir}`);
  console.log(`[ShadowOS] Launching Interface...`);
  
  // Try to open in App Mode (Chrome/Edge)
  try {
    await open(`http://localhost:${PORT}`, { 
        app: { name: open.apps.chrome } 
    });
  } catch (e) {
    // Fallback to default browser
    await open(`http://localhost:${PORT}`);
  }
});
