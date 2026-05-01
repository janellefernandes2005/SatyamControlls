const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: [
            'tube-fittings',
            'ball-valves', 
            'pipe-valves',
            'needle-valves',
            'manifold-valves',
            'gauge-accessories',
            'check-valves'
        ]
    },
    description: String,
    material: String,
    pressure: String,
    temperature: String,
    image: { type: String, required: true }, // Original filename
    imageData: Buffer, // Binary image data
    contentType: String, // image/png, image/jpeg
    imageUrl: String, // URL to access image: /api/products/image/:id
    displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);