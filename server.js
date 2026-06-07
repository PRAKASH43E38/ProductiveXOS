const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/data', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM app_data').all();
    const data = {};
    rows.forEach(row => { data[row.key] = JSON.parse(row.value); });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/data', (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, error: 'key missing' });
    db.prepare(`
      INSERT INTO app_data (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, JSON.stringify(value));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`ProductiveX OS running at http://localhost:${PORT}`);
});
