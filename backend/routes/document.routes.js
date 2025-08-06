import express from 'express';
import upload from '../middleware/multerConfig.js';
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
  deleteDocument
} from '../controllers/document.controller.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', listDocuments);
router.get('/:id', downloadDocument);
router.delete('/:id', deleteDocument);

export default router;
