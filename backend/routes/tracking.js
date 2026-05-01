// backend/routes/tracking.js - REAL USER TRACKING
const express = require('express');
const router = express.Router();
const { Visitor, Clickstream, ProductView } = require('../models/Tracking');
const { v4: uuidv4 } = require('uuid');

// Track page view
router.post('/pageview', async (req, res) => {
    try {
        const { 
            visitorId, 
            page, 
            timestamp, 
            duration, 
            referrer, 
            userAgent,
            sessionId 
        } = req.body;
        
        if (!visitorId || !page) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        // Determine device type
        let deviceType = 'Desktop';
        if (userAgent) {
            if (userAgent.includes('Mobi')) deviceType = 'Mobile';
            else if (userAgent.includes('Tablet')) deviceType = 'Tablet';
        }
        
        // Generate session ID if not provided
        const sessId = sessionId || uuidv4();
        
        // Save clickstream
        await Clickstream.create({
            visitorId,
            sessionId: sessId,
            page,
            timestamp: new Date(timestamp || Date.now()),
            duration: duration || 0,
            referrer: referrer || 'direct',
            type: 'pageview',
            path: [page]
        });
        
        // Update or create visitor
        const visitor = await Visitor.findOneAndUpdate(
            { visitorId },
            {
                $set: { 
                    lastActive: new Date(),
                    deviceType,
                    userAgent,
                    lastSessionDate: new Date()
                },
                $inc: { 
                    totalTime: duration || 0,
                    pageViews: 1,
                    totalActiveTime: duration || 0
                },
                $push: { pages: page },
                $setOnInsert: { 
                    firstSeen: new Date(),
                    bounce: true,
                    fingerprint: visitorId
                }
            },
            { upsert: true, new: true }
        );
        
        // Update bounce status if they viewed more than 1 page
        if (visitor.pageViews > 1 && visitor.bounce === true) {
            await Visitor.updateOne(
                { visitorId },
                { $set: { bounce: false } }
            );
        }
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Track heartbeat
router.post('/heartbeat', async (req, res) => {
    try {
        const { visitorId, activeTime, page } = req.body;
        
        if (!visitorId) {
            return res.status(400).json({ success: false, message: 'Visitor ID required' });
        }
        
        await Visitor.updateOne(
            { visitorId },
            {
                $set: { 
                    lastActive: new Date(),
                    lastHeartbeat: new Date()
                },
                $inc: { 
                    totalActiveTime: activeTime || 10,
                    totalTime: activeTime || 10
                }
            }
        );
        
        // Track heartbeat in clickstream
        await Clickstream.create({
            visitorId,
            page: page || 'unknown',
            timestamp: new Date(),
            duration: activeTime || 10,
            type: 'heartbeat'
        });
        
        res.json({ success: true });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Track product view with weighted score
router.post('/product-view', async (req, res) => {
    try {
        const { visitorId, productId, productName, duration } = req.body;
        
        // Calculate weighted score: 1 pt for view, 5 pts for 2+ minutes
        let weightedScore = 1;
        if (duration >= 120) weightedScore = 5;
        else if (duration >= 60) weightedScore = 3;
        
        await ProductView.create({
            visitorId,
            productId,
            productName,
            timestamp: new Date(),
            duration: duration || 0,
            weightedScore
        });
        
        res.json({ success: true, weightedScore });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get analytics summary
router.get('/analytics', async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        
        const [
            totalVisitors,
            activeToday,
            activeWeek,
            avgTimeOnSite,
            bounceRate,
            topPages,
            deviceStats
        ] = await Promise.all([
            Visitor.countDocuments(),
            Visitor.countDocuments({ lastActive: { $gte: today } }),
            Visitor.countDocuments({ lastActive: { $gte: weekAgo } }),
            Visitor.aggregate([
                { $group: { _id: null, avg: { $avg: '$totalTime' } } }
            ]),
            Visitor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        total: { $sum: 1 },
                        bounces: { $sum: { $cond: ['$bounce', 1, 0] } }
                    } 
                }
            ]),
            Clickstream.aggregate([
                { $match: { timestamp: { $gte: weekAgo } } },
                { $group: { _id: '$page', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Visitor.aggregate([
                { $group: { _id: '$deviceType', count: { $sum: 1 } } }
            ])
        ]);
        
        res.json({
            success: true,
            analytics: {
                totalVisitors,
                activeToday,
                activeWeek,
                avgTimeOnSite: avgTimeOnSite[0]?.avg || 0,
                bounceRate: bounceRate[0] ? (bounceRate[0].bounces / bounceRate[0].total * 100) : 0,
                topPages,
                deviceStats
            }
        });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// backend/routes/tracking.js - ADD THIS ENDPOINT
// Track product views with proper product mapping
router.post('/product-view', async (req, res) => {
    try {
        const { visitorId, productId, productName, category, duration } = req.body;
        
        // Get or create product view tracking
        const ProductViewModel = mongoose.model('ProductView', new mongoose.Schema({
            visitorId: String,
            productId: String,
            productName: String,
            category: String,
            timestamp: { type: Date, default: Date.now },
            duration: Number,
            weightedScore: { type: Number, default: 1 }
        }));

        // Calculate weighted score: 1pt for view, 3pt for 60s+, 5pt for 120s+
        let weightedScore = 1;
        if (duration >= 120) weightedScore = 5;
        else if (duration >= 60) weightedScore = 3;
        else if (duration >= 30) weightedScore = 2;

        await ProductViewModel.create({
            visitorId,
            productId,
            productName,
            category,
            timestamp: new Date(),
            duration: duration || 0,
            weightedScore
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
module.exports = router;