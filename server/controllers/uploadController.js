import Case from '../models/Case.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { parsePDF, cleanText } from '../services/pdfParser.js';
import { chunkText } from '../services/chunkingService.js';
import { generateEmbeddings } from '../services/embeddingService.js';
import { upsertVectors, initializePinecone } from '../services/pineconeService.js';
import { extractCitations } from '../services/citationExtractor.js';

/**
 * Upload and process a case document
 * POST /api/upload
 */
export const uploadCase = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'No file uploaded'
        });
    }

    const { title, court, year } = req.body;

    let text = '';
    let fileType = 'text';

    // Parse based on file type
    if (req.file.mimetype === 'application/pdf') {
        const parsed = await parsePDF(req.file.buffer);
        text = cleanText(parsed.text);
        fileType = 'pdf';
    } else {
        text = cleanText(req.file.buffer.toString('utf-8'));
    }

    if (!text || text.length < 100) {
        return res.status(400).json({
            success: false,
            error: 'Could not extract sufficient text from document'
        });
    }

    // Extract citations
    const citations = extractCitations(text);

    // Create case in database
    const newCase = await Case.create({
        title: title || `Case ${Date.now()}`,
        court: court || 'Unknown Court',
        year: year ? parseInt(year) : new Date().getFullYear(),
        fullText: text,
        citations,
        fileType,
        originalFileName: req.file.originalname,
        status: 'processing'
    });

    // Process chunks and embeddings asynchronously
    processEmbeddings(newCase._id.toString(), text).catch(err => {
        console.error('Embedding processing error:', err);
    });

    res.status(201).json({
        success: true,
        data: {
            id: newCase._id,
            title: newCase.title,
            citations: citations.length,
            textLength: text.length,
            status: 'processing'
        },
        message: 'Case uploaded. Embeddings are being processed.'
    });
});

/**
 * Process embeddings in background
 */
async function processEmbeddings(caseId, text) {
    try {
        // Chunk the text
        const chunks = chunkText(text);
        console.log(`Processing ${chunks.length} chunks for case ${caseId}`);

        // Generate embeddings
        const texts = chunks.map(c => c.text);
        const embeddings = await generateEmbeddings(texts);

        // Prepare vectors for Pinecone
        const vectors = chunks.map((chunk, i) => ({
            id: `${caseId}_${chunk.index}`,
            values: embeddings[i],
            metadata: {
                caseId,
                chunkIndex: chunk.index,
                paragraphNum: chunk.paragraphNum,
                text: chunk.text.slice(0, 1000) // Store truncated text in metadata
            }
        }));

        // Initialize Pinecone and upsert
        await initializePinecone();
        await upsertVectors(vectors);

        // Update case status
        await Case.findByIdAndUpdate(caseId, {
            status: 'completed',
            chunkCount: chunks.length
        });

        console.log(`✅ Embeddings processed for case ${caseId}`);
    } catch (error) {
        console.error(`❌ Embedding error for case ${caseId}:`, error.message);
        await Case.findByIdAndUpdate(caseId, { status: 'error' });
    }
}

/**
 * Upload text directly (no file)
 * POST /api/upload/text
 */
export const uploadText = asyncHandler(async (req, res) => {
    const { title, court, year, text } = req.body;

    if (!text || text.length < 100) {
        return res.status(400).json({
            success: false,
            error: 'Text must be at least 100 characters'
        });
    }

    const cleanedText = cleanText(text);
    const citations = extractCitations(cleanedText);

    const newCase = await Case.create({
        title: title || `Case ${Date.now()}`,
        court: court || 'Unknown Court',
        year: year ? parseInt(year) : new Date().getFullYear(),
        fullText: cleanedText,
        citations,
        fileType: 'text',
        status: 'processing'
    });

    // Process embeddings
    processEmbeddings(newCase._id.toString(), cleanedText).catch(console.error);

    res.status(201).json({
        success: true,
        data: {
            id: newCase._id,
            title: newCase.title,
            status: 'processing'
        }
    });
});

/**
 * Upload multiple case documents
 * POST /api/upload/multiple
 */
export const uploadMultipleCases = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No files uploaded'
        });
    }

    const results = [];
    const errors = [];

    // Process each file
    for (const file of req.files) {
        try {
            let text = '';
            let fileType = 'text';

            if (file.mimetype === 'application/pdf') {
                const parsed = await parsePDF(file.buffer);
                text = cleanText(parsed.text);
                fileType = 'pdf';
            } else {
                text = cleanText(file.buffer.toString('utf-8'));
            }

            if (!text || text.length < 100) {
                errors.push({ fileName: file.originalname, error: 'Insufficient text' });
                continue;
            }

            const citations = extractCitations(text);
            const title = file.originalname.replace(/\.[^/.]+$/, '');

            const newCase = await Case.create({
                title,
                court: 'Unknown Court',
                year: new Date().getFullYear(),
                fullText: text,
                citations,
                fileType,
                originalFileName: file.originalname,
                status: 'processing'
            });

            processEmbeddings(newCase._id.toString(), text).catch(console.error);

            results.push({
                id: newCase._id,
                title: newCase.title,
                status: 'processing'
            });
        } catch (err) {
            errors.push({ fileName: file.originalname, error: err.message });
        }
    }

    res.status(201).json({
        success: true,
        data: results,
        errors: errors.length > 0 ? errors : undefined,
        message: `Processed ${results.length} files. ${errors.length} failed.`
    });
});

export default { uploadCase, uploadText, uploadMultipleCases };
