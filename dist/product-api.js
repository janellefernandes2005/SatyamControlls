// product-api.ts - Fetch products from MongoDB
const API_BASE = 'http://localhost:5000/api';
async function fetchProductsFromMongoDB() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        // Group by category
        const grouped = {};
        products.forEach((product) => {
            if (!grouped[product.category]) {
                grouped[product.category] = {
                    name: product.category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    items: []
                };
            }
            grouped[product.category].items.push({
                id: product.id,
                name: product.name,
                img: product.imageUrl || product.img,
                desc: product.description,
                mat: product.material,
                press: product.pressure,
                temp: product.temperature
            });
        });
        return grouped;
    }
    catch (error) {
        console.error('Error fetching products:', error);
        return {}; // Return empty if backend not available
    }
}
async function getProductsByCategory(category) {
    try {
        const response = await fetch(`${API_BASE}/products/category/${category}`);
        const products = await response.json();
        return products.map((product) => ({
            id: product.id,
            name: product.name,
            img: product.imageUrl || product.img,
            desc: product.description,
            mat: product.material,
            press: product.pressure,
            temp: product.temperature
        }));
    }
    catch (error) {
        console.error('Error fetching category:', error);
        return [];
    }
}
// Update your existing initializePage function
async function initializePage() {
    const params = new URLSearchParams(window.location.search);
    const catId = params.get('cat') || "tube-fittings";
    try {
        // Try to fetch from MongoDB
        const products = await getProductsByCategory(catId);
        if (products.length > 0) {
            // Use MongoDB data
            const categoryName = catId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            // Update title
            const titleElement = document.getElementById('display-title');
            if (titleElement) {
                titleElement.textContent = categoryName.toUpperCase();
            }
            // Create product grid
            const grid = document.getElementById('products-grid-view');
            if (grid) {
                grid.innerHTML = products.map((item, index) => `
                    <div class="product-card" data-category="${catId}" data-index="${index}">
                        <img src="${item.img}" alt="${item.name}" onerror="this.src='placeholder.png'">
                        <h3>${item.name}</h3>
                    </div>
                `).join('');
                // Add event listeners
                const productCards = grid.querySelectorAll('.product-card');
                productCards.forEach((card, index) => {
                    card.addEventListener('click', () => {
                        localStorage.setItem('selectedProduct', JSON.stringify(products[index]));
                        window.location.href = 'product-detail.html';
                    });
                });
            }
        }
        else {
            // Fallback to local data
            console.log('Using local product data');
            // Your existing local productData code...
        }
    }
    catch (error) {
        console.error('Error initializing page:', error);
        // Fallback to local data
    }
}
// Export for use in other files
export { fetchProductsFromMongoDB, getProductsByCategory, initializePage };
