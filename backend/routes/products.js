const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ==================== GET ALL PRODUCTS ====================
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ displayOrder: 1 });
        
        // Add full URLs to images
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const productsWithFullUrls = products.map(product => {
            const productObj = product.toObject();
            
            // Create image URL
            if (productObj._id) {
                productObj.imageUrl = `${baseUrl}/api/products/image/${productObj._id}`;
                productObj.img = productObj.imageUrl;
            }
            
            return productObj;
        });
        
        res.json(productsWithFullUrls);
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// ==================== GET PRODUCT IMAGE ====================
router.get('/image/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).send('Product not found');
        }
        
        if (!product.imageData) {
            return res.status(404).send('Image not found');
        }
        
        // Set content type and send image
        res.set('Content-Type', product.contentType || 'image/png');
        res.send(product.imageData);
        
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).send('Server error');
    }
});

// ==================== GET MAIN CATEGORY IMAGE ====================
router.get('/main-category-image/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        console.log(`📸 Looking for main category image: ${categoryId}`);
        
        // Use hardcoded image IDs for each category based on your uploaded images
        const categoryImageIds = {
            'tube-fittings': '6975126cd0195fb59dbeeeed', // Compression Male Connector
            'ball-valves': '6975126cd0195fb59dbeeee3', // Ball Valve
            'pipe-valves': '6975126cd0195fb59dbeef07', // Globe Valve
            'needle-valves': '6975126dd0195fb59dbeef15', // Needle Valve
            'manifold-valves': '6975126cd0195fb59dbeeed3', // 2 Valve Manifold
            'gauge-accessories': '6975126cd0195fb59dbeef01', // Gauge Accessories
            'check-valves': '6975126cd0195fb59dbeeee9' // Check Valve
        };
        
        const imageId = categoryImageIds[categoryId];
        
        if (imageId) {
            const product = await Product.findById(imageId);
            if (product && product.imageData) {
                console.log(`✅ Found category image for ${categoryId}: ${product.name}`);
                res.set('Content-Type', product.contentType || 'image/png');
                return res.send(product.imageData);
            }
        }
        
        // Fallback: find any product in category
        const product = await Product.findOne({
            category: categoryId,
            imageData: { $exists: true, $ne: null }
        }).sort({ _id: 1 });
        
        if (product && product.imageData) {
            console.log(`✅ Found category image for ${categoryId}: ${product.name}`);
            res.set('Content-Type', product.contentType || 'image/png');
            res.send(product.imageData);
        } else {
            console.log(`❌ No category image found for ${categoryId}`);
            const categoryName = getCategoryDisplayName(categoryId);
            res.redirect(`https://via.placeholder.com/800x600/292C36/FFFFFF?text=${encodeURIComponent(categoryName)}`);
        }
        
    } catch (error) {
        console.error('Error serving category image:', error);
        const categoryName = getCategoryDisplayName(req.params.categoryId);
        res.redirect(`https://via.placeholder.com/800x600/292C36/FFFFFF?text=${encodeURIComponent(categoryName)}`);
    }
});

