import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve('database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  filesize INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
`;

db.run(createTableQuery);

export default db;
