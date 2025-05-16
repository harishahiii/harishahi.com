const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },
    filename: {
        type: String,
        required: true,
        unique: true
    },
    originalname: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    thumbnailPath: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    metadata: {
        width: Number,
        height: Number,
        duration: Number // for videos
    }
});

// Add indexes
memorySchema.index({ createdAt: -1 });
memorySchema.index({ type: 1 });

// Virtual for public URL
memorySchema.virtual('url').get(function() {
    return `/uploads/memories/${this.filename}`;
});

memorySchema.virtual('thumbnailUrl').get(function() {
    return this.thumbnailPath ? `/uploads/memories/thumbnails/${this.thumbnailPath}` : null;
});

// Set virtuals in JSON
memorySchema.set('toJSON', { virtuals: true });
memorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Memory', memorySchema); 