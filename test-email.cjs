// test-email.cjs - UPDATED
require('dotenv').config();

console.log('📁 Current directory:', __dirname);
console.log('📁 Backend folder exists:', require('fs').existsSync('./backend'));
console.log('📁 Utils folder exists:', require('fs').existsSync('./backend/utils'));

if (require('fs').existsSync('./backend/utils/emailService.js')) {
    console.log('✅ Found email service file in backend/utils/');
    
    try {
        // Point to backend folder
        const { send2FACode } = require('./backend/utils/emailService.js');
        console.log('✅ Email service loaded');
        
        // Test it
        send2FACode('janelle.fernandes2005@gmail.com', '123456')
            .then(result => {
                console.log('📧 Result:', result ? '✅ Success' : '❌ Failed');
            })
            .catch(err => {
                console.error('❌ Error:', err.message);
            });
    } catch (err) {
        console.error('❌ Failed to load:', err.message);
    }
} else {
    console.log('❌ Email service not found');
}