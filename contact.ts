// contact.ts - COMPLETE WITH REAL TRACKING AND SENTIMENT ANALYSIS
class ContactForm {
    private form: HTMLFormElement;
    private visitorId: string;
    private startTime: number;
    private pageViews: number;
    private productClicks: number;
    private heartbeatInterval: number | null = null;
    private sessionId: string;
    private successMessageDiv: HTMLDivElement | null = null;
    
    constructor() {
        this.form = document.getElementById('inquiry-form') as HTMLFormElement;
        this.visitorId = this.getOrCreateVisitorId();
        this.startTime = Date.now();
        this.pageViews = this.getPageViews();
        this.productClicks = this.getProductClicks();
        this.sessionId = this.getOrCreateSessionId();
        
        if (this.form) {
            this.init();
            this.startTracking();
            this.createSuccessMessageDiv();
        } else {
            console.error('Form element not found!');
        }
    }
    
    // Create a subtle success message div
    private createSuccessMessageDiv(): void {
        this.successMessageDiv = document.createElement('div');
        this.successMessageDiv.id = 'form-success-message';
        this.successMessageDiv.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #4caf9e;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(this.successMessageDiv);
    }
    
    private showSuccessMessage(message: string): void {
        if (this.successMessageDiv) {
            this.successMessageDiv.textContent = message;
            this.successMessageDiv.style.opacity = '1';
            setTimeout(() => {
                if (this.successMessageDiv) {
                    this.successMessageDiv.style.opacity = '0';
                }
            }, 3000);
        }
    }
    
    // Generate or retrieve visitor ID
    private getOrCreateVisitorId(): string {
        let id = localStorage.getItem('satyam_visitor_id');
        if (!id) {
            id = 'VIS-' + Math.random().toString(36).substring(2, 10).toUpperCase() + 
                 '-' + Date.now().toString(36).toUpperCase();
            localStorage.setItem('satyam_visitor_id', id);
        }
        return id;
    }
    
    // Generate session ID
    private getOrCreateSessionId(): string {
        let sessionId = sessionStorage.getItem('satyam_session_id');
        if (!sessionId) {
            sessionId = 'SESS-' + Math.random().toString(36).substring(2, 15).toUpperCase();
            sessionStorage.setItem('satyam_session_id', sessionId);
        }
        return sessionId;
    }
    
    // Get page views count
    private getPageViews(): number {
        let views = parseInt(sessionStorage.getItem('page_views') || '0');
        views++;
        sessionStorage.setItem('page_views', views.toString());
        return views;
    }
    
    // Get product clicks from localStorage
    private getProductClicks(): number {
        return parseInt(localStorage.getItem('product_clicks') || '0');
    }
    
    private init(): void {
        console.log('🚀 Contact form initialized with visitor:', this.visitorId);
        this.addValidationListeners();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.trackPageView();
        this.trackFormInteraction();
    }
    
