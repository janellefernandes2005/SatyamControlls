// backend/test-connection-final.js
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log('🔌 Testing MongoDB Atlas Connection');
    console.log('='.repeat(60));
    
    // Check if .env file exists and has MONGODB_URI
    const connString = process.env.MONGODB_URI;
    
    if (!connString) {
        console.log('❌ ERROR: MONGODB_URI not found in .env file');
        console.log('\nPlease make sure your .env file has:');
        console.log('MONGODB_URI=mongodb+srv://janellefernandes2005_db_user:YOUR_PASSWORD@cluster0.ggtzdob.mongodb.net/satyam_controls?retryWrites=true&w=majority&appName=Cluster0');
        return;
    }
    
    // Show safe version (hide password)
    const safeString = connString.replace(/:([^:@]+)@/, ':****@');
    console.log('✅ Connection String Found:', safeString);
    console.log('📦 MongoDB Driver Version:', mongoose.version);
    
    try {
        console.log('\n⏳ Connecting to MongoDB Atlas...');
        
        // Connect to MongoDB
        await mongoose.connect(connString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000,
        });
        
        console.log('\n✅ SUCCESS: Connected to MongoDB Atlas!');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
        console.log('📍 Host:', mongoose.connection.host);
        console.log('🚪 Port:', mongoose.connection.port || '27017 (default)');
        
        // Check connection state
        console.log('🔗 Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
        
        // Create a test collection and document
        console.log('\n🧪 Creating test document...');
        
        const TestSchema = new mongoose.Schema({
            name: String,
            timestamp: { type: Date, default: Date.now },
            test: { type: String, default: 'MongoDB Connection Test' }
        });
        
        const Test = mongoose.model('TestConnection', TestSchema);
        
        // Create test document
        const testDoc = await Test.create({ 
            name: 'First Test from Satyam Controls',
            message: 'This confirms MongoDB is working!' 
        });
        
        console.log('✅ Test document created successfully!');
        console.log('📄 Document ID:', testDoc._id);
        console.log('🕒 Created at:', testDoc.timestamp);
        
        // Count total test documents
        const count = await Test.countDocuments();
        console.log(`📊 Total test documents in collection: ${count}`);
        
        // List all collections
        console.log('\n📁 Listing all collections:');
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        if (collections.length === 0) {
            console.log('No collections found (this is normal for new database)');
        } else {
            collections.forEach((col, index) => {
                console.log(`${index + 1}. ${col.name}`);
            });
        }
        
        console.log('\n🎉 CONNECTION TEST COMPLETE!');
        console.log('='.repeat(60));
        console.log('Your MongoDB Atlas is working perfectly!');
        console.log('You can now upload your 42 product images.');
        
        // Don't disconnect - keep connection open for next operations
        console.log('\n💡 Tip: Keep this connection open and open a new terminal');
        console.log('to run: node server.js');
        
    } catch (error) {
        console.log('\n❌ CONNECTION FAILED!');
        console.log('Error Message:', error.message);
        
        console.log('\n🔧 TROUBLESHOOTING STEPS:');
        console.log('='.repeat(40));
        console.log('1. Check Network Access in MongoDB Atlas:');
        console.log('   - Go to https://cloud.mongodb.com');
        console.log('   - Click "Network Access"');
        console.log('   - Make sure IP 150.107.97.250 is added');
        console.log('   - Status should be "Active"');
        
        console.log('\n2. Check your .env file:');
        console.log('   - Open backend/.env');
        console.log('   - Make sure MONGODB_URI is correct');
        console.log('   - Remove any spaces or extra characters');
        
        console.log('\n3. Check password:');
        console.log('   - Password: MFe8tZMAsKh03LXq');
        console.log('   - No angle brackets <> around password');
        
        console.log('\n4. Wait 2-3 minutes after adding IP');
        console.log('5. Restart your computer if still not working');
        
        console.log('\n💡 Quick fix: In MongoDB Atlas, try "Allow Access From Anywhere" temporarily');
        
        process.exit(1); // Exit with error code
    }
}

// Run the test
testConnection();