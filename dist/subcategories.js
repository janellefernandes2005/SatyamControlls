// subcategories.ts - SHOWING SUBCATEGORIES FOR EACH MAIN CATEGORY
// FIXED: Renamed loadSubcategories to loadSubcategoriesPage
// ==================== SUBCATEGORIES DATA ====================
const categoryData = {
    "tube-fittings": {
        name: "Tube Fittings",
        subcategories: [
            {
                id: "compression-male-connector",
                name: "Compression Male Connector",
                description: "Precision compression male connectors for secure tube connections.",
                material: "Stainless Steel 316",
                pressure: "3000 PSI",
                temperature: "-20°C to 150°C",
                image: "compression male connector.png"
            },
            {
                id: "compression-hose-barb-adapter",
                name: "Compression Hose Barb Adapter",
                description: "Adapter with compression fitting on one end and hose barb on the other.",
                material: "Brass or Stainless Steel",
                pressure: "2000 PSI",
                temperature: "-20°C to 120°C",
                image: "compression horse barb.png"
            },
            {
                id: "press-fit-90-elbow",
                name: "Press-Fit 90° Elbow",
                description: "90-degree elbow designed for press-fit installation.",
                material: "Stainless Steel 304/316",
                pressure: "2500 PSI",
                temperature: "-20°C to 150°C",
                image: "press fit 90.png"
            },
            {
                id: "compression-union",
                name: "Compression Union",
                description: "Union fitting for easy disconnection and maintenance.",
                material: "Stainless Steel 316",
                pressure: "3000 PSI",
                temperature: "-20°C to 150°C",
                image: "compression union.png"
            },
            {
                id: "threaded-female-equal-tee",
                name: "Threaded Female Equal Tee",
                description: "Equal tee with threaded female connections.",
                material: "Carbon Steel or Stainless Steel",
                pressure: "3000 PSI",
                temperature: "-20°C to 150°C",
                image: "threaded female tee.png"
            },
            {
                id: "compression-reducing-union",
                name: "Compression Reducing Union",
                description: "Union fitting for connecting tubes of different diameters.",
                material: "Stainless Steel 316",
                pressure: "3000 PSI",
                temperature: "-20°C to 150°C",
                image: "compression reducing union.png"
            }
        ]
    },
    "ball-valves": {
        name: "Ball Valves",
        subcategories: [
            {
                id: "3-piece-ball-valve-threaded",
                name: "3-Piece Ball Valve (Threaded)",
                description: "Three-piece design allows for easy maintenance.",
                material: "Carbon Steel with SS ball",
                pressure: "1000 PSI",
                temperature: "-20°C to 200°C",
                image: "3-piece ball valve.png"
            },
            {
                id: "true-union-ball-valve-pvc",
                name: "True Union Ball Valve (PVC/Plastic)",
                description: "Union ends allow easy removal without disturbing piping.",
                material: "PVC/CPVC/PP",
                pressure: "150 PSI",
                temperature: "0°C to 60°C",
                image: "true union ball valve.png"
            },
            {
                id: "3-piece-flanged-ball-valve",
                name: "3-Piece Flanged Ball Valve",
                description: "Flanged ends for high-pressure applications.",
                material: "Carbon Steel or Stainless Steel",
                pressure: "600 PSI",
                temperature: "-29°C to 200°C",
                image: "3-piece flanged ball ....png"
            },
            {
                id: "2-piece-ball-valve-standard",
                name: "2-Piece Ball Valve (Standard Industrial)",
                description: "Compact two-piece design for standard industrial applications.",
                material: "Carbon Steel",
                pressure: "800 PSI",
                temperature: "-20°C to 200°C",
                image: "2-piece ball valve.png"
            },
            {
                id: "full-port-ball-valve",
                name: "1-Piece or 2-Piece Ball Valve (Full Port)",
                description: "Full port design provides minimal pressure drop.",
                material: "Bronze, Carbon Steel, or Stainless Steel",
                pressure: "600 PSI",
                temperature: "-20°C to 200°C",
                image: "1-piece ball valve.png"
            },
            {
                id: "3-way-ball-valve",
                name: "3-Way Ball Valve (Multi-port)",
                description: "Multi-port design for flow diversion, mixing, or bypass applications.",
                material: "Stainless Steel 316",
                pressure: "500 PSI",
                temperature: "-20°C to 150°C",
                image: "3-way ball valve.png"
            }
        ]
    },
    "pipe-valves": {
        name: "Pipe Valves",
        subcategories: [
            {
                id: "globe-valve",
                name: "Globe Valve",
                description: "Precise flow control valve with linear motion stem.",
                material: "Carbon Steel or Stainless Steel",
                pressure: "600 PSI",
                temperature: "-20°C to 200°C",
                image: "globe valve.png"
            },
            {
                id: "butterfly-valves",
                name: "Butterfly Valves",
                description: "Quarter-turn valves with disc design for quick on/off and throttling.",
                material: "Cast Iron, SS, or PVC with various liners",
                pressure: "150-300 PSI",
                temperature: "-20°C to 150°C",
                image: "butterfly valves.png"
            },
            {
                id: "mechanical-seals-ptfe",
                name: "Mechanical Seals (or PTFE Bellows)",
                description: "Sealing components for pumps and rotating equipment.",
                material: "PTFE, Carbon, Ceramic, SS",
                pressure: "Varies by design",
                temperature: "-40°C to 200°C",
                image: "mechanical seals.png"
            },
            {
                id: "gate-valve-flanged",
                name: "Gate Valve (Flanged)",
                description: "Full bore valve for isolation service with flanged connections.",
                material: "Carbon Steel",
                pressure: "150-300 PSI",
                temperature: "-20°C to 200°C",
                image: "gate valve.png"
            },
            {
                id: "knife-gate-valve",
                name: "Knife Gate Valve",
                description: "Sharp-edged gate for cutting through thick fluids, slurries, and viscous materials.",
                material: "Carbon Steel with SS trim",
                pressure: "150 PSI",
                temperature: "-20°C to 150°C",
                image: "knife gate valve.png"
            },
            {
                id: "eccentric-plug-valve",
                name: "Eccentric Plug Valve",
                description: "Quarter-turn valve with eccentric plug for bubble-tight shutoff.",
                material: "Carbon Steel or Ductile Iron",
                pressure: "200 PSI",
                temperature: "-20°C to 150°C",
                image: "eccentric plug valve.png"
            }
        ]
    },
    "needle-valves": {
        name: "Needle Valves",
        subcategories: [
            {
                id: "compression-needle-valve",
                name: "Compression Needle Valve (Double Ferrule)",
                description: "Precision needle valve with compression fittings for instrumentation lines.",
                material: "Stainless Steel 316",
                pressure: "6000 PSI",
                temperature: "-40°C to 200°C",
                image: "compression needle valve.png"
            },
            {
                id: "high-pressure-needle-valve",
                name: "High-Pressure Needle Valve (6000 PSI)",
                description: "Heavy-duty needle valve for extreme pressure applications.",
                material: "Stainless Steel 316",
                pressure: "6000 PSI",
                temperature: "-50°C to 200°C",
                image: "high-pressure needle valve.png"
            },
            {
                id: "angle-needle-valve",
                name: "Angle Needle Valve",
                description: "90-degree angle design for space-constrained installations.",
                material: "Stainless Steel 316",
                pressure: "3000 PSI",
                temperature: "-20°C to 150°C",
                image: "angle needle valve.png"
            },
            {
                id: "panel-mount-needle-valve",
                name: "Panel Mount Needle Valve",
                description: "Designed for mounting on control panels and boards.",
                material: "Brass or Stainless Steel",
                pressure: "3000 PSI",
                temperature: "-20°C to 120°C",
                image: "panel mount needle valve.png"
            },
            {
                id: "integral-bonnet-needle-valve",
                name: "Integral Bonnet Needle Valve",
                description: "One-piece body and bonnet construction for enhanced strength.",
                material: "Stainless Steel 316",
                pressure: "5000 PSI",
                temperature: "-40°C to 200°C",
                image: "integral bonnet needle valve.png"
            },
            {
                id: "brass-needle-valve",
                name: "Brass Needle Valve (Butterfly handle)",
                description: "Economical brass needle valve with ergonomic butterfly handle.",
                material: "Brass",
                pressure: "1000 PSI",
                temperature: "-20°C to 120°C",
                image: "brass needle valve.png"
            }
        ]
    },
    "manifold-valves": {
        name: "Manifold Valves",
        subcategories: [
            {
                id: "2-valve-manifold",
                name: "2-Valve Manifold",
                description: "Two-valve configuration for pressure transmitter isolation.",
                material: "Stainless Steel 316",
                pressure: "6000 PSI",
                temperature: "-50°C to 200°C",
                image: "2-valve manifold.png"
            },
            {
                id: "3-valve-manifold",
                name: "3-Valve Manifold",
                description: "Three-valve design for isolation, equalization, and venting.",
                material: "Stainless Steel 316",
                pressure: "6000 PSI",
                temperature: "-50°C to 200°C",
                image: "3-valve manifold.png"
            },
            {
                id: "5-valve-manifold",
                name: "5-Valve Manifold",
                description: "Five-valve configuration for complex instrumentation.",
                material: "Stainless Steel 316",
                pressure: "6000 PSI",
                temperature: "-50°C to 200°C",
                image: "5-valve manifold.png"
            },
            {
                id: "monoflange-manifold",
                name: "Monoflange Manifold",
                description: "Compact single-flange design for space efficiency.",
                material: "Stainless Steel 316",
                pressure: "6000 PSI",
                temperature: "-50°C to 200°C",
                image: "monoflange manifold.png"
            },
            {
                id: "double-block-bleed-manifold",
                name: "Double Block and Bleed Manifold",
                description: "Provides dual isolation and bleed capability for safety-critical operations.",
                material: "Carbon Steel or Stainless Steel",
                pressure: "1440 PSI",
                temperature: "-29°C to 200°C",
                image: "double block.png"
            },
            {
                id: "coplanar-manifold",
                name: "Coplanar Manifold",
                description: "All connections in same plane for easy installation.",
                material: "Stainless Steel 316",
                pressure: "6000 PSI",
                temperature: "-50°C to 200°C",
                image: "coplanar manifold.png"
            }
        ]
    },
    "gauge-accessories": {
        name: "Gauge Accessories",
        subcategories: [
            {
                id: "diaphragm-seal",
                name: "Diaphragm Seal (Flanged/Bolted)",
                description: "Protects gauges from corrosive, viscous, or high-temperature media.",
                material: "Stainless Steel with various diaphragms",
                pressure: "Up to 6000 PSI",
                temperature: "-50°C to 400°C",
                image: "diaphragm seal.png"
            },
            {
                id: "pigtail-siphon",
                name: "Pigtail Siphon (Coil Siphon)",
                description: "Coiled pipe to protect gauge from steam temperature.",
                material: "Stainless Steel 304",
                pressure: "600 PSI",
                temperature: "-20°C to 200°C",
                image: "pigtail.png"
            },
            {
                id: "gauge-cock",
                name: "Gauge Cock (Pressure Gauge Valve)",
                description: "Small shut-off valve for isolating pressure gauges.",
                material: "Brass or Stainless Steel",
                pressure: "3000 PSI",
                temperature: "-20°C to 120°C",
                image: "gauge clock.png"
            },
            {
                id: "gauge-adapter",
                name: "Gauge Adapter (Threaded Reducer/Bushing)",
                description: "Adapter for connecting gauges to different thread sizes.",
                material: "Brass or Stainless Steel",
                pressure: "3000 PSI",
                temperature: "-20°C to 120°C",
                image: "gauge adapter.png"
            },
            {
                id: "snubber",
                name: "Snubber (Pressure Pulsation Dampener)",
                description: "Reduces pressure pulsations and surges to protect gauges.",
                material: "Stainless Steel 316",
                pressure: "5000 PSI",
                temperature: "-40°C to 120°C",
                image: "snubber.png"
            },
            {
                id: "pressure-gauge",
                name: "Pressure Gauge (Bourdon Tube)",
                description: "Standard pressure measurement instrument.",
                material: "Brass or Stainless Steel case",
                pressure: "Various ranges",
                temperature: "-20°C to 120°C",
                image: "pressuregauge.png"
            }
        ]
    },
    "check-valves": {
        name: "Check Valves",
        subcategories: [
            {
                id: "ball-check-valve",
                name: "Ball Check Valve",
                description: "Uses a ball to prevent reverse flow.",
                material: "Stainless Steel, PVC, Brass",
                pressure: "Up to 600 PSI",
                temperature: "-20°C to 150°C",
                image: "ball check valve.png"
            },
            {
                id: "dual-plate-check-valve",
                name: "Dual Plate Check Valve",
                description: "Two spring-loaded plates for quick response and compact design.",
                material: "Carbon Steel or Stainless Steel",
                pressure: "Up to 2500 PSI",
                temperature: "-29°C to 200°C",
                image: "dual plate check valve.png"
            },
            {
                id: "wafer-check-valve",
                name: "Wafer Check Valve",
                description: "Slim design that fits between flanges.",
                material: "Ductile Iron, Stainless Steel",
                pressure: "Up to 300 PSI",
                temperature: "-20°C to 150°C",
                image: "wafer check valve.png"
            },
            {
                id: "inline-spring-check-valve",
                name: "Inline Spring Check Valve",
                description: "Spring-assisted closing for silent operation.",
                material: "Brass, Stainless Steel",
                pressure: "Up to 600 PSI",
                temperature: "-20°C to 120°C",
                image: "inline spring check valve.png"
            },
            {
                id: "swing-check-valve",
                name: "Swing Check Valve",
                description: "Hinged disc that swings open/closed with flow.",
                material: "Cast Iron, Carbon Steel, Stainless Steel",
                pressure: "Up to 300 PSI",
                temperature: "-20°C to 150°C",
                image: "swing check valve.png"
            },
            {
                id: "lift-check-valve",
                name: "Lift Check Valve",
                description: "Disc lifts vertically off seat for high-pressure applications.",
                material: "Carbon Steel, Stainless Steel",
                pressure: "Up to 2500 PSI",
                temperature: "-29°C to 200°C",
                image: "lift check valve.png"
            },
            {
                id: "tube-fitting-check-valve",
                name: "Tube Fitting Check Valve",
                description: "Compact design for instrumentation tubing systems.",
                material: "Stainless Steel 316",
                pressure: "Up to 6000 PSI",
                temperature: "-40°C to 200°C",
                image: "compression needle valve.png"
            }
        ]
    }
};
// Get category display name
const getCategoryName = (categoryId) => {
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
};
// FIXED: Renamed from loadSubcategories to loadSubcategoriesPage
const loadSubcategoriesPage = () => {
    console.log('📡 Loading subcategories...');
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('cat') || 'tube-fittings';
    // Update page title
    const titleElement = document.getElementById('display-title');
    if (titleElement) {
        titleElement.textContent = getCategoryName(categoryId).toUpperCase();
    }
    // Update browser tab title
    document.title = `${getCategoryName(categoryId)} - Subcategories | Satyam Controls`;
    // Get subcategories for this category
    const category = categoryData[categoryId];
    if (!category) {
        showMessage(`No subcategories found for "${getCategoryName(categoryId)}"`, false);
        return;
    }
    // Display subcategories
    displaySubcategories(category.subcategories);
};
// Display subcategories in grid
const displaySubcategories = (subcategories) => {
    const grid = document.getElementById('subcategories-grid');
    if (!grid)
        return;
    // Show loading initially
    grid.innerHTML = '<div class="loading">Loading subcategories...</div>';
    setTimeout(() => {
        // Create subcategory cards
        grid.innerHTML = subcategories.map(subcategory => {
            // Try to get image from MongoDB first, then fallback to placeholder
            const imageUrl = `http://localhost:8000/api/products/image?name=${encodeURIComponent(subcategory.image)}`;
            const fallbackUrl = `https://via.placeholder.com/600x400/292C36/FFFFFF?text=${encodeURIComponent(subcategory.name)}`;
            return `
                <div class="subcategory-card" data-subcategory-id="${subcategory.id}">
                    <div class="image-container">
                        <img src="${imageUrl}" 
                             alt="${subcategory.name}" 
                             loading="lazy"
                             onerror="this.src='${fallbackUrl}'">
                    </div>
                    <div class="subcategory-info">
                        <h3>${subcategory.name}</h3>
                    </div>
                </div>
            `;
        }).join('');
        // Add click listeners to view product details
        const subcategoryCards = grid.querySelectorAll('.subcategory-card');
        subcategoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const subcategoryId = card.getAttribute('data-subcategory-id');
                const subcategory = subcategories.find(sc => sc.id === subcategoryId);
                if (subcategory) {
                    // Store subcategory data for detail page
                    const productData = {
                        name: subcategory.name,
                        desc: subcategory.description,
                        mat: subcategory.material,
                        press: subcategory.pressure,
                        temp: subcategory.temperature,
                        img: `https://via.placeholder.com/600x400/292C36/FFFFFF?text=${encodeURIComponent(subcategory.name)}`
                    };
                    localStorage.setItem('selectedProduct', JSON.stringify(productData));
                    window.location.href = 'product-detail.html';
                }
            });
        });
        console.log(`✅ Displayed ${subcategories.length} subcategories`);
    }, 100);
};
// Show message
const showMessage = (message, isError = false) => {
    const grid = document.getElementById('subcategories-grid');
    if (!grid)
        return;
    grid.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px;
            background: ${isError ? '#fff5f5' : '#f8f9fa'};
            border-radius: 20px;
            border: 1px solid ${isError ? '#f8d7da' : '#e9ecef'};
            margin: 20px;
        ">
            <h3 style="color: ${isError ? '#721c24' : '#495057'}; margin-bottom: 20px; font-size: 1.5rem;">
                ${isError ? '⚠️ Error' : 'ℹ️ Information'}
            </h3>
            <p style="color: ${isError ? '#856404' : '#6c757d'}; margin-bottom: 30px; font-size: 1.1rem; line-height: 1.6;">
                ${message}
            </p>
            <button onclick="window.history.back()" style="
                background: var(--dark-jungle);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">Back to Categories</button>
        </div>
    `;
};
// ==================== INITIALIZATION ====================
// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Subcategories page loaded, initializing...');
    // Setup back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'product.html';
        });
    }
    // FIXED: Updated function call
    loadSubcategoriesPage();
});