    private startTracking(): void {
        // Send heartbeat every 10 seconds
        this.heartbeatInterval = window.setInterval(() => {
            this.sendHeartbeat();
        }, 10000);
        
        // Track when user leaves
        window.addEventListener('beforeunload', () => {
            this.sendFinalTracking();
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
            }
        });
    }
    
    private trackPageView(): void {
        const pageData = {
            visitorId: this.visitorId,
            sessionId: this.sessionId,
            page: 'contact.html',
            timestamp: new Date().toISOString(),
            duration: 0,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent
        };
        
        // Send to backend
        fetch('  /api/tracking/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pageData),
            keepalive: true
        }).catch(() => {
            this.storeTrackingData(pageData);
        });
        
        // Track form start
        this.trackFormStart();
    }
    
    private trackFormStart(): void {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                fetch('  /api/tracking/pageview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        visitorId: this.visitorId,
                        sessionId: this.sessionId,
                        page: 'contact.html',
                        type: 'form_start',
                        timestamp: new Date().toISOString()
                    }),
                    keepalive: true
                }).catch(() => {});
            }, { once: true });
        });
    }
    
    private sendHeartbeat(): void {
        const activeTime = Math.round((Date.now() - this.startTime) / 1000);
        
        fetch('  /api/tracking/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                visitorId: this.visitorId,
                page: 'contact.html',
                activeTime: activeTime
            }),
            keepalive: true
        }).catch(() => {
            this.storeTrackingData({
                type: 'heartbeat',
                visitorId: this.visitorId,
                activeTime,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    private sendFinalTracking(): void {
        const totalTime = Math.round((Date.now() - this.startTime) / 1000);
        
        const data = {
            visitorId: this.visitorId,
            sessionId: this.sessionId,
            page: 'contact.html',
            duration: totalTime,
            timestamp: new Date().toISOString(),
            type: 'exit'
        };
        
        // Use sendBeacon for reliable delivery during page unload
        navigator.sendBeacon('  /api/tracking/pageview', 
            JSON.stringify(data));
    }
    
    private trackFormInteraction(): void {
        // Track when user starts typing
        const messageField = this.form.querySelector('[name="message"]') as HTMLTextAreaElement;
        if (messageField) {
            messageField.addEventListener('input', () => {
                if (messageField.value.length === 1) {
                    fetch('  /api/tracking/pageview', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            visitorId: this.visitorId,
                            sessionId: this.sessionId,
                            page: 'contact.html',
                            type: 'form_interaction',
                            timestamp: new Date().toISOString()
                        }),
                        keepalive: true
                    }).catch(() => {});
                }
            }, { once: true });
        }
    }
    
    private storeTrackingData(data: any): void {
        try {
            const stored = JSON.parse(localStorage.getItem('tracking_queue') || '[]');
            stored.push({
                ...data,
                queuedAt: new Date().toISOString()
            });
            // Keep only last 100 items
            localStorage.setItem('tracking_queue', JSON.stringify(stored.slice(-100)));
        } catch (e) {
            console.error('Failed to store tracking data:', e);
        }
    }
    
    private addValidationListeners(): void {
        const requiredInputs = this.form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input as HTMLInputElement | HTMLTextAreaElement);
            });
            input.addEventListener('blur', () => {
                this.validateField(input as HTMLInputElement | HTMLTextAreaElement);
            });
        });
    }
    
    private validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && value === '') {
            field.style.borderColor = '#ff6b6b';
            return false;
        }
        
        if (field.type === 'email' && value !== '') {
            return this.validateEmail(field as HTMLInputElement);
        }
        
        field.style.borderColor = '#51cf66';
        return true;
    }
    
    private validateEmail(emailField: HTMLInputElement): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailField.value.trim());
        emailField.style.borderColor = isValid ? '#51cf66' : '#ff6b6b';
        return isValid;
    }
    
    private validateForm(): { isValid: boolean; errors: string[] } {
        const requiredFields = this.form.querySelectorAll('[required]');
        const errors: string[] = [];
        let allValid = true;
        
        requiredFields.forEach(field => {
            const inputField = field as HTMLInputElement | HTMLTextAreaElement;
            const value = inputField.value.trim();
            
            if (value === '') {
                allValid = false;
                inputField.style.borderColor = '#ff6b6b';
                const label = inputField.previousElementSibling?.textContent?.replace('*', '').trim();
                errors.push(`${label || 'Field'} is required`);
            } else if (inputField.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    allValid = false;
                    inputField.style.borderColor = '#ff6b6b';
                    errors.push('Please enter a valid email address');
                } else {
                    inputField.style.borderColor = '#51cf66';
                }
            } else {
                inputField.style.borderColor = '#51cf66';
            }
        });
        
        return { isValid: allValid, errors };
    }
    
    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        
        const validation = this.validateForm();
        if (!validation.isValid) {
            alert(`⚠️ Please fix the following errors:\n\n• ${validation.errors.join('\n• ')}`);
            return;
        }
        
        const formData = new FormData(this.form);
        const message = formData.get('message') as string;
        
        const data = {
            fullName: formData.get('fullName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string || 'Not provided',
            subject: formData.get('subject') as string || 'General Inquiry',
            message: message,
            company: formData.get('company') as string || '',
            timestamp: new Date().toISOString(),
            visitorId: this.visitorId,
            sessionId: this.sessionId,
            timeOnSite: Math.round((Date.now() - this.startTime) / 1000),
            pageViews: this.pageViews,
            productClicks: this.productClicks,
            userAgent: navigator.userAgent
        };
        
        console.log('📤 Submitting inquiry...', data);
        
        const submitBtn = this.form.querySelector('.btn-submit') as HTMLButtonElement;
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            const response = await fetch('  /api/contact/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                mode: 'cors'
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Simple success message without AI insights
                this.showSuccessMessage('✓ Message sent successfully! Our team will contact you shortly.');
                
                this.logFormSubmission(data, true, result);
                this.form.reset();
                
                // Reset border colors
                const inputs = this.form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    (input as HTMLElement).style.borderColor = '';
                });
                
                // Track successful submission
                this.trackFormSubmission(true, result);
                
            } else {
                alert(`❌ Error: ${result.message || 'Something went wrong'}`);
                this.logFormSubmission(data, false, result);
            }
            
        } catch (error) {
            console.error('Submit error:', error);
            this.saveToLocalStorage(data);
            this.showSuccessMessage('⚠️ Connection issue! Your message has been saved locally and will be sent when connection is restored.');
            this.logFormSubmission(data, false, { error: 'Network error' });
            this.trackFormSubmission(false);
            
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    private trackFormSubmission(success: boolean, result?: any): void {
        fetch('  /api/tracking/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                page: 'contact.html',
                type: 'form_submit',
                metadata: {
                    success,
                    leadScore: result?.leadScore?.score,
                    sentiment: result?.sentiment?.label
                },
                timestamp: new Date().toISOString()
            }),
            keepalive: true
        }).catch(() => {});
    }
    
    private logFormSubmission(data: any, success: boolean, result?: any): void {
        const logs = JSON.parse(localStorage.getItem('submission_logs') || '[]');
        logs.push({
            deviceId: data.visitorId,
            timestamp: data.timestamp,
            success: success,
            leadScore: result?.leadScore?.score,
            sentimentLabel: result?.sentiment?.label,
            error: result?.error || null
        });
        localStorage.setItem('submission_logs', JSON.stringify(logs.slice(-50)));
    }
    
    private saveToLocalStorage(data: any): void {
        try {
            const storedMessages = JSON.parse(localStorage.getItem('pending_inquiries') || '[]');
            storedMessages.push({
                ...data,
                savedAt: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('pending_inquiries', JSON.stringify(storedMessages));
            console.log('📦 Saved to localStorage:', storedMessages.length, 'pending inquiries');
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
    
    // Retry pending submissions
    const retryPending = async () => {
        const pending = JSON.parse(localStorage.getItem('pending_inquiries') || '[]');
        if (pending.length > 0) {
            console.log(`🔄 Retrying ${pending.length} pending submissions...`);
            
            for (const inquiry of pending) {
                try {
                    const response = await fetch('  /api/contact/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(inquiry)
                    });
                    
                    if (response.ok) {
                        const index = pending.indexOf(inquiry);
                        pending.splice(index, 1);
                        localStorage.setItem('pending_inquiries', JSON.stringify(pending));
                        console.log('✅ Retry successful for:', inquiry.email);
                    }
                } catch (e) {
                    console.log('❌ Retry failed for:', inquiry.email);
                }
            }
        }
    };
    
    // Retry every 30 seconds
    setInterval(retryPending, 30000);
    retryPending();
});

export default ContactForm;