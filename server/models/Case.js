import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    court: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        index: true
    },
    parties: {
        petitioner: String,
        respondent: String
    },
    fullText: {
        type: String,
        required: true
    },
    summary: String,
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'error'],
        default: 'pending'
    },
    citations: [{
        section: String,
        act: String,
        article: String,
        reference: String
    }],
    chunkCount: {
        type: Number,
        default: 0
    },
    fileType: {
        type: String,
        enum: ['pdf', 'text'],
        default: 'text'
    },
    originalFileName: String
}, {
    timestamps: true
});

// Text search index
caseSchema.index({ title: 'text', fullText: 'text' });

const Case = mongoose.model('Case', caseSchema);

export default Case;
