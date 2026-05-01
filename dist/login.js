// login.ts - REDIRECTION UPDATED
const API_BASE = 'http://localhost:8000/api';
class LoginHandler {
    constructor() {
        this.tempToken = '';
        this.currentStep = 'login';
        this.init();
    }
    init() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleLogin(e));
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (usernameInput)
                usernameInput.autocomplete = 'username';
            if (passwordInput)
                passwordInput.autocomplete = 'current-password';
        }
        this.checkAuthStatus();
    }
    async checkAuthStatus() {
        const token = localStorage.getItem('adminToken');
        if (!token)
            return;
        try {
            const response = await fetch(`${API_BASE}/auth/check`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.authenticated) {
                // REDIRECT TO YOUR SPECIFIC FILENAME
                window.location.href = 'admin-dashboard.html';
            }
            else {
                localStorage.removeItem('adminToken');
            }
        }
        catch (error) {
            console.log('Auth check failed');
        }
    }
    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        const errorDiv = document.getElementById('error'); // Updated to match HTML ID
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }
        const originalText = loginBtn.innerHTML;
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (result.success && result.requiresOTP) {
                this.tempToken = result.tempToken;
                this.currentStep = 'otp';
                this.showOTPModal(result.debug?.otp, result.message);
            }
            else {
                this.showError(result.message || 'Login failed');
            }
        }
        catch (error) {
            this.showError('Cannot connect to server. Ensure port 8000 is running.');
        }
        finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalText;
        }
    }
    showError(message) {
        const errorDiv = document.getElementById('error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        else {
            alert(message);
        }
    }
    showOTPModal(debugOTP, message) {
        const modalHTML = `
        <div id="otpModal" class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 9999;">
            <div class="modal-content" style="background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 450px; text-align: center;">
                <h3 style="color: #292C36;">🔐 Verification Code</h3>
                <p style="color: #666;">${message || 'Enter your code'}</p>
                <input type="text" id="otpInput" maxlength="6" style="width: 220px; padding: 15px; font-size: 24px; text-align: center; letter-spacing: 8px;">
                ${debugOTP ? `<div style="margin:10px; color:green;"><small>DEBUG OTP: ${debugOTP}</small></div>` : ''}
                <div style="margin-top: 20px;">
                    <button id="verifyOTP" style="background: #292C36; color: white; padding: 12px 30px; border-radius: 8px; cursor: pointer;">Verify</button>
                    <button id="cancelOTP" style="background: #eee; padding: 12px 20px; border-radius: 8px; margin-left: 10px;">Cancel</button>
                </div>
                <div id="otpMessage"></div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('otpInput')?.focus();
        document.getElementById('verifyOTP')?.addEventListener('click', () => this.verifyOTP());
        document.getElementById('cancelOTP')?.addEventListener('click', () => this.closeOTPModal());
    }
    closeOTPModal() {
        document.getElementById('otpModal')?.remove();
        this.currentStep = 'login';
    }
    async verifyOTP() {
        const otpInput = document.getElementById('otpInput');
        const verifyBtn = document.getElementById('verifyOTP');
        try {
            const response = await fetch(`${API_BASE}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken: this.tempToken, otp: otpInput.value })
            });
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('adminToken', result.accessToken);
                // REDIRECT TO YOUR SPECIFIC FILENAME
                window.location.href = 'admin-dashboard.html';
            }
            else {
                alert(result.message || 'Invalid OTP');
            }
        }
        catch (error) {
            alert('Verification failed');
        }
    }
}
document.addEventListener('DOMContentLoaded', () => new LoginHandler());
