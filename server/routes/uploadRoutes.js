import express from 'express';
import { uploadCase, uploadText, uploadMultipleCases } from '../controllers/uploadController.js';
import { uploadSingle, uploadMultiple } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// POST /api/upload - Upload PDF/text file
router.post('/', uploadSingle, uploadCase);

// POST /api/upload/multiple - Upload multiple PDF/text files
router.post('/multiple', uploadMultiple, uploadMultipleCases);

// POST /api/upload/text - Upload raw text
router.post('/text', uploadText);

export default router;
