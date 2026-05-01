// contact.ts - Form handling and validation
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ContactFormHandler = /** @class */ (function () {
    function ContactFormHandler() {
        this.formData = {
            fullName: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        };
        this.form = document.getElementById('inquiry-form');
        this.submitBtn = document.getElementById('submitBtn');
        this.initialize();
    }
    ContactFormHandler.prototype.initialize = function () {
        if (this.form) {
            this.setupEventListeners();
            this.setupInfoBoxHover();
        }
    };
    ContactFormHandler.prototype.setupEventListeners = function () {
        var _this = this;
        var _a, _b;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) { return _this.handleSubmit(e); });
        // Add input validation on blur
        var inputs = (_b = this.form) === null || _b === void 0 ? void 0 : _b.querySelectorAll('input, textarea, select');
        inputs === null || inputs === void 0 ? void 0 : inputs.forEach(function (input) {
            input.addEventListener('blur', function () { return _this.validateField(input); });
        });
    };
    ContactFormHandler.prototype.validateField = function (field) {
        var value = field.value.trim();
        var fieldName = field.id;
        switch (fieldName) {
            case 'fullName':
                if (value.length < 2) {
                    this.showFieldError(field, 'Name must be at least 2 characters long');
                    return false;
                }
                break;
            case 'email':
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'phone':
                var phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
            case 'subject':
                if (!value) {
                    this.showFieldError(field, 'Please select a subject');
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    this.showFieldError(field, 'Message must be at least 10 characters long');
                    return false;
                }
                break;
        }
        this.clearFieldError(field);
        return true;
    };
    ContactFormHandler.prototype.showFieldError = function (field, message) {
        var _a;
        this.clearFieldError(field);
        var errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        field.style.borderColor = '#e74c3c';
        (_a = field.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(errorDiv, field.nextSibling);
    };
    ContactFormHandler.prototype.clearFieldError = function (field) {
        field.style.borderColor = '#666B64';
        var nextElement = field.nextElementSibling;
        if (nextElement && nextElement.classList.contains('field-error')) {
            nextElement.remove();
        }
    };
    ContactFormHandler.prototype.gatherFormData = function () {
        if (!this.form)
            return;
        this.formData = {
            fullName: this.form.querySelector('#fullName').value.trim(),
            email: this.form.querySelector('#email').value.trim(),
            phone: this.form.querySelector('#phone').value.trim(),
            subject: this.form.querySelector('#subject').value,
            message: this.form.querySelector('#message').value.trim()
        };
    };
    ContactFormHandler.prototype.validateAllFields = function () {
        var _this = this;
        if (!this.form)
            return false;
        var fields = [
            this.form.querySelector('#fullName'),
            this.form.querySelector('#email'),
            this.form.querySelector('#phone'),
            this.form.querySelector('#subject'),
            this.form.querySelector('#message')
        ];
        var isValid = true;
        fields.forEach(function (field) {
            if (!_this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    };
    ContactFormHandler.prototype.handleSubmit = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        this.gatherFormData();
                        if (!this.validateAllFields()) {
                            this.showNotification('Please fix all errors before submitting', 'error');
                            return [2 /*return*/];
                        }
                        // Disable submit button and show loading
                        if (this.submitBtn) {
                            this.submitBtn.disabled = true;
                            this.submitBtn.textContent = 'Sending...';
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        // Here you would typically send data to your backend API
                        // For now, we'll simulate an API call
                        return [4 /*yield*/, this.sendFormDataToBackend()];
                    case 2:
                        // Here you would typically send data to your backend API
                        // For now, we'll simulate an API call
                        _a.sent();
                        this.showNotification('Message sent successfully! We will get back to you soon.', 'success');
                        this.resetForm();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error submitting form:', error_1);
                        this.showNotification('Failed to send message. Please try again.', 'error');
                        return [3 /*break*/, 5];
                    case 4:
                        // Re-enable submit button
                        if (this.submitBtn) {
                            this.submitBtn.disabled = false;
                            this.submitBtn.textContent = 'Send Message';
                        }
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ContactFormHandler.prototype.sendFormDataToBackend = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Simulate API call delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                    case 1:
                        // Simulate API call delay
                        _a.sent();
                        // In a real application, you would make an actual API call here
                        // Example using fetch:
                        /*
                        const response = await fetch('https://your-api-endpoint.com/contact', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(this.formData)
                        });
                        
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        */
                        // For demo, log the data to console
                        console.log('Form data to be sent:', this.formData);
                        return [2 /*return*/];
                }
            });
        });
    };
    ContactFormHandler.prototype.showNotification = function (message, type) {
        // Remove existing notification
        var existingNotification = document.querySelector('.form-notification');
        if (existingNotification)
            existingNotification.remove();
        var notification = document.createElement('div');
        notification.className = "form-notification notification-".concat(type);
        notification.textContent = message;
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.fontWeight = '600';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.style.animation = 'slideIn 0.3s ease';
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
            notification.style.border = '1px solid #229954';
        }
        else {
            notification.style.backgroundColor = '#e74c3c';
            notification.style.border = '1px solid #c0392b';
        }
        document.body.appendChild(notification);
        // Add CSS animation if not already present
        if (!document.querySelector('#notification-styles')) {
            var style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = "\n                @keyframes slideIn {\n                    from {\n                        transform: translateX(100%);\n                        opacity: 0;\n                    }\n                    to {\n                        transform: translateX(0);\n                        opacity: 1;\n                    }\n                }\n                \n                @keyframes slideOut {\n                    from {\n                        transform: translateX(0);\n                        opacity: 1;\n                    }\n                    to {\n                        transform: translateX(100%);\n                        opacity: 0;\n                    }\n                }\n            ";
            document.head.appendChild(style);
        }
        // Remove notification after 5 seconds
        setTimeout(function () {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(function () { return notification.remove(); }, 300);
        }, 5000);
    };
    ContactFormHandler.prototype.resetForm = function () {
        if (this.form) {
            this.form.reset();
            this.formData = {
                fullName: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            };
            // Clear any remaining error messages
            var errors = this.form.querySelectorAll('.field-error');
            errors.forEach(function (error) { return error.remove(); });
            // Reset border colors
            var inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(function (input) {
                input.style.borderColor = '#666B64';
            });
        }
    };
    ContactFormHandler.prototype.setupInfoBoxHover = function () {
        var infoBoxes = document.querySelectorAll('.info-box');
        infoBoxes.forEach(function (box) {
            box.addEventListener('mouseenter', function () {
                box.style.transform = 'translateY(-5px)';
                box.style.boxShadow = '0 10px 20px rgba(102, 107, 100, 0.15)';
            });
            box.addEventListener('mouseleave', function () {
                box.style.transform = 'translateY(0)';
                box.style.boxShadow = 'none';
            });
        });
    };
    return ContactFormHandler;
}());
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    var contactForm = new ContactFormHandler();
    // Optional: Add phone number formatting
    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            var target = e.target;
            target.value = target.value.replace(/\D/g, '');
        });
    }
});
