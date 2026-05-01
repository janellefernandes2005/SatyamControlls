// backend/models/Inquiry.js - COMPLETE WITH AI/ML FIELDS
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    // Basic Info
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        default: 'General Inquiry'
    },
    message: {
        type: String,
        required: true
    },
    
    // ============ AI/ML ENHANCED FIELDS - REAL SENTIMENT ANALYSIS ============
    sentimentScore: {
        type: Number,
        min: -1,
        max: 1,
        default: 0
    },
    sentimentLabel: {
        type: String,
        enum: ['Urgent', 'Interested', 'Complaint', 'Neutral', 'Very Interested'],
        default: 'Neutral'
    },
    sentimentConfidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    },
    
    // ============ LEAD SCORING - PREDICTIVE INTELLIGENCE ============
    leadScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    leadQuality: {
        type: String,
        enum: ['Hot', 'Warm', 'Cold'],
        default: 'Warm'
    },
    conversionProbability: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    
    // ============ BEHAVIORAL TRACKING DATA ============
    visitorId: String,
    deviceType: String,
    timeOnSite: Number,
    pageViews: Number,
    productClicks: Number,
    
    // ============ STATUS MANAGEMENT ============
    status: {
        type: String,
        enum: ['new', 'contacted', 'resolved', 'spam'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    
    // Admin Notes
    notes: [{
        content: String,
        admin: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Metadata
    ipAddress: String,
    userAgent: String,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
inquirySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Indexes for faster queries
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ leadScore: -1 });
inquirySchema.index({ sentimentLabel: 1 });
inquirySchema.index({ visitorId: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);