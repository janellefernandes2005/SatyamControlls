// Fetch ALL products from MongoDB
export async function fetchAllProductsFromMongoDB() {
    try {
        console.log('📡 Fetching products from MongoDB...');
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const products = await response.json();
        const transformedProducts = products.map((product) => ({
            id: product._id || product.id,
            name: product.name || 'Unnamed Product',
            img: `/api/products/image/${product._id || product.id}`,
            desc: product.description || `High-quality ${product.name || 'product'} for industrial applications`,
            mat: product.material || 'Stainless Steel 316',
            press: product.pressure || '150-6000 PSI',
            temp: product.temperature || '-40°C to 200°C',
            category: product.category || 'tube-fittings'
        }));
        console.log(`✅ Fetched ${transformedProducts.length} products from MongoDB`);
        return transformedProducts;
    }
    catch (error) {
        console.error('❌ Failed to fetch from MongoDB:', error);
        return [];
    }
}
// Get products by category
export async function getProductsByCategory(categoryId) {
    const allProducts = await fetchAllProductsFromMongoDB();
    return allProducts.filter(product => product.category === categoryId);
}
// Get product by ID
export async function getProductById(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error(`Product not found: ${productId}`);
        }
        const product = await response.json();
        return {
            id: product._id || product.id,
            name: product.name,
            img: `/api/products/image/${product._id || product.id}`,
            desc: product.description || `High-quality ${product.name}`,
            mat: product.material || 'Stainless Steel 316',
            press: product.pressure || '150-6000 PSI',
            temp: product.temperature || '-40°C to 200°C',
            category: product.category || 'tube-fittings'
        };
    }
    catch (error) {
        console.error('❌ Error fetching product:', error);
        return null;
    }
}
export default {
    fetchAllProductsFromMongoDB,
    getProductsByCategory,
    getProductById,
};
