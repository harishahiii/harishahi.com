const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { protect, authorize } = require('../middleware/auth');
const Memory = require('../models/Memory');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/memories');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image or video! Please upload only images or videos.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    }
});

// Create thumbnail for image
async function createThumbnail(file) {
    const thumbnailPath = `uploads/memories/thumbnails/${path.basename(file.filename)}`;
    await sharp(file.path)
        .resize(300, 300, {
            fit: 'cover',
            position: 'center'
        })
        .jpeg({ quality: 90 })
        .toFile(thumbnailPath);
    return path.basename(file.filename);
}

// Upload memory (admin only)
router.post('/', protect, authorize('admin'), upload.array('files', 10), async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please upload at least one file'
            });
        }

        const memories = [];

        for (const file of req.files) {
            const isImage = file.mimetype.startsWith('image/');
            let thumbnailPath = null;

            if (isImage) {
                thumbnailPath = await createThumbnail(file);
            }

            const memory = await Memory.create({
                type: isImage ? 'image' : 'video',
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: `uploads/memories/${file.filename}`,
                thumbnailPath: thumbnailPath,
                metadata: {} // Will be populated with image/video metadata
            });

            memories.push(memory);
        }

        res.status(201).json({
            success: true,
            count: memories.length,
            data: memories
        });
    } catch (err) {
        // Clean up uploaded files if there's an error
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(console.error);
                if (file.thumbnailPath) {
                    await fs.unlink(`uploads/memories/thumbnails/${file.thumbnailPath}`).catch(console.error);
                }
            }
        }
        next(err);
    }
});

// Get all memories
router.get('/', async (req, res, next) => {
    try {
        const { type, page = 1, limit = 20 } = req.query;
        const query = {};

        if (type) {
            query.type = type;
        }

        const memories = await Memory.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Memory.countDocuments(query);

        res.status(200).json({
            success: true,
            count: memories.length,
            total,
            data: memories,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        next(err);
    }
});

// Delete memory (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const memory = await Memory.findById(req.params.id);

        if (!memory) {
            return res.status(404).json({
                success: false,
                error: 'Memory not found'
            });
        }

        // Delete files
        await fs.unlink(memory.path);
        if (memory.thumbnailPath) {
            await fs.unlink(`uploads/memories/thumbnails/${memory.thumbnailPath}`);
        }

        await memory.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
});

// Update memory details (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const memory = await Memory.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title },
            { new: true, runValidators: true }
        );

        if (!memory) {
            return res.status(404).json({
                success: false,
                error: 'Memory not found'
            });
        }

        res.status(200).json({
            success: true,
            data: memory
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router; 