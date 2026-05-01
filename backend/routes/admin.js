const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');

// ============================================
// PUBLIC ROUTES (No authentication needed)
// ============================================

// Create admin account (first time setup)
router.post('/init', async (req, res) => {
    try {
        console.log('🔧 Creating admin account...');
        
        // Check if admin already exists
        let admin = await Admin.findOne({ username: 'admin' });
        
        if (admin) {
            console.log('✅ Admin already exists');
            return res.json({
                success: true,
                message: 'Admin account already exists',
                username: admin.username,
                email: admin.email,
                createdAt: admin.createdAt
            });
        }
        
        // Create new admin account
        admin = new Admin({
            username: 'admin',
            password: 'satyamcontrols', // This will be hashed automatically by the model
            email: 'janelle.fernandes2005@gmail.com',
            twoFactorEnabled: false
        });
        
        await admin.save();
        
        console.log('✅ Admin account created successfully!');
        res.json({
            success: true,
            message: 'Admin account created successfully!',
            username: 'admin',
            email: admin.email,
            password: 'satyamcontrols', // Only for initial setup
            createdAt: admin.createdAt
        });
        
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Check if admin exists
router.get('/check', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: 'admin' });
        
        if (!admin) {
            return res.json({
                exists: false,
                message: 'Admin account not found. Please run /api/admin/init first.'
            });
        }
        
        res.json({
            exists: true,
            username: admin.username,
            email: admin.email,
            twoFactorEnabled: admin.twoFactorEnabled,
            createdAt: admin.createdAt,
            lastLogin: admin.lastLogin
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Simple login (for testing without 2FA)
router.post('/login-simple', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log(`🔐 Login attempt: ${username}`);
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password required'
            });
        }
        
        // Find admin
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            console.log('❌ Admin not found:', username);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check password
        const validPassword = await admin.comparePassword(password);
        
        if (!validPassword) {
            console.log('❌ Invalid password for:', username);
            
            // Log failed attempt
            admin.loginHistory.push({
                timestamp: new Date(),
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                success: false
            });
            await admin.save();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        console.log('✅ Login successful for:', username);
        
        // Generate JWT token
        const token = jwt.sign(
            {
                adminId: admin._id,
                username: admin.username,
                email: admin.email
            },
            process.env.JWT_SECRET || 'satyam_controls_secret_key_2024',
            { expiresIn: '24h' }
        );
        
        // Update last login
        admin.lastLogin = new Date();
        admin.loginHistory.push({
            timestamp: new Date(),
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            success: true
        });
        await admin.save();
        
        res.json({
            success: true,
            message: 'Login successful',
            accessToken: token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                twoFactorEnabled: admin.twoFactorEnabled
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// Middleware to check admin token
// ============================================
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'satyam_controls_secret_key_2024');
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

// ============================================
// PROTECTED ROUTES (Require authentication)
// ============================================

// Get dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const totalInquiries = await Inquiry.countDocuments();
        const newInquiries = await Inquiry.countDocuments({ status: 'new' });
        const totalProducts = await Product.countDocuments();
        const admin = await Admin.findOne({ username: 'admin' });

        res.json({
            success: true,
            totalInquiries,
            newInquiries,
            totalProducts,
            recentLogins: admin?.loginHistory?.slice(-5).reverse() || [],
            lastLogin: admin?.lastLogin
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Get all inquiries
router.get('/inquiries', authMiddleware, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            inquiries
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Update inquiry status
router.put('/inquiries/:id', authMiddleware, async (req, res) => {
    try {
        const { status, note } = req.body;
        const inquiry = await Inquiry.findById(req.params.id);
        
        if (!inquiry) {
            return res.status(404).json({ 
                success: false,
                message: 'Inquiry not found' 
            });
        }

        if (status) inquiry.status = status;
        
        if (note) {
            inquiry.notes.push({
                content: note,
                admin: 'admin',
                createdAt: new Date()
            });
        }

        await inquiry.save();
        res.json({ 
            success: true, 
            inquiry 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Test protected route
router.get('/test-auth', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'You are authenticated!',
        adminId: req.adminId
    });
});router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const totalInquiries = await Inquiry.countDocuments();
        const newInquiries = await Inquiry.countDocuments({ status: 'new' });
        const totalProducts = await Product.countDocuments(); // Real product count

        res.json({
            success: true,
            totalInquiries,
            newInquiries,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;