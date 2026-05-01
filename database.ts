// database.ts - SIMPLIFIED VERSION FOR MONGODB

const API_BASE = 'http://localhost:8000/api';

// ==================== TYPES ====================
export interface ProductItem {
    id: string;
    name: string;
    img: string; // MongoDB image URL
    desc: string;
    mat: string;
    press: string;
    temp: string;
    category: string;
}

export interface Category {
    name: string;
    items: ProductItem[];
}

// ==================== MONGODB FUNCTIONS ====================

// Fetch ALL products from MongoDB
export async function fetchAllProductsFromMongoDB(): Promise<ProductItem[]> {
    try {
        console.log('📡 Fetching products from MongoDB...');
        
        const response = await fetch(`${API_BASE}/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const products = await response.json();
        
        // Transform MongoDB products to our format
        const transformedProducts: ProductItem[] = products.map((product: any) => ({
            id: product._id || product.id,
            name: product.name || 'Unnamed Product',
            img: `${API_BASE}/products/image/${product._id || product.id}`,
            desc: product.description || `High-quality ${product.name || 'product'} for industrial applications`,
            mat: product.material || 'Stainless Steel 316',
            press: product.pressure || '150-6000 PSI',
            temp: product.temperature || '-40°C to 200°C',
            category: product.category || 'tube-fittings'
        }));
        
        console.log(`✅ Fetched ${transformedProducts.length} products from MongoDB`);
        return transformedProducts;
        
    } catch (error) {
        console.error('❌ Failed to fetch from MongoDB:', error);
        return [];
    }
}

// Get products by category
export async function getProductsByCategory(categoryId: string): Promise<ProductItem[]> {
    const allProducts = await fetchAllProductsFromMongoDB();
    return allProducts.filter(product => product.category === categoryId);
}

// Get all categories with counts
export async function getCategoriesWithCounts(): Promise<{id: string, name: string, count: number}[]> {
    const allProducts = await fetchAllProductsFromMongoDB();
    
    const categories = [
        { id: 'tube-fittings', name: 'Tube Fittings' },
        { id: 'ball-valves', name: 'Ball Valves' },
        { id: 'pipe-valves', name: 'Pipe Valves' },
        { id: 'needle-valves', name: 'Needle Valves' },
        { id: 'manifold-valves', name: 'Manifold Valves' },
        { id: 'gauge-accessories', name: 'Gauge Accessories' },
        { id: 'check-valves', name: 'Check Valves' }
    ];
    
    return categories.map(cat => ({
        ...cat,
        count: allProducts.filter(p => p.category === cat.id).length
    }));
}

// Get product by ID
export async function getProductById(productId: string): Promise<ProductItem | null> {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`);
        
        if (!response.ok) {
            throw new Error(`Product not found: ${productId}`);
        }
        
        const product = await response.json();
        
        return {
            id: product._id || product.id,
            name: product.name,
            img: `${API_BASE}/products/image/${product._id || product.id}`,
            desc: product.description || `High-quality ${product.name}`,
            mat: product.material || 'Stainless Steel 316',
            press: product.pressure || '150-6000 PSI',
            temp: product.temperature || '-40°C to 200°C',
            category: product.category || 'tube-fittings'
        };
        
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        return null;
    }
}

// Search products
export async function searchProducts(query: string): Promise<ProductItem[]> {
    const allProducts = await fetchAllProductsFromMongoDB();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.desc.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// ==================== FALLBACK DATA (For when MongoDB is offline) ====================
export const fallbackProducts: ProductItem[] = [
    {
        id: 'fallback-1',
        name: 'Ball Valve',
        img: 'https://via.placeholder.com/300x200/292C36/FFFFFF?text=Ball+Valve',
        desc: 'Full port ball valve for industrial applications',
        mat: 'Stainless Steel 316',
        press: '6000 PSI',
        temp: '-40°C to 200°C',
        category: 'ball-valves'
    },
    {
        id: 'fallback-2',
        name: 'Check Valve',
        img: 'https://via.placeholder.com/300x200/27ae60/FFFFFF?text=Check+Valve',
        desc: 'Swing check valve with stainless steel construction',
        mat: 'Stainless Steel 304',
        press: '1500 PSI',
        temp: '-20°C to 150°C',
        category: 'check-valves'
    }
];

// ==================== EXPORT ====================
export default {
    fetchAllProductsFromMongoDB,
    getProductsByCategory,
    getCategoriesWithCounts,
    getProductById,
    searchProducts,
    fallbackProducts
};