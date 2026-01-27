import genAI, { getGenerativeModel } from '../config/gemini.js';
import Case from '../models/Case.js';
import CaseBrief from '../models/CaseBrief.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { generateBrief } from '../services/briefGenerator.js';
import { generateCounterArguments } from '../services/opposingCounsel.js';
import { extractCitations } from '../services/citationExtractor.js';
import { generateEmbedding } from '../services/embeddingService.js';
import { queryVectors, initializePinecone } from '../services/pineconeService.js';
import { CHAT_QA_PROMPT } from '../utils/promptTemplates.js';

/**
 * Generate structured case brief
 * POST /api/ai/brief
 */
export const generateCaseBrief = asyncHandler(async (req, res) => {
    const { caseId } = req.body;

    if (!caseId) {
        return res.status(400).json({
            success: false,
            error: 'caseId is required'
        });
    }

    const caseDoc = await Case.findById(caseId);
    if (!caseDoc) {
        return res.status(404).json({
            success: false,
            error: 'Case not found'
        });
    }

    // Check if brief already exists
    let brief = await CaseBrief.findOne({ caseId });

    if (!brief) {
        // Generate new brief
        const briefData = await generateBrief(caseId, caseDoc.fullText);

        brief = await CaseBrief.create({
            caseId,
            ...briefData
        });
    }

    res.json({
        success: true,
        data: brief
    });
});

/**
 * Regenerate case brief
 * POST /api/ai/brief/regenerate
 */
export const regenerateBrief = asyncHandler(async (req, res) => {
    const { caseId } = req.body;

    const caseDoc = await Case.findById(caseId);
    if (!caseDoc) {
        return res.status(404).json({
            success: false,
            error: 'Case not found'
        });
    }

    // Delete existing brief
    await CaseBrief.deleteOne({ caseId });

    // Generate new brief
    const briefData = await generateBrief(caseId, caseDoc.fullText);

    const brief = await CaseBrief.create({
        caseId,
        ...briefData
    });

    res.json({
        success: true,
        data: brief
    });
});

/**
 * Generate counter-arguments
 * POST /api/ai/counter
 */
export const generateCounter = asyncHandler(async (req, res) => {
    const { caseId, stance } = req.body;

    if (!caseId || !stance) {
        return res.status(400).json({
            success: false,
            error: 'caseId and stance are required'
        });
    }

    const caseDoc = await Case.findById(caseId);
    if (!caseDoc) {
        return res.status(404).json({
            success: false,
            error: 'Case not found'
        });
    }

    const counterArgs = await generateCounterArguments(caseId, stance, caseDoc.fullText);

    res.json({
        success: true,
        data: counterArgs
    });
});

/**
 * Chat with case (Q&A)
 * POST /api/ai/chat
 */
export const chatWithCase = asyncHandler(async (req, res) => {
  const { caseId, question } = req.body;

  if (!caseId || !question) {
    return res.status(400).json({
      success: false,
      error: 'caseId and question are required'
    });
  }

  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) {
    return res.status(404).json({
      success: false,
      error: 'Case not found'
    });
  }

  // ✅ LLM-only context (NO Pinecone)
  const context = caseDoc.fullText.slice(0, 8000);

  const prompt = CHAT_QA_PROMPT
    .replace('{context}', context)
    .replace('{question}', question);

  const result = await genAI.models.generateContent({
    model: getGenerativeModel(),
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  const answer =
    result.text ||
    result.response?.text?.() ||
    '';

  res.json({
    success: true,
    data: {
      question,
      answer,
      caseId
    }
  });
});

/**
 * Extract citations from case
 * GET /api/ai/citations/:caseId
 */
export const getCitations = asyncHandler(async (req, res) => {
    const { caseId } = req.params;

    const caseDoc = await Case.findById(caseId);
    if (!caseDoc) {
        return res.status(404).json({
            success: false,
            error: 'Case not found'
        });
    }

    // If citations already extracted, return them
    if (caseDoc.citations && caseDoc.citations.length > 0) {
        return res.json({
            success: true,
            data: caseDoc.citations
        });
    }

    // Extract and save citations
    const citations = extractCitations(caseDoc.fullText);
    await Case.findByIdAndUpdate(caseId, { citations });

    res.json({
        success: true,
        data: citations
    });
});

export default {
    generateCaseBrief,
    regenerateBrief,
    generateCounter,
    chatWithCase,
    getCitations
};
