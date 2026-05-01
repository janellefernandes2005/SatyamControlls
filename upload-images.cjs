// upload-images-fixed.js
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Map filenames to correct categories
function getCategoryFromFilename(filename) {
    const lower = filename.toLowerCase();
    
    if (lower.includes('ball') || lower.includes('valve') && !lower.includes('check')) {
        if (lower.includes('needle')) return 'needle-valves';
        if (lower.includes('manifold')) return 'manifold-valves';
        return 'ball-valves';
    }
    
    if (lower.includes('fitt') || lower.includes('connector') || lower.includes('union') || lower.includes('elbow')) {
        return 'tube-fittings';
    }
    
    if (lower.includes('needle')) {
        return 'needle-valves';
    }
    
    if (lower.includes('manifold') || lower.includes('coplanar') || lower.includes('double block')) {
        return 'manifold-valves';
    }
    
    if (lower.includes('gauge') || lower.includes('snubber') || lower.includes('pigtail') || lower.includes('diaphragm')) {
        return 'gauge-accessories';
    }
    
    if (lower.includes('check')) {
        return 'check-valves';
    }
    
    if (lower.includes('globe') || lower.includes('gate') || lower.includes('butterfly') || lower.includes('plug')) {
        return 'pipe-valves';
    }
    
    // Default
    return 'tube-fittings';
}

async function uploadImages() {
    const imagesDir = __dirname; // Current folder
    console.log('📁 Looking for images in:', imagesDir);
    
    // Get all image files
    const imageFiles = fs.readdirSync(imagesDir)
        .filter(file => file.match(/\.(png|jpg|jpeg)$/i))
        .slice(0, 42);
    
    console.log(`📸 Found ${imageFiles.length} image files`);
    
    if (imageFiles.length === 0) {
        console.error('❌ No image files found!');
        return;
    }
    
    // Create a simple text file with image info first
    const imageInfo = imageFiles.map(file => {
        const category = getCategoryFromFilename(file);
        return `${file} → ${category}`;
    });
    
    fs.writeFileSync('image-categories.txt', imageInfo.join('\n'));
    console.log('💾 Saved category mapping to: image-categories.txt');
    
    const form = new FormData();
    
    // Add all images to form
    imageFiles.forEach(file => {
        const filePath = path.join(imagesDir, file);
        console.log(`➕ Adding: ${file} (Category: ${getCategoryFromFilename(file)})`);
        form.append('images', fs.createReadStream(filePath));
    });
    
    try {
        console.log('\n🚀 Uploading to: http://localhost:5000/api/products/upload-multiple');
        console.log('⏳ Please wait...');
        
        const response = await axios.post(
            'http://localhost:5000/api/products/upload-multiple',
            form,
            { 
                headers: form.getHeaders(),
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 30000 // 30 second timeout
            }
        );
        
        console.log('\n✅ UPLOAD SUCCESSFUL!');
        console.log('='.repeat(50));
        console.log(`📊 Uploaded: ${response.data.count} images`);
        
        if (response.data.products) {
            console.log('\n📋 Product IDs & URLs:');
            console.log('='.repeat(50));
            response.data.products.forEach((product, index) => {
                console.log(`${index + 1}. ${product.name}`);
                console.log(`   ID: ${product.id}`);
                console.log(`   URL: ${product.imageUrl}`);
                console.log('---');
            });
            
            // Save mapping to file
            const mapping = {};
            response.data.products.forEach(product => {
                mapping[product.name] = {
                    id: product.id,
                    url: `http://localhost:5000/api/products/image/${product.id}`
                };
            });
            
            fs.writeFileSync('image-mapping.json', JSON.stringify(mapping, null, 2));
            console.log('\n💾 Saved mapping to: image-mapping.json');
        }
        
    } catch (error) {
        console.error('\n❌ UPLOAD FAILED!');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Server response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the function
uploadImages();