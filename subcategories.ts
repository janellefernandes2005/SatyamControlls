// subcategories.ts - FINAL WORKING VERSION

interface Subcategory {
    id: string;
    name: string;
    description: string;
    material: string;
    pressure: string;
    temperature: string;
    image: string;
}

// Subcategories data
const getSubcategoriesForCategory = (categoryId: string): { name: string, subcategories: Subcategory[] } => {
    const allSubcategories: Record<string, any> = {
        "tube-fittings": {
            name: "Tube Fittings",
            subcategories: [
                { id: "6975126cd0195fb59dbeeeed", name: "Compression Male Connector", description: "Precision compression male connectors for secure tube connections.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126cd0195fb59dbeeeeb", name: "Compression Hose Barb Adapter", description: "Adapter with compression fitting on one end and hose barb on the other.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126dd0195fb59dbeef1d", name: "Press-Fit 90° Elbow", description: "90-degree elbow designed for press-fit installation.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126cd0195fb59dbeeef3", name: "Compression Union", description: "Union fitting for easy disconnection and maintenance.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126cd0195fb59dbeeef1", name: "Threaded Female Equal Tee", description: "Equal tee with threaded female connections.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" }
            ]
        },
        "ball-valves": {
            name: "Ball Valves",
            subcategories: [
                { id: "6975126cd0195fb59dbeeed5", name: "3-Piece Ball Valve (Threaded)", description: "Three-piece design allows for easy maintenance.", material: "Stainless Steel 316", pressure: "1000 PSI", temperature: "-20°C to 180°C", image: "" },
                { id: "6975126cd0195fb59dbeeed7", name: "True Union Ball Valve (PVC/Plastic)", description: "Union ends allow easy removal without disturbing piping.", material: "PVC", pressure: "150 PSI", temperature: "0°C to 60°C", image: "" },
                { id: "6975126cd0195fb59dbeeed1", name: "2-Piece Ball Valve (Standard Industrial)", description: "Compact two-piece design for standard industrial applications.", material: "Stainless Steel 316", pressure: "800 PSI", temperature: "-20°C to 200°C", image: "" },
                { id: "6975126bd0195fb59dbeeecf", name: "Full Port Ball Valve", description: "Full port design provides minimal pressure drop.", material: "Stainless Steel 316", pressure: "600 PSI", temperature: "-20°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeedb", name: "3-Way Ball Valve", description: "Multi-port design for flow diversion.", material: "Stainless Steel 316", pressure: "500 PSI", temperature: "-20°C to 150°C", image: "" }
            ]
        },
        "needle-valves": {
            name: "Needle Valves",
            subcategories: [
                { id: "6975126cd0195fb59dbeeeef", name: "Compression Needle Valve", description: "Precision needle valve with compression fittings.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-54°C to 232°C", image: "" },
                { id: "6975126cd0195fb59dbeef09", name: "High-Pressure Needle Valve", description: "Heavy-duty needle valve for extreme pressure.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 200°C", image: "" }
            ]
        }
    };
    
    return allSubcategories[categoryId] || allSubcategories["tube-fittings"];
};

// Load and display subcategories
function loadSubcategoriesGrid() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('cat') || 'tube-fittings';
    
    const category = getSubcategoriesForCategory(categoryId);
    const grid = document.getElementById('products-grid-view');
    const titleEl = document.getElementById('display-title');
    
    if (titleEl) {
        titleEl.textContent = category.name.toUpperCase();
    }
    
    if (!grid) return;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Add each subcategory card
    category.subcategories.forEach((sub: Subcategory) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cssText = 'border: 1px solid #ddd; border-radius: 10px; padding: 15px; margin: 10px; cursor: pointer; transition: transform 0.3s; background: white;';
        
        card.innerHTML = `
            <div class="image-container" style="text-align: center; height: 180px; display: flex; align-items: center; justify-content: center;">
                <img src="/api/products/image/${sub.id}" 
                     alt="${sub.name}"
                     style="max-width: 100%; max-height: 150px; object-fit: contain;"
                     onerror="this.src='https://placehold.co/300x200/292C36/FFFFFF?text=${sub.name}'">
            </div>
            <div class="product-info" style="text-align: center; margin-top: 15px;">
                <h3 style="font-size: 16px; margin: 10px 0;">${sub.name}</h3>
                <p style="font-size: 12px; color: #666;">${sub.material} | ${sub.pressure}</p>
            </div>
        `;
        
        // Click handler with flag
        card.addEventListener('click', () => {
            const productData = {
                name: sub.name,
                desc: sub.description,
                mat: sub.material,
                press: sub.pressure,
                temp: sub.temperature,
                img: `/api/products/image/${sub.id}`
            };
            
            localStorage.setItem('selectedProduct', JSON.stringify(productData));
            // Store the current category to come back to
            sessionStorage.setItem('returnToCategory', categoryId);
            sessionStorage.setItem('needsGridReload', 'true');
            window.location.href = 'product-detail.html';
        });
        
        grid.appendChild(card);
    });
    
    console.log(`✅ Loaded ${category.subcategories.length} subcategories for ${category.name}`);
}

// Check if we need to reload the grid (coming back from product detail)
if (sessionStorage.getItem('needsGridReload') === 'true') {
    sessionStorage.removeItem('needsGridReload');
    console.log('🔄 Reloading subcategories grid...');
    // Clear the grid and reload
    const grid = document.getElementById('products-grid-view');
    if (grid) {
        grid.innerHTML = '<div style="text-align: center; padding: 50px;">Loading...</div>';
    }
    // Use setTimeout to ensure clean reload
    setTimeout(() => {
        loadSubcategoriesGrid();
    }, 100);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSubcategoriesGrid();
    
    // Setup back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'product.html';
        });
    }
});