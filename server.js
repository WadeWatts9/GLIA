const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dbHelper = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
// We'll create the public directory structure next
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images statically
app.use('/uploads', express.static(dbHelper.UPLOADS_DIR));

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dbHelper.UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let ext = '.png';
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      ext = '.jpg';
    } else if (file.mimetype === 'image/gif') {
      ext = '.gif';
    } else if (file.mimetype === 'image/webp') {
      ext = '.webp';
    } else {
      const origExt = path.extname(file.originalname);
      if (origExt) ext = origExt;
    }
    cb(null, 'img_' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper: Download image from URL to local storage
async function downloadImage(url) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    
    if (!response.ok) throw new Error('Response status not OK');
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('Content-Type is not an image: ' + contentType);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let ext = '.png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      ext = '.jpg';
    } else if (contentType.includes('gif')) {
      ext = '.gif';
    } else if (contentType.includes('webp')) {
      ext = '.webp';
    }
    
    const filename = 'dl_' + Date.now() + '_' + Math.round(Math.random() * 1E6) + ext;
    const filePath = path.join(dbHelper.UPLOADS_DIR, filename);
    
    fs.writeFileSync(filePath, buffer);
    return '/uploads/' + filename;
  } catch (err) {
    console.error('Error downloading image from URL:', url, err.message);
    return null; // return null to trigger fallback
  }
}

// API Routes

// Get all items
app.get('/api/items', (req, res) => {
  try {
    const items = dbHelper.getAllItems();
    res.json(items);
  } catch (err) {
    console.error('Error in GET /api/items:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single item
app.get('/api/items/:id', (req, res) => {
  try {
    const item = dbHelper.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error in GET /api/items/' + req.params.id, err);
    res.status(500).json({ error: err.message });
  }
});

// Create new item
app.post('/api/items', (req, res) => {
  try {
    const itemData = req.body;
    if (!itemData.title || !itemData.type || !itemData.status) {
      return res.status(400).json({ error: 'Faltan campos requeridos (title, type, status)' });
    }
    const newItem = dbHelper.addItem(itemData);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error in POST /api/items:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update item
app.put('/api/items/:id', (req, res) => {
  try {
    const itemData = req.body;
    console.log('PUT /api/items/' + req.params.id, JSON.stringify(itemData, null, 2));
    const updated = dbHelper.updateItem(req.params.id, itemData);
    if (!updated) {
      return res.status(404).json({ error: 'Item no encontrado o sin cambios' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error in PUT /api/items/' + req.params.id, err);
    res.status(500).json({ error: err.message });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  try {
    const success = dbHelper.deleteItem(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE /api/items/' + req.params.id, err);
    res.status(500).json({ error: err.message });
  }
});

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = dbHelper.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Error in GET /api/stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Upload image (file upload from computer or webcam)
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    const localUrl = `/uploads/${req.file.filename}`;
    res.json({ url: localUrl });
  } catch (err) {
    console.error('Error in POST /api/upload:', err);
    res.status(500).json({ error: err.message });
  }
});

// Upload/Download image from URL
app.post('/api/upload-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL requerida' });
    }
    
    const localUrl = await downloadImage(url);
    if (localUrl) {
      res.json({ url: localUrl });
    } else {
      // If download fails, return the original URL so the client can fallback to hotlinking
      res.json({ url: url, fallback: true });
    }
  } catch (err) {
    console.error('Error in POST /api/upload-url:', err);
    res.status(500).json({ error: err.message });
  }
});

// Catch-all route to serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`GLIA app backend running on port ${PORT}`);
});
