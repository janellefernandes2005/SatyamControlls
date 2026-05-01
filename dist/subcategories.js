// subcategories.ts - BIGGER CARDS (400px height)
// Full subcategories data
const getSubcategoriesForCategory = (categoryId) => {
    const allSubcategories = {
        "tube-fittings": {
            name: "Tube Fittings",
            subcategories: [
                { id: "6975126cd0195fb59dbeeeed", name: "Compression Male Connector", description: "Precision compression male connectors for secure tube connections.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126cd0195fb59dbeeeeb", name: "Compression Hose Barb Adapter", description: "Adapter with compression fitting on one end and hose barb on the other.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126dd0195fb59dbeef1d", name: "Press-Fit 90° Elbow", description: "90-degree elbow designed for press-fit installation.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126cd0195fb59dbeeef3", name: "Compression Union", description: "Union fitting for easy disconnection and maintenance.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126cd0195fb59dbeeef1", name: "Threaded Female Equal Tee", description: "Equal tee with threaded female connections.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126cd0195fb59dbeeef5", name: "Compression Reducing Union", description: "Reducing union for connecting different tube sizes.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" }
            ]
        },
        "ball-valves": {
            name: "Ball Valves",
            subcategories: [
                { id: "6975126cd0195fb59dbeeed5", name: "3-Piece Ball Valve (Threaded)", description: "Three-piece design allows for easy maintenance.", material: "Stainless Steel 316", pressure: "1000 PSI", temperature: "-20°C to 180°C", image: "" },
                { id: "6975126cd0195fb59dbeeed7", name: "True Union Ball Valve (PVC/Plastic)", description: "Union ends allow easy removal without disturbing piping.", material: "PVC", pressure: "150 PSI", temperature: "0°C to 60°C", image: "" },
                { id: "6975126cd0195fb59dbeeed9", name: "3-Piece Flanged Ball Valve", description: "Flanged ends for high-pressure applications.", material: "Stainless Steel 316", pressure: "600 PSI", temperature: "-29°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeed1", name: "2-Piece Ball Valve (Standard Industrial)", description: "Compact two-piece design for standard industrial applications.", material: "Stainless Steel 316", pressure: "800 PSI", temperature: "-20°C to 200°C", image: "" },
                { id: "6975126bd0195fb59dbeeecf", name: "Full Port Ball Valve", description: "Full port design provides minimal pressure drop.", material: "Stainless Steel 316", pressure: "600 PSI", temperature: "-20°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeedb", name: "3-Way Ball Valve", description: "Multi-port design for flow diversion.", material: "Stainless Steel 316", pressure: "500 PSI", temperature: "-20°C to 150°C", image: "" }
            ]
        },
        "needle-valves": {
            name: "Needle Valves",
            subcategories: [
                { id: "6975126cd0195fb59dbeeeef", name: "Compression Needle Valve", description: "Precision needle valve with compression fittings.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-54°C to 232°C", image: "" },
                { id: "6975126cd0195fb59dbeef09", name: "High-Pressure Needle Valve", description: "Heavy-duty needle valve for extreme pressure.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeedf", name: "Angle Needle Valve", description: "90-degree angle design for space-constrained installations.", material: "Stainless Steel 316", pressure: "3000 PSI", temperature: "-20°C to 150°C", image: "" },
                { id: "6975126dd0195fb59dbeef17", name: "Panel Mount Needle Valve", description: "Designed for mounting on control panels.", material: "Stainless Steel 316", pressure: "3000 PSI", temperature: "-20°C to 120°C", image: "" },
                { id: "6975126cd0195fb59dbeef0d", name: "Integral Bonnet Needle Valve", description: "One-piece body and bonnet construction.", material: "Stainless Steel 316", pressure: "5000 PSI", temperature: "-40°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeee5", name: "Brass Needle Valve", description: "Economical brass needle valve.", material: "Brass", pressure: "1000 PSI", temperature: "-20°C to 120°C", image: "" }
            ]
        },
        "manifold-valves": {
            name: "Manifold Valves",
            subcategories: [
                { id: "6975126cd0195fb59dbeeed3", name: "2-Valve Manifold", description: "Two-valve configuration for pressure transmitter isolation.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeed9", name: "3-Valve Manifold", description: "Three-valve design for isolation and equalization.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeedd", name: "5-Valve Manifold", description: "Five-valve configuration for complex instrumentation.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 200°C", image: "" },
                { id: "6975126dd0195fb59dbeef13", name: "Monoflange Manifold", description: "Compact single-flange design.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeef9", name: "Double Block and Bleed", description: "Dual isolation with bleed capability.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeeef5", name: "Coplanar Manifold", description: "Coplanar design for transmitters.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 200°C", image: "" }
            ]
        },
        "check-valves": {
            name: "Check Valves",
            subcategories: [
                { id: "6975126cd0195fb59dbeeee1", name: "Ball Check Valve", description: "Uses a ball to prevent reverse flow.", material: "Stainless Steel 316", pressure: "600 PSI", temperature: "-20°C to 150°C", image: "" },
                { id: "6975126cd0195fb59dbeeefb", name: "Dual Plate Check Valve", description: "Two spring-loaded plates for quick response.", material: "Stainless Steel 316", pressure: "2500 PSI", temperature: "-29°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeef0b", name: "Inline Spring Check Valve", description: "Spring-assisted closing for silent operation.", material: "Stainless Steel 316", pressure: "600 PSI", temperature: "-20°C to 120°C", image: "" },
                { id: "6975126cd0195fb59dbeef11", name: "Swing Check Valve", description: "Hinged disc that swings open/closed.", material: "Cast Iron", pressure: "300 PSI", temperature: "-20°C to 150°C", image: "" },
                { id: "6975126cd0195fb59dbeef05", name: "Wafer Check Valve", description: "Slim design that fits between flanges.", material: "Stainless Steel 316", pressure: "300 PSI", temperature: "-20°C to 150°C", image: "" },
                { id: "6975126dd0195fb59dbeef1b", name: "Lift Check Valve", description: "Disc lifts vertically off seat.", material: "Stainless Steel 316", pressure: "2500 PSI", temperature: "-29°C to 200°C", image: "" }
            ]
        },
        "gauge-accessories": {
            name: "Gauge Accessories",
            subcategories: [
                { id: "6975126cd0195fb59dbeeef7", name: "Diaphragm Seal", description: "Protects gauges from corrosive media.", material: "Stainless Steel 316", pressure: "6000 PSI", temperature: "-50°C to 400°C", image: "" },
                { id: "6975126dd0195fb59dbeef19", name: "Pigtail Siphon", description: "Coiled pipe to protect gauge from steam.", material: "Stainless Steel 304", pressure: "600 PSI", temperature: "-20°C to 200°C", image: "" },
                { id: "6975126cd0195fb59dbeef03", name: "Gauge Cock", description: "Small shut-off valve for isolating gauges.", material: "Brass", pressure: "3000 PSI", temperature: "-20°C to 120°C", image: "" },
                { id: "6975126dd0195fb59dbeef21", name: "Snubber", description: "Reduces pressure pulsations and surges.", material: "Stainless Steel 316", pressure: "5000 PSI", temperature: "-40°C to 120°C", image: "" },
                { id: "6975126dd0195fb59dbeef1f", name: "Pressure Gauge", description: "Standard pressure measurement instrument.", material: "Brass Case", pressure: "Various", temperature: "-20°C to 120°C", image: "" },
                { id: "6975126cd0195fb59dbeeefd", name: "Gauge Adapter", description: "Adapter for different thread sizes.", material: "Brass", pressure: "3000 PSI", temperature: "-20°C to 120°C", image: "" }
            ]
        }
    };
    return allSubcategories[categoryId] || allSubcategories["tube-fittings"];
};
// Load and display subcategories with BIGGER CARDS
function loadSubcategoriesGrid() {
    const urlParams = new URLSearchParams(window.location.search);
    let categoryId = urlParams.get('cat') || 'tube-fittings';
    const savedCategory = sessionStorage.getItem('currentSubcategory');
    if (savedCategory && !urlParams.get('cat')) {
        categoryId = savedCategory;
    }
    const category = getSubcategoriesForCategory(categoryId);
    const grid = document.getElementById('products-grid-view');
    const titleEl = document.getElementById('display-title');
    if (titleEl) {
        titleEl.textContent = category.name.toUpperCase();
    }
    if (!grid)
        return;
    // Clear grid
    grid.innerHTML = '';
    // Add subcategory cards - BIGGER SIZE (280px height, larger fonts)
    category.subcategories.forEach((sub) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cssText = 'background: white; border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 20px rgba(0,0,0,0.1);';
        card.innerHTML = `
            <div class="image-container" style="height: 280px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px;">
                <img src="/api/products/image/${sub.id}" 
                     alt="${sub.name}"
                     style="max-width: 100%; max-height: 220px; object-fit: contain; transition: transform 0.3s ease;"
                     onerror="this.src='https://placehold.co/500x400/292C36/FFFFFF?text=${sub.name}'">
            </div>
            <div class="product-info" style="padding: 25px; text-align: center;">
                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #171F22;">${sub.name}</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 15px; line-height: 1.5;">${sub.material} | ${sub.pressure}</p>
                <button style="background: #2d7a9b; color: white; border: none; padding: 10px 28px; border-radius: 30px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s ease;">View Details →</button>
            </div>
        `;
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.stopPropagation();
            }
            sessionStorage.setItem('currentSubcategory', categoryId);
            sessionStorage.setItem('needsGridReload', 'true');
            const productData = {
                name: sub.name,
                desc: sub.description,
                mat: sub.material,
                press: sub.pressure,
                temp: sub.temperature,
                img: `/api/products/image/${sub.id}`
            };
            localStorage.setItem('selectedProduct', JSON.stringify(productData));
            window.location.href = 'product-detail.html';
        });
        grid.appendChild(card);
    });
    console.log(`✅ Loaded ${category.subcategories.length} subcategories for ${category.name}`);
}
// Check if we need to reload the grid
if (sessionStorage.getItem('needsGridReload') === 'true') {
    sessionStorage.removeItem('needsGridReload');
    console.log('🔄 Reloading subcategories grid...');
    setTimeout(() => {
        loadSubcategoriesGrid();
    }, 100);
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSubcategoriesGrid();
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            sessionStorage.removeItem('currentSubcategory');
            sessionStorage.removeItem('needsGridReload');
            window.location.href = 'product.html';
        });
    }
});
