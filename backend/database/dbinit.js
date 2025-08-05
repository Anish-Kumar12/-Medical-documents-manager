import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.error('DB connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
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
