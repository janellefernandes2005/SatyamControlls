// backend/routes/contact.js - COMPLETE WITH REAL SENTIMENT ANALYSIS
const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { Visitor, Clickstream } = require('../models/Tracking');
const SentimentService = require('../services/sentimentService');
const { sendInquiryNotification } = require('../utils/emailService');

// ==================== SUBMIT INQUIRY WITH REAL SENTIMENT ANALYSIS ====================
router.post('/submit', async (req, res) => {
    try {
        console.log('📝 New inquiry submission with sentiment analysis...');
        
        // Extract data
        const { 
            fullName, 
            email, 
            phone, 
            subject, 
            message,
            company,
            visitorId,
            timeOnSite,
            pageViews,
            productClicks
        } = req.body;
        
        // Basic validation
        if (!fullName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }
        
        // ============ STEP 1: REAL SENTIMENT ANALYSIS ============
        console.log('🔍 Analyzing sentiment...');
        const sentiment = SentimentService.analyzeSentiment(message);
        console.log(`✅ Sentiment: ${sentiment.label} (Score: ${sentiment.score})`);
        
        // ============ STEP 2: LEAD SCORING ============
        console.log('📊 Calculating lead score...');
        const visitorData = visitorId ? await Visitor.findOne({ visitorId }) : null;
        
        const leadScore = SentimentService.calculateLeadScore(
            sentiment,
            timeOnSite || visitorData?.totalTime || 0,
            pageViews || visitorData?.pageViews || 1,
            productClicks || 0
        );
        console.log(`✅ Lead Score: ${leadScore.score} (${leadScore.quality})`);
        
        // ============ STEP 3: CREATE INQUIRY WITH AI DATA ============
        const inquiry = new Inquiry({
            fullName,
            email,
            phone: phone || '',
            subject: subject || 'General Inquiry',
            message,
            company: company || '',
            
            // Sentiment Analysis Results
            sentimentScore: sentiment.score,
            sentimentLabel: sentiment.label,
            sentimentConfidence: sentiment.confidence,
            
            // Lead Scoring Results
            leadScore: leadScore.score,
            leadQuality: leadScore.quality,
            conversionProbability: leadScore.conversionProbability,
            
            // Behavioral Data
            visitorId: visitorId || null,
            timeOnSite: timeOnSite || visitorData?.totalTime || 0,
            pageViews: pageViews || visitorData?.pageViews || 1,
            productClicks: productClicks || 0,
            deviceType: visitorData?.deviceType || 'Unknown',
            
            // Metadata
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'new',
            priority: leadScore.score >= 70 ? 'High' : leadScore.score >= 40 ? 'Medium' : 'Low'
        });
        
        // Save to database
        await inquiry.save();
        console.log(`✅ Inquiry saved with ID: ${inquiry._id}`);
        console.log(`📊 Lead Quality: ${leadScore.quality} (${leadScore.score}%)`);
        console.log(`😊 Sentiment: ${sentiment.label}`);
        
        // ============ STEP 4: TRACK FORM SUBMISSION ============
        if (visitorId) {
            await Clickstream.create({
                visitorId,
                page: 'contact.html',
                type: 'form_submit',
                metadata: {
                    inquiryId: inquiry._id,
                    sentimentLabel: sentiment.label,
                    leadScore: leadScore.score
                },
                timestamp: new Date()
            });
            
            // Update visitor record
            await Visitor.findOneAndUpdate(
                { visitorId },
                { 
                    $set: { lastActive: new Date() },
                    $inc: { 
                        totalTime: timeOnSite || 0,
                        pageViews: 1 
                    }
                }
            );
        }
        
        // ============ STEP 5: SEND EMAIL WITH AI INSIGHTS ============
        let emailSent = false;
        try {
            const emailData = {
                name: fullName,
                email: email,
                phone: phone,
                company: company,
                subject: subject || 'General Inquiry',
                message: message,
                sentimentLabel: sentiment.label,
                sentimentScore: sentiment.score,
                leadScore: leadScore.score,
                leadQuality: leadScore.quality
            };
            
            emailSent = await sendInquiryNotification(emailData);
            console.log(`📧 Email notification: ${emailSent ? 'Sent' : 'Failed'}`);
        } catch (emailError) {
            console.log('⚠️ Email notification failed:', emailError.message);
        }
        
        // Return success response
        res.status(201).json({
            success: true,
            message: '✅ Inquiry submitted successfully with AI analysis',
            inquiryId: inquiry._id,
            sentiment: {
                label: sentiment.label,
                score: sentiment.score
            },
            leadScore: {
                score: leadScore.score,
                quality: leadScore.quality
            },
            emailSent: emailSent
        });
        
    } catch (error) {
        console.error('❌ Inquiry submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ==================== GET ALL INQUIRIES WITH SENTIMENT ====================
router.get('/all', async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .sort({ 
                leadScore: -1,
                createdAt: -1 
            });
        
        // Calculate summary stats
        const stats = {
            total: inquiries.length,
            new: inquiries.filter(i => i.status === 'new').length,
            hot: inquiries.filter(i => i.leadQuality === 'Hot').length,
            warm: inquiries.filter(i => i.leadQuality === 'Warm').length,
            cold: inquiries.filter(i => i.leadQuality === 'Cold').length,
            urgent: inquiries.filter(i => i.sentimentLabel === 'Urgent').length,
            interested: inquiries.filter(i => i.sentimentLabel === 'Interested' || i.sentimentLabel === 'Very Interested').length,
            complaints: inquiries.filter(i => i.sentimentLabel === 'Complaint').length
        };
        
        res.json({
            success: true,
            count: inquiries.length,
            stats,
            inquiries
        });
        
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inquiries'
        });
    }
});

// ==================== UPDATE INQUIRY STATUS ====================
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Status updated',
            inquiry
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update status'
        });
    }
});

// ==================== ADD NOTE TO INQUIRY ====================
router.post('/:id/notes', async (req, res) => {
    try {
        const { content, admin } = req.body;
        
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }
        
        inquiry.notes.push({
            content,
            admin: admin || 'Admin',
            createdAt: new Date()
        });
        
        await inquiry.save();
        
        res.json({
            success: true,
            message: 'Note added',
            notes: inquiry.notes
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add note'
        });
    }
});

module.exports = router;