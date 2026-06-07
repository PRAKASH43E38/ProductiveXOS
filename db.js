const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'productivex.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS app_data (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

console.log('SQLite DB ready — productivex.db');

module.exports = db;
