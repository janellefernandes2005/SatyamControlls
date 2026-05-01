// login.ts - COMPLETE WORKING VERSION
class LoginHandler {
    constructor() {
        this.tempToken = '';
        this.init();
    }
    init() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleLogin(e));
        }
        this.checkAuthStatus();
    }
    async checkAuthStatus() {
        const token = localStorage.getItem('adminToken');
        if (!token)
            return;
        try {
            const response = await fetch('/api/auth/check', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.authenticated) {
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
        const errorDiv = document.getElementById('error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        if (!username || !password) {
            if (errorDiv) {
                errorDiv.textContent = 'Please enter both username and password';
                errorDiv.style.display = 'block';
            }
            return;
        }
        const originalText = loginBtn.innerHTML;
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (result.success && result.requiresOTP) {
                this.tempToken = result.tempToken;
                this.showOTPModal();
            }
            else if (result.success && result.accessToken) {
                localStorage.setItem('adminToken', result.accessToken);
                window.location.href = 'admin-dashboard.html';
            }
            else {
                if (errorDiv) {
                    errorDiv.textContent = result.message || 'Login failed';
                    errorDiv.style.display = 'block';
                }
            }
        }
        catch (error) {
            if (errorDiv) {
                errorDiv.textContent = 'Cannot connect to server. Please try again.';
                errorDiv.style.display = 'block';
            }
        }
        finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalText;
        }
    }
    showOTPModal() {
        const modalHTML = `
        <div id="otpModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 9999;">
            <div style="background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 400px; text-align: center;">
                <h3>🔐 Verification Code</h3>
                <p>Enter the OTP sent to your email</p>
                <input type="text" id="otpInput" maxlength="6" style="width: 200px; padding: 15px; font-size: 24px; text-align: center; letter-spacing: 5px;">
                <div style="margin-top: 20px;">
                    <button id="verifyOTP" style="background: #292C36; color: white; padding: 12px 30px; border-radius: 8px; cursor: pointer;">Verify</button>
                    <button id="cancelOTP" style="background: #eee; padding: 12px 20px; border-radius: 8px; margin-left: 10px;">Cancel</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('verifyOTP')?.addEventListener('click', () => this.verifyOTP());
        document.getElementById('cancelOTP')?.addEventListener('click', () => this.closeOTPModal());
    }
    closeOTPModal() {
        document.getElementById('otpModal')?.remove();
    }
    async verifyOTP() {
        const otpInput = document.getElementById('otpInput');
        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken: this.tempToken, otp: otpInput.value })
            });
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('adminToken', result.accessToken);
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
