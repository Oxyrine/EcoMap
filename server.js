import express from 'express';
import Database from 'better-sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories
fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

// Database
const db = new Database(path.join(__dirname, 'data', 'waste.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    image TEXT,
    wasteType TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'reported' CHECK(status IN ('reported','in-progress','cleaned')),
    reporterName TEXT DEFAULT 'Anonymous',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  )
`);

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `waste-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// === API Routes ===

// Create report
app.post('/api/reports', upload.single('image'), (req, res) => {
  try {
    const { latitude, longitude, wasteType, description, reporterName } = req.body;
    if (!latitude || !longitude || !wasteType) {
      return res.status(400).json({ error: 'Location and waste type are required' });
    }
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }
    const validTypes = ['plastic', 'organic', 'e-waste', 'construction', 'hazardous', 'mixed', 'other'];
    if (!validTypes.includes(wasteType)) {
      return res.status(400).json({ error: 'Invalid waste type' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const stmt = db.prepare(
      `INSERT INTO reports (latitude, longitude, image, wasteType, description, reporterName) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(lat, lng, image, wasteType, description || '', reporterName || 'Anonymous');
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(report);
  } catch (err) {
    console.error('Create report error:', err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Get all reports
app.get('/api/reports', (_req, res) => {
  try {
    const reports = db.prepare('SELECT * FROM reports ORDER BY createdAt DESC').all();
    res.json(reports);
  } catch (err) {
    console.error('Fetch reports error:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get single report
app.get('/api/reports/:id', (req, res) => {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

// Update report status
app.patch('/api/reports/:id', (req, res) => {
  try {
    const { status } = req.body;
    if (!['reported', 'in-progress', 'cleaned'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: reported, in-progress, or cleaned' });
    }
    const existing = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Report not found' });

    db.prepare(`UPDATE reports SET status = ?, updatedAt = datetime('now') WHERE id = ?`).run(status, req.params.id);
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
    res.json(report);
  } catch (err) {
    console.error('Update report error:', err);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// Delete report
app.delete('/api/reports/:id', (req, res) => {
  try {
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    if (report.image) {
      const imgPath = path.join(__dirname, report.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    db.prepare('DELETE FROM reports WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    console.error('Delete report error:', err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// Statistics
app.get('/api/stats', (_req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM reports').get().count;
    const reported = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'reported'").get().count;
    const inProgress = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'in-progress'").get().count;
    const cleaned = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'cleaned'").get().count;
    const byType = db.prepare('SELECT wasteType, COUNT(*) as count FROM reports GROUP BY wasteType ORDER BY count DESC').all();
    res.json({ total, reported, inProgress, cleaned, byType });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Serve React build in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`EcoMap server running at http://localhost:${PORT}`);
});
