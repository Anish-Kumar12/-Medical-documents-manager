import path from 'path';
import fs from 'fs';
import { runQuery, getQuery, allQuery } from '../utils/db.utils.js';


export async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ error: 'File is required and must be PDF.' });
  const { originalname, path: filepath, size } = req.file;
  try {
    const result = await runQuery(
      `INSERT INTO documents (filename, filepath, filesize, created_at) VALUES (?, ?, ?, ?)`,
      [originalname, filepath, size, new Date().toISOString()]
    );
    res.status(201).json({ id: result.lastID, filename: originalname });
  } catch (err) {
    res.status(500).json({ error: 'Database error.' });
  }
};

export async function listDocuments(req, res) {
  try {
    const docs = await allQuery('SELECT id, filename, filesize, created_at FROM documents');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Database error.' });
  }
};

export async function downloadDocument(req, res) {
  try {
    const doc = await getQuery('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!doc) return res.status(404).json({ error: 'File not found.' });
    res.download(path.resolve(doc.filepath), doc.filename);
  } catch (err) {
    res.status(500).json({ error: 'Database error.' });
  }
};

export async function deleteDocument(req, res) {
  try {
    const doc = await getQuery('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!doc) {
      res.status(404).json({ error: 'File not found.' });
      return;
    }
    fs.unlink(doc.filepath, async (err) => {
      if (err) {
        res.status(500).json({ error: 'Could not delete file.' });
        return;
      }
      try {
        await runQuery('DELETE FROM documents WHERE id = ?', [req.params.id]);
        res.json({ success: true });
      } catch (e) {
        res.status(500).json({ error: 'Error deleting from database.' });
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
