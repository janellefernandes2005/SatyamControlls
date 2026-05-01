// backend/utils/emailService.js - UPDATED
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Send OTP (Existing)
exports.send2FACode = async (email, code) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Satyam Controls <satyam@resend.dev>',
            to: email,
            subject: `Your Login Code: ${code}`,
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2>SATYAM CONTROLS</h2>
                    <p>Your OTP code is: <strong>${code}</strong></p>
                    <p>Valid for 2 minutes.</p>
                </div>
            `
        });
        return !error;
    } catch (error) {
        return false;
    }
};

// NEW: Send Inquiry Notification (Fixes the "not a function" error)
exports.sendInquiryNotification = async (data) => {
    try {
        const { data: resData, error } = await resend.emails.send({
            from: 'Satyam Controls <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL || 'janelle.fernandes2005@gmail.com',
            subject: `New Inquiry: ${data.subject}`,
            html: `
                <div style="font-family: Arial; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #2d3436;">New Inquiry Received</h2>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
                    <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${data.subject}</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <strong>Message:</strong><br/>
                        ${data.message}
                    </div>
                    <p style="font-size: 12px; color: #999; margin-top: 20px;">Sent from IP: ${data.ipAddress}</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Email Service Error:', error);
        return false;
    }
};