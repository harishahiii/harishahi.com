const express = require('express');
const router = express.Router();
const { protect, authorize, rateLimit } = require('../middleware/auth');
const Message = require('../models/Message');

// Rate limit messages to 5 per hour per IP
const messageRateLimit = rateLimit(60 * 60 * 1000, 5);

// Submit a message (public route with rate limiting)
router.post('/', messageRateLimit, async (req, res, next) => {
    try {
        const { name, email, message } = req.body;
        
        const newMessage = await Message.create({
            name,
            email,
            message,
            device: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (err) {
        next(err);
    }
});

// Get all messages (admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
    try {
        const messages = await Message.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (err) {
        next(err);
    }
});

// Get unread messages count (admin only)
router.get('/unread', protect, authorize('admin'), async (req, res, next) => {
    try {
        const count = await Message.countDocuments({ read: false });

        res.status(200).json({
            success: true,
            count
        });
    } catch (err) {
        next(err);
    }
});

// Mark message as read (admin only)
router.put('/:id/read', protect, authorize('admin'), async (req, res, next) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true, runValidators: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (err) {
        next(err);
    }
});

// Delete message (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router; 