// ==================== GET MAIN CATEGORIES ====================
router.get('/main-categories', async (req, res) => {
    try {
        // Define your 7 main categories
        const mainCategories = [
            { id: "tube-fittings", name: "Tube Fittings", desc: "Precision tube connections and fittings for industrial instrumentation." },
            { id: "ball-valves", name: "Ball Valves", desc: "High-performance ball valves for industrial flow control applications." },
            { id: "pipe-valves", name: "Pipe Valves", desc: "Heavy-duty valves for piping systems including globe, gate, and butterfly valves." },
            { id: "needle-valves", name: "Needle Valves", desc: "Precision needle valves for fine flow regulation and control." },
            { id: "manifold-valves", name: "Manifold Valves", desc: "Multi-valve manifolds for instrumentation and pressure management." },
            { id: "gauge-accessories", name: "Gauge Accessories", desc: "Pressure gauge accessories including seals, snubbers, and siphons." },
            { id: "check-valves", name: "Check Valves", desc: "Backflow prevention valves for industrial piping systems." }
        ];
        
        // Get product counts
        const allProducts = await Product.find();
        
        // Build categories with images
        const categoriesWithData = await Promise.all(
            mainCategories.map(async (category) => {
                const categoryProducts = allProducts.filter(p => p.category === category.id);
                
                return {
                    id: category.id,
                    name: category.name,
                    desc: category.desc,
                    imageUrl: `${req.protocol}://${req.get('host')}/api/products/main-category-image/${category.id}`,
                    count: categoryProducts.length
                };
            })
        );
        
        res.json(categoriesWithData);
        
    } catch (error) {
        console.error('Error fetching main categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// ==================== GET SUBCATEGORIES FOR CATEGORY (WITH CORRECT IMAGE IDs) ====================
router.get('/category/:categoryId/subcategories', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        console.log(`📋 Fetching subcategories for category: ${categoryId}`);
        
        // Define the 6 subcategories for each main category with their image IDs
        const subcategoriesData = {
            "tube-fittings": [
                { name: "Compression Male Connector", imageId: "6975126cd0195fb59dbeeeed" },
                { name: "Compression Hose Barb Adapter", imageId: "6975126cd0195fb59dbeeeeb" },
                { name: "Press-Fit 90° Elbow", imageId: "6975126dd0195fb59dbeef1d" },
                { name: "Compression Union", imageId: "6975126cd0195fb59dbeeef3" },
                { name: "Threaded Female Equal Tee", imageId: "6975126cd0195fb59dbeeef1" }, // Using Compression Reducing Union
                { name: "Compression Reducing Union", imageId: "6975126cd0195fb59dbeeef1" }
            ],
            "ball-valves": [
                { name: "3-Piece Ball Valve (Threaded)", imageId: "6975126cd0195fb59dbeeed5" },
                { name: "True Union Ball Valve (PVC/Plastic)", imageId: "6975126cd0195fb59dbeeed7" },
                { name: "3-Piece Flanged Ball Valve", imageId: "6975126cd0195fb59dbeeed7" },
                { name: "2-Piece Ball Valve (Standard Industrial)", imageId: "6975126cd0195fb59dbeeed1" },
                { name: "1-Piece or 2-Piece Ball Valve (Full Port)", imageId: "6975126bd0195fb59dbeeecf" },
                { name: "3-Way Ball Valve (Multi-port)", imageId: "6975126cd0195fb59dbeeedb" }
            ],
            "pipe-valves": [
                { name: "Globe Valve", imageId: "6975126cd0195fb59dbeef07" },
                { name: "Butterfly Valves", imageId: "6975126cd0195fb59dbeeee7" },
                { name: "Gate Valve (Flanged)", imageId: "6975126cd0195fb59dbeeeff" },
                { name: "Gate Valve", imageId: "6975126cd0195fb59dbeeeff" }, // Using same as above
                { name: "Knife Gate Valve", imageId: "6975126cd0195fb59dbeef0f" },
                { name: "Eccentric Plug Valve", imageId: "6975126cd0195fb59dbeeefd" }
            ],
            "needle-valves": [
                { name: "Compression Needle Valve (Double Ferrule)", imageId: "6975126cd0195fb59dbeeeef" },
                { name: "High-Pressure Needle Valve (6000 PSI)", imageId: "6975126cd0195fb59dbeef09" },
                { name: "Angle Needle Valve", imageId: "6975126cd0195fb59dbeeedf" },
                { name: "Panel Mount Needle Valve", imageId: "6975126dd0195fb59dbeef17" },
                { name: "Integral Bonnet Needle Valve", imageId: "6975126cd0195fb59dbeef0d" },
                { name: "Brass Needle Valve (Butterfly handle)", imageId: "6975126cd0195fb59dbeeee5" }
            ],
            "manifold-valves": [
                { name: "2-Valve Manifold", imageId: "6975126cd0195fb59dbeeed3" },
                { name: "3-Valve Manifold", imageId: "6975126cd0195fb59dbeeed9" },
                { name: "5-Valve Manifold", imageId: "6975126cd0195fb59dbeeedd" },
                { name: "Monoflange Manifold", imageId: "6975126dd0195fb59dbeef13" },
                { name: "Double Block and Bleed Manifold", imageId: "6975126cd0195fb59dbeeef9" },
                { name: "Coplanar Manifold", imageId: "6975126cd0195fb59dbeeef5" }
            ],
            "gauge-accessories": [
                { name: "Diaphragm Seal (Flanged/Bolted)", imageId: "6975126cd0195fb59dbeeef7" },
                { name: "Pigtail Siphon (Coil Siphon)", imageId: "6975126dd0195fb59dbeef19" },
                { name: "Gauge Cock (Pressure Gauge Valve)", imageId: "6975126cd0195fb59dbeef03" },
                { name: "Gauge Adapter (Threaded Reducer/Bushing)", imageId: "6975126cd0195fb59dbeef03" },
                { name: "Snubber (Pressure Pulsation Dampener)", imageId: "6975126dd0195fb59dbeef21" },
                { name: "Pressure Gauge (Bourdon Tube)", imageId: "6975126dd0195fb59dbeef1f" }
            ],
            "check-valves": [
                { name: "Ball Check Valve", imageId: "6975126cd0195fb59dbeeee1" },
                { name: "Dual Plate Check Valve", imageId: "6975126cd0195fb59dbeeefb" },
                { name: "Inline Spring Check Valve", imageId: "6975126cd0195fb59dbeef0b" },
                { name: "Inline Spring Check Valve", imageId: "6975126cd0195fb59dbeef0b" }, // Duplicate for wafer
                { name: "Swing Check Valve", imageId: "6975126cd0195fb59dbeef11" },
                { name: "Lift Check Valve", imageId: "6975126cd0195fb59dbeef11" }
            ]
        };
        
        const subcategoriesInfo = subcategoriesData[categoryId] || [];
        
        // Create subcategories with images
        const subcategories = await Promise.all(
            subcategoriesInfo.map(async (subcategory, index) => {
                try {
                    // Try to find the product by the specified ID
                    let product = await Product.findById(subcategory.imageId);
                    
                    // If not found by ID, try to find by name in the category
                    if (!product) {
                        product = await Product.findOne({
                            category: categoryId,
                            name: { $regex: new RegExp(subcategory.name.split(' ')[0], 'i') }
                        }).sort({ _id: 1 });
                    }
                    
                    const baseUrl = `${req.protocol}://${req.get('host')}`;
                    const imageUrl = product?._id ? 
                        `${baseUrl}/api/products/image/${product._id}` : 
                        `https://via.placeholder.com/600x400/292C36/FFFFFF?text=${encodeURIComponent(subcategory.name)}`;
                    
                    return {
                        id: product?._id || `sub-${categoryId}-${index}`,
                        name: subcategory.name,
                        imageUrl: imageUrl,
                        description: `Explore our ${subcategory.name} collection`,
                        hasProducts: product ? true : false
                    };
                } catch (error) {
                    console.error(`Error loading subcategory ${subcategory.name}:`, error);
                    return {
                        id: `sub-${categoryId}-${index}`,
                        name: subcategory.name,
                        imageUrl: `https://via.placeholder.com/600x400/292C36/FFFFFF?text=${encodeURIComponent(subcategory.name)}`,
                        description: `Explore our ${subcategory.name} collection`,
                        hasProducts: false
                    };
                }
            })
        );
        
        res.json({
            category: categoryId,
            categoryName: getCategoryDisplayName(categoryId),
            subcategories: subcategories
        });
        
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
});

// ==================== UPLOAD MULTIPLE IMAGES ====================
router.post('/upload-multiple', upload.array('images', 50), async (req, res) => {
    try {
        const files = req.files;
        
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }
        
        console.log(`Uploading ${files.length} images...`);
        
        const createdProducts = [];
        
        for (const file of files) {
            let productName = path.parse(file.originalname).name;
            productName = productName.replace(/-/g, ' ').replace(/_/g, ' ');
            productName = productName.replace(/\b\w/g, l => l.toUpperCase());
            
            const filename = file.originalname.toLowerCase();
            let category = 'tube-fittings';
            
            if (filename.includes('ball') && !filename.includes('check')) {
                category = 'ball-valves';
            } else if (filename.includes('check')) {
                category = 'check-valves';
            } else if (filename.includes('needle')) {
                category = 'needle-valves';
            } else if (filename.includes('manifold')) {
                category = 'manifold-valves';
            } else if (filename.includes('gauge') || filename.includes('snubber') || 
                     filename.includes('pigtail') || filename.includes('diaphragm')) {
                category = 'gauge-accessories';
            } else if (filename.includes('globe') || filename.includes('gate') || 
                     filename.includes('butterfly') || filename.includes('plug')) {
                category = 'pipe-valves';
            }
            
            const product = new Product({
                name: productName,
                category: category,
                description: `High-quality ${productName} for industrial applications`,
                material: "Stainless Steel 316",
                pressure: "150-6000 PSI",
                temperature: "-40°C to 200°C",
                image: file.originalname,
                imageData: file.buffer,
                contentType: file.mimetype
            });
            
            await product.save();
            createdProducts.push({
                id: product._id,
                name: product.name,
                category: product.category,
                imageUrl: `/api/products/image/${product._id}`
            });
        }
        
        res.json({
            success: true,
            count: createdProducts.length,
            products: createdProducts
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== GET PRODUCT BY ID ====================
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const productObj = product.toObject();
        productObj.imageUrl = `${baseUrl}/api/products/image/${productObj._id}`;
        productObj.img = productObj.imageUrl;
        
        res.json(productObj);
        
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Helper function to get category display name
function getCategoryDisplayName(categoryId) {
    const categoryNames = {
        "tube-fittings": "Tube Fittings",
        "ball-valves": "Ball Valves", 
        "pipe-valves": "Pipe Valves",
        "needle-valves": "Needle Valves",
        "manifold-valves": "Manifold Valves",
        "gauge-accessories": "Gauge Accessories",
        "check-valves": "Check Valves"
    };
    return categoryNames[categoryId] || categoryId.replace(/-/g, ' ');
}

module.exports = router;