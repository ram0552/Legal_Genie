import express from 'express';
import { semanticSearch, findSimilarCases } from '../controllers/searchController.js';

const router = express.Router();

// POST /api/search - Semantic search
router.post('/', semanticSearch);

// POST /api/search/similar/:id - Find similar cases
router.post('/similar/:id', findSimilarCases);

export default router;
