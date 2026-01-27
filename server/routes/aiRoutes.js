import express from 'express';
import {
    generateCaseBrief,
    regenerateBrief,
    generateCounter,
    chatWithCase,
    getCitations
} from '../controllers/aiController.js';

const router = express.Router();

// POST /api/ai/brief - Generate case brief
router.post('/brief', generateCaseBrief);

// POST /api/ai/brief/regenerate - Regenerate brief
router.post('/brief/regenerate', regenerateBrief);

// POST /api/ai/counter - Generate counter-arguments
router.post('/counter', generateCounter);

// POST /api/ai/chat - Chat with case
router.post('/chat', chatWithCase);

// GET /api/ai/citations/:caseId - Get citations
router.get('/citations/:caseId', getCitations);

export default router;
