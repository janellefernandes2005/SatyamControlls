// backend/models/Tracking.js
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    visitorId: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    fingerprint: String,
    firstSeen: { 
        type: Date, 
        default: Date.now,
        index: true 
    },
    lastActive: { 
        type: Date,
        index: true 
    },
    totalTime: { 
        type: Number, 
        default: 0 
    },
    totalActiveTime: { 
        type: Number, 
        default: 0 
    },
    pageViews: { 
        type: Number, 
        default: 0 
    },
    pages: [String],
    bounce: { 
        type: Boolean, 
        default: true 
    },
    sessionCount: { 
        type: Number, 
        default: 1 
    },
    deviceType: {
        type: String,
        enum: ['Desktop', 'Mobile', 'Tablet', 'Unknown'],
        default: 'Unknown'
    },
    referrer: String,
    userAgent: String,
    lastSessionDate: Date
});

const clickstreamSchema = new mongoose.Schema({
    visitorId: { 
        type: String, 
        required: true,
        index: true 
    },
    sessionId: {
        type: String,
        index: true
    },
    page: String,
    timestamp: { 
        type: Date, 
        default: Date.now,
        index: true 
    },
    duration: Number,
    referrer: String,
    type: {
        type: String,
        enum: ['pageview', 'click', 'heartbeat', 'exit', 'form_start', 'form_submit'],
        default: 'pageview'
    },
    path: [String],
    metadata: mongoose.Schema.Types.Mixed
});

const productViewSchema = new mongoose.Schema({
    visitorId: { 
        type: String, 
        index: true 
    },
    productId: String,
    productName: String,
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    duration: Number,
    weightedScore: {
        type: Number,
        default: 1
    }
});

// Create models
const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
const Clickstream = mongoose.models.Clickstream || mongoose.model('Clickstream', clickstreamSchema);
const ProductView = mongoose.models.ProductView || mongoose.model('ProductView', productViewSchema);

module.exports = { Visitor, Clickstream, ProductView };