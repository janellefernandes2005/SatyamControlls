// contact.ts - COMPLETE WORKING VERSION
class ContactForm {
    constructor() {
        this.form = document.getElementById('inquiry-form');
        this.visitorId = this.getOrCreateVisitorId();
        this.startTime = Date.now();
        if (this.form) {
            this.init();
        }
    }
    getOrCreateVisitorId() {
        let id = localStorage.getItem('satyam_visitor_id');
        if (!id) {
            id = 'VIS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            localStorage.setItem('satyam_visitor_id', id);
        }
        return id;
    }
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    async handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone') || 'Not provided',
            subject: formData.get('subject') || 'General Inquiry',
            message: formData.get('message'),
            company: formData.get('company') || '',
            visitorId: this.visitorId,
            timeOnSite: Math.round((Date.now() - this.startTime) / 1000),
        };
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        try {
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                alert('✓ Message sent successfully! Our team will contact you shortly.');
                this.form.reset();
            }
            else {
                alert(`❌ Error: ${result.message || 'Something went wrong'}`);
            }
        }
        catch (error) {
            console.error('Submit error:', error);
            alert('⚠️ Connection issue! Please try again.');
        }
        finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});
