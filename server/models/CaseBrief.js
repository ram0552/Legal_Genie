import mongoose from 'mongoose';

const caseBriefSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true,
        index: true
    },
    facts: {
        type: String,
        required: true
    },
    issues: {
        type: String,
        required: true
    },
    verdict: {
        type: String,
        required: true
    },
    reasoning: {
        type: String,
        required: true
    },
    keyPoints: [String],
    precedentsCited: [{
        caseName: String,
        citation: String,
        relevance: String
    }],
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const CaseBrief = mongoose.model('CaseBrief', caseBriefSchema);

export default CaseBrief;
