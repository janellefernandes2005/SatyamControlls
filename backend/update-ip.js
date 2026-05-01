// update-ip.js
const https = require('https');
const axios = require('axios');

async function getCurrentIP() {
    return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org?format=json', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result.ip);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

async function checkAndUpdateIP() {
    try {
        const currentIP = await getCurrentIP();
        console.log(`🌐 Your current IP: ${currentIP}`);
        
        // This IP will work until you disconnect
        console.log('\n📝 Add this IP to MongoDB Atlas:');
        console.log(`   ${currentIP}/32`);
        console.log('\n💡 Steps:');
        console.log('1. Go to: https://cloud.mongodb.com');
        console.log('2. Click "Network Access"');
        console.log('3. Click "Add IP Address"');
        console.log('4. Enter: ' + currentIP + '/32');
        console.log('5. Click "Confirm"');
        console.log('\n✅ This IP will work until you disconnect from current network');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkAndUpdateIP();