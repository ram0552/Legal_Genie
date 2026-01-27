import mongoose from 'mongoose';

const userNotesSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true,
        index: true
    },
    userId: {
        type: String,
        default: 'anonymous'
    },
    content: {
        type: String,
        required: true
    },
    paragraphRef: {
        type: Number
    },
    highlightedText: String,
    tags: [String]
}, {
    timestamps: true
});

const UserNotes = mongoose.model('UserNotes', userNotesSchema);

export default UserNotes;
