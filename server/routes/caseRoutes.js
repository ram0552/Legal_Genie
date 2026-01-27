import express from 'express';
import {
    getCases,
    getCaseById,
    createCase,
    updateCase,
    deleteCase
} from '../controllers/caseController.js';

const router = express.Router();

// GET /api/cases - List all cases
router.get('/', getCases);

// GET /api/cases/:id - Get single case
router.get('/:id', getCaseById);

// POST /api/cases - Create new case
router.post('/', createCase);

// PUT /api/cases/:id - Update case
router.put('/:id', updateCase);

// DELETE /api/cases/:id - Delete case
router.delete('/:id', deleteCase);

export default router;
