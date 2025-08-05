import express from 'express';
const router = express.Router();
import upload from '../middleware/multerConfig.js';
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
  deleteDocument
} from '../controllers/document.controller.js';
// Upload a document
router.post('/upload', upload.single('file'), uploadDocument);

// List all documents
router.get('/', listDocuments);

// Download a document
router.get('/:id', downloadDocument);

// Delete a document
router.delete(':id', deleteDocument);

export default router;
