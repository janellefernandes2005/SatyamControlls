// reset-admin.mjs - ES6 Module version
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resetAdmin() {
    try {
        console.log('🔄 Resetting admin user...');
        
        // Get connection string from .env
        const connectionString = process.env.MONGODB_URI;
        
        if (!connectionString) {
            console.error('❌ MONGODB_URI not found in .env file');
            console.log('📝 Check your .env file contains:');
            console.log('MONGODB_URI=mongodb+srv://janellefernandes2005_db_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/satyam_controls?retryWrites=true&w=majority');
            process.exit(1);
        }
        
        console.log('🔗 Connecting to MongoDB...');
        
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Import Admin model
        const { default: Admin } = await import('./models/Admin.js');
        
        // Delete existing admin
        const deleteResult = await Admin.deleteOne({ username: 'admin' });
        console.log(`🗑️ Deleted ${deleteResult.deletedCount} admin user(s)`);
        
        // Create new admin
        const admin = new Admin({
            username: 'admin',
            password: 'satyamcontrols',
            email: 'janelle.fernandes2005@gmail.com',
            twoFactorEnabled: false
        });
        
        await admin.save();
        console.log('✅ New admin created');
        
        // Test the password
        const testAdmin = await Admin.findOne({ username: 'admin' });
        const isValid = await testAdmin.comparePassword('satyamcontrols');
        console.log(`🔑 Password test: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
        
        console.log('\n🎉 Admin reset complete!');
        console.log('📋 Use these credentials:');
        console.log('   Username: admin');
        console.log('   Password: satyamcontrols');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

resetAdmin();