/**
 * Global error handler middleware
 */

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            error: 'File too large. Maximum size is 50MB.'
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            error: 'Too many files uploaded.'
        });
    }

    // MongoDB validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: messages
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            error: 'Duplicate entry exists'
        });
    }

    // MongoDB cast error (invalid ID)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        });
    }

    // AI/API errors
    if (err.message?.includes('API') || err.message?.includes('Gemini')) {
        return res.status(503).json({
            success: false,
            error: 'AI service temporarily unavailable',
            details: err.message
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
};

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default { errorHandler, asyncHandler };
