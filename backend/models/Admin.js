// backend/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    twoFactorEnabled: {
        type: Boolean,
        default: true
    },
    twoFactorCode: {
        type: String,
        default: null
    },
    twoFactorExpiry: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        ip: String,
        userAgent: String,
        success: Boolean
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    this.updatedAt = new Date();
    next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Clear old 2FA codes (cleanup method)
adminSchema.methods.clearExpiredCodes = function() {
    if (this.twoFactorExpiry && new Date() > this.twoFactorExpiry) {
        this.twoFactorCode = null;
        this.twoFactorExpiry = null;
    }
};

module.exports = mongoose.model('Admin', adminSchema);