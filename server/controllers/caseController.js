import Case from '../models/Case.js';
import CaseBrief from '../models/CaseBrief.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { extractCitations } from '../services/citationExtractor.js';

/**
 * Get all cases
 * GET /api/cases
 */
export const getCases = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search, court, year } = req.query;

    const query = {};
    if (search) {
        query.$text = { $search: search };
    }
    if (court) {
        query.court = court;
    }
    if (year) {
        query.year = parseInt(year);
    }

    const cases = await Case.find(query)
        .select('-fullText') // Exclude full text for list view
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Case.countDocuments(query);

    res.json({
        success: true,
        data: cases,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

/**
 * Get single case by ID
 * GET /api/cases/:id
 */
export const getCaseById = asyncHandler(async (req, res) => {
    const caseDoc = await Case.findById(req.params.id);

    if (!caseDoc) {
        return res.status(404).json({
            success: false,
            error: 'Case not found'
        });
    }

    // Get associated brief if exists
    const brief = await CaseBrief.findOne({ caseId: caseDoc._id });

    res.json({
        success: true,
        data: {
            ...caseDoc.toObject(),
            brief: brief || null
        }
    });
});

/**
 * Create new case
 * POST /api/cases
 */
export const createCase = asyncHandler(async (req, res) => {
    const { title, court, year, parties, fullText, summary } = req.body;

    // Extract citations from full text
    const citations = fullText ? extractCitations(fullText) : [];

    const newCase = await Case.create({
        title,
        court,
        year,
        parties,
        fullText,
        summary,
        citations,
        status: 'pending'
    });

    res.status(201).json({
        success: true,
        data: newCase
    });
});

/**
 * Update case
 * PUT /api/cases/:id
 */
export const updateCase = asyncHandler(async (req, res) => {
    const { title, court, year, parties, summary } = req.body;

    const updatedCase = await Case.findByIdAndUpdate(
        req.params.id,
        { title, court, year, parties, summary },
        { new: true, runValidators: true }
    );

    if (!updatedCase) {
        return res.status(404).json({
            success: false,
            error: 'Case not found'
        });
    }

    res.json({
        success: true,
        data: updatedCase
    });
});

/**
 * Delete case
 * DELETE /api/cases/:id
 */
export const deleteCase = asyncHandler(async (req, res) => {
    const caseDoc = await Case.findByIdAndDelete(req.params.id);

    if (!caseDoc) {
        return res.status(404).json({
            success: false,
            error: 'Case not found'
        });
    }

    // Also delete associated briefs
    await CaseBrief.deleteMany({ caseId: req.params.id });

    res.json({
        success: true,
        message: 'Case deleted successfully'
    });
});

export default {
    getCases,
    getCaseById,
    createCase,
    updateCase,
    deleteCase
};
