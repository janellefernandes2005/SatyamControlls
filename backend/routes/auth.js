// backend/routes/auth.js - SIMPLE NO DEBUG
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { send2FACode } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'satyam_controls_secret_key';

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        // Check password
        const validPass = await admin.comparePassword(password);
        if (!validPass) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP
        admin.twoFactorCode = otp;
        admin.twoFactorExpiry = new Date(Date.now() + 2 * 60 * 1000);
        await admin.save();
        
        // Send OTP via email
        await send2FACode(admin.email, otp);
        
        // Create temp token
        const tempToken = jwt.sign(
            { 
                adminId: admin._id,
                action: 'otp_verification'
            },
            JWT_SECRET,
            { expiresIn: '2m' }
        );
        
        res.json({
            success: true,
            requiresOTP: true,
            tempToken: tempToken,
            message: 'OTP sent to your email'
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error'
        });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { tempToken, otp } = req.body;
        
        // Verify temp token
        const decoded = jwt.verify(tempToken, JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId);
        
        if (!admin) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid session' 
            });
        }
        
        // Check OTP expiry
        if (!admin.twoFactorExpiry || new Date() > admin.twoFactorExpiry) {
            return res.status(401).json({ 
                success: false,
                message: 'OTP expired' 
            });
        }
        
        // Verify OTP
        if (admin.twoFactorCode !== otp) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid OTP' 
            });
        }
        
        // Clear OTP
        admin.twoFactorCode = undefined;
        admin.twoFactorExpiry = undefined;
        admin.lastLogin = new Date();
        await admin.save();
        
        // Create final token
        const accessToken = jwt.sign(
            { 
                adminId: admin._id,
                username: admin.username
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            message: 'Login successful!',
            accessToken: accessToken
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error'
        });
    }
});
// ============ CHECK TOKEN VALIDITY - ADD THIS ENDPOINT ============
router.get('/check', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId).select('-password -twoFactorCode -twoFactorExpiry');
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }

        res.json({
            success: true,
            authenticated: true,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                twoFactorEnabled: admin.twoFactorEnabled || false
            }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
});
module.exports = router;