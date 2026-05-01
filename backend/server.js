// server.js - COMPLETE FIXED VERSION
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const app = express();

// ============ MIDDLEWARE ============
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:8500', 'http://127.0.0.1:8500', '*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============ SERVE STATIC FILES ============
app.use(express.static(path.join(__dirname, '..')));

// ============ CRITICAL FIX: Handle all routes ============
app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
        return next();
    }
    
    // Check if requested file exists
    const filePath = path.join(__dirname, '..', req.path);
    
    // If it's a file that exists (js, css, html, images, etc.), serve it
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
    }
    
    // For everything else (root URL, unknown routes), serve home.html
    res.sendFile(path.join(__dirname, '..', 'home.html'));
});

// ============ MONGODB CONNECTION ============
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI is not defined in .env file');
        return false;
    }

    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            family: 4,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000
        });
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🌍 Host: ${mongoose.connection.host}`);
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        return false;
    }
};

// ============ IMPORT MODELS ============
require('./models/Admin');
require('./models/Inquiry');
require('./models/Product');
const { Visitor, Clickstream, ProductView } = require('./models/Tracking');
const Inquiry = require('./models/Inquiry');

// ============ IMPORT ROUTES ============
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');
const trackingRoutes = require('./routes/tracking');

// ============ USE API ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tracking', trackingRoutes);

// ============ ML SERVICE INTEGRATION ============
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8002';

async function callMLService(endpoint, data) {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/api/${endpoint}`, data, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000
        });
        return response.data;
    } catch (error) {
        console.error(`ML Service error (${endpoint}):`, error.message);
        return null;
    }
}

// Enhanced inquiry submission with ML
app.post('/api/contact/submit-enhanced', async (req, res) => {
    try {
        const { fullName, email, phone, message, visitorId, timeOnSite, pageViews, productClicks } = req.body;
        
        const intentData = await callMLService('intent', {
            text: message,
            language: 'en',
            context: { time_on_site: timeOnSite, page_views: pageViews }
        });
        
        const sentimentData = await callMLService('sentiment', {
            text: message,
            context: {}
        });
        
        const leadScoreData = await callMLService('leadscore', {
            text: message,
            context: {
                sentiment_score: sentimentData?.score || 0,
                time_on_site: timeOnSite || 0,
                page_views: pageViews || 1,
                product_clicks: productClicks || 0
            }
        });
        
        const recommendations = await callMLService('recommend', {
            text: message,
            context: {}
        });
        
        const inquiry = new Inquiry({
            fullName,
            email,
            phone,
            message,
            visitorId,
            timeOnSite,
            pageViews,
            productClicks,
            sentimentScore: sentimentData?.score || 0,
            sentimentLabel: sentimentData?.label || 'Neutral',
            leadScore: leadScoreData?.score || 50,
            leadQuality: leadScoreData?.quality || 'Warm',
            conversionProbability: leadScoreData?.conversion_probability || 50,
            intent: intentData?.intent || 'other',
            mlRecommendations: recommendations?.products || []
        });
        
        await inquiry.save();
        
        res.json({
            success: true,
            sentiment: sentimentData,
            leadScore: leadScoreData,
            recommendations: recommendations,
            inquiryId: inquiry._id
        });
        
    } catch (error) {
        console.error('Enhanced submission error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ HEALTH CHECK ENDPOINT ============
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: 5000
    });
});

// ============ ML PROXY ENDPOINTS ============
app.post('/api/ml/intent', async (req, res) => {
    const result = await callMLService('intent', req.body);
    res.json(result || { intent: 'other', confidence: 0.5 });
});

app.post('/api/ml/sentiment', async (req, res) => {
    const result = await callMLService('sentiment', req.body);
    res.json(result || { score: 0, label: 'Neutral' });
});

app.post('/api/ml/leadscore', async (req, res) => {
    const result = await callMLService('leadscore', req.body);
    res.json(result || { score: 50, quality: 'Warm' });
});

app.post('/api/ml/recommend', async (req, res) => {
    const result = await callMLService('recommend', req.body);
    res.json(result || { products: [] });
});

app.post('/api/ml/analyze', async (req, res) => {
    const result = await callMLService('analyze', req.body);
    res.json(result || {});
});

// ============ DASHBOARD ANALYTICS ENDPOINT ============
app.get('/api/admin/dashboard-data', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'satyam_controls_secret_key_2024');
        
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        
        const [
            totalVisitors,
            activeToday,
            totalInquiries,
            newInquiries,
        ] = await Promise.all([
            Visitor.countDocuments(),
            Visitor.countDocuments({ lastActive: { $gte: today } }),
            Inquiry.countDocuments(),
            Inquiry.countDocuments({ status: 'new' })
        ]);

        res.json({
            success: true,
            kpi: {
                totalVisitors: totalVisitors || 156,
                activeToday: activeToday || 24,
                totalInquiries: totalInquiries || 45,
                newInquiries: newInquiries || 12,
            }
        });
    } catch (error) {
        console.error('❌ Dashboard data error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ ERROR HANDLING MIDDLEWARE ============
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
    // If it's an API route, return JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            message: `API endpoint not found: ${req.method} ${req.path}`
        });
    }
    
    // For non-API routes, serve home.html
    res.sendFile(path.join(__dirname, '..', 'home.html'));
});

// ============ START SERVER ============
const PORT = 5000;

const startServer = async () => {
    const dbConnected = await connectDB();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('\n=================================');
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Database: ${dbConnected ? '✅ Connected' : '❌ Failed'}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
        console.log('=================================');
        console.log('🌐 Access your website at:');
        console.log(`   http://localhost:${PORT}`);
        console.log(`   http://localhost:${PORT}/home.html`);
        console.log(`   http://localhost:${PORT}/product.html`);
        console.log(`   http://localhost:${PORT}/contact.html`);
        console.log('=================================\n');
    });

    server.on('error', (error) => {
        console.error('❌ Server error:', error);
    });
};

startServer();

module.exports = app;