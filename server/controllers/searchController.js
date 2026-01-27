import Case from '../models/Case.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { generateEmbedding } from '../services/embeddingService.js';
import { queryVectors, initializePinecone } from '../services/pineconeService.js';

/**
 * Semantic search across cases
 * POST /api/search
 */
export const semanticSearch = asyncHandler(async (req, res) => {
    const { query, limit = 10, court, year } = req.body;

    if (!query || query.length < 3) {
        return res.status(400).json({
            success: false,
            error: 'Query must be at least 3 characters'
        });
    }

    try {
        // Initialize Pinecone
        await initializePinecone();

        // Generate query embedding
        const queryEmbedding = await generateEmbedding(query);

        // Build filter
        const filter = {};
        if (court) filter.court = court;

        // Query Pinecone
        const results = await queryVectors(queryEmbedding, limit * 2, filter);

        // Get unique case IDs from results
        const caseIds = [...new Set(results.map(r => r.metadata?.caseId).filter(Boolean))];

        // Fetch case details
        const cases = await Case.find({ _id: { $in: caseIds } })
            .select('-fullText')
            .lean();

        // Create case map for quick lookup
        const caseMap = new Map(cases.map(c => [c._id.toString(), c]));

        // Build response with relevance scores
        const searchResults = [];
        const seenCases = new Set();

        for (const result of results) {
            const caseId = result.metadata?.caseId;
            if (!caseId || seenCases.has(caseId)) continue;

            const caseData = caseMap.get(caseId);
            if (!caseData) continue;

            seenCases.add(caseId);
            searchResults.push({
                ...caseData,
                relevanceScore: result.score,
                matchedChunk: result.metadata?.text?.slice(0, 200) + '...'
            });

            if (searchResults.length >= limit) break;
        }

        res.json({
            success: true,
            query,
            results: searchResults,
            total: searchResults.length
        });

    } catch (error) {
        // Fallback to text search if Pinecone fails
        console.log('Pinecone search failed, falling back to text search:', error.message);

        const cases = await Case.find(
            { $text: { $search: query } },
            { score: { $meta: 'textScore' } }
        )
            .select('-fullText')
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit);

        res.json({
            success: true,
            query,
            results: cases.map(c => ({
                ...c.toObject(),
                relevanceScore: c._doc.score,
                fallback: true
            })),
            total: cases.length,
            note: 'Using text search fallback'
        });
    }
});

/**
 * Find similar cases
 * POST /api/search/similar/:id
 */
export const findSimilarCases = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { limit = 5 } = req.body;

    const sourceCase = await Case.findById(id);
    if (!sourceCase) {
        return res.status(404).json({
            success: false,
            error: 'Case not found'
        });
    }

    // Use case summary or first part of text for similarity
    const searchText = sourceCase.summary || sourceCase.fullText.slice(0, 2000);
    const queryEmbedding = await generateEmbedding(searchText);

    await initializePinecone();
    const results = await queryVectors(queryEmbedding, limit * 3);

    // Filter out the source case and get unique cases
    const caseIds = [...new Set(
        results
            .filter(r => r.metadata?.caseId !== id)
            .map(r => r.metadata?.caseId)
            .filter(Boolean)
    )].slice(0, limit);

    const similarCases = await Case.find({ _id: { $in: caseIds } })
        .select('-fullText');

    res.json({
        success: true,
        sourceCase: { id, title: sourceCase.title },
        similarCases
    });
});

export default { semanticSearch, findSimilarCases };
