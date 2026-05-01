// catalog.ts - Full Implementation with Smooth Transitions & Navigation Fix
// FIXED: Renamed loadSubcategories to loadCatalogSubcategories to avoid conflict

const specMapping: Record<string, { press: string, mat: string, desc: string, temp: string }> = {
    // Tube Fittings
    "Compression Male Connector": { press: "6000 PSI", mat: "SS 316", temp: "-50°C to 400°C", desc: "Precision-engineered for leak-proof connection from tubes to female NPT threads." },
    "Compression Hose Barb Adapter": { press: "500 PSI", mat: "Brass", temp: "-20°C to 120°C", desc: "Connects flexible tubing to compression systems with a secure barbed grip." },
    "Press-Fit 90° Elbow": { press: "300 PSI", mat: "SS 304/316", temp: "0°C to 100°C", desc: "Allows quick, flame-free pipe connections in plumbing and industrial cooling." },
    "Compression Union": { press: "6000 PSI", mat: "SS 316", temp: "-50°C to 400°C", desc: "Designed to join two tubes of the same size with a high-pressure seal." },
    "Threaded Female Equal Tee": { press: "3000 PSI", mat: "Forged Steel", temp: "-29°C to 425°C", desc: "A T-shaped fitting with three female threads for branching flow." },
    "Compression Reducing Union": { press: "6000 PSI", mat: "SS 316", temp: "-50°C to 400°C", desc: "Connects different sizes of tubing while maintaining pressure integrity." },

    // Ball Valves
    "3-Piece Ball Valve (Threaded)": { press: "1000 PSI", mat: "CF8M Stainless", temp: "-20°C to 180°C", desc: "Disassemblable valve for easy in-line cleaning and seal replacement." },
    "True Union Ball Valve (PVC/Plastic)": { press: "150 PSI", mat: "PVC / CPVC", temp: "0°C to 60°C", desc: "Corrosion-resistant valve for plastic piping systems." },
    "3-Piece Flanged Ball Valve": { press: "ANSI Class 300", mat: "Cast Steel", temp: "-29°C to 425°C", desc: "Heavy-duty flanged valve for oil and gas processing lines." },
    "2-Piece Ball Valve (Standard Industrial)": { press: "2000 WOG", mat: "SS 316", temp: "-20°C to 200°C", desc: "A robust valve used for on/off control in water and gas systems." },
    "1-Piece or 2-Piece Ball Valve (Full Port)": { press: "1000 PSI", mat: "Brass", temp: "-10°C to 120°C", desc: "Features an unrestricted flow path to minimize pressure drop." },
    "3-Way Ball Valve (Multi-port)": { press: "1000 PSI", mat: "SS 316", temp: "-20°C to 180°C", desc: "Diverter valve available in L-port or T-port configurations." },

    // Pipe Valves
    "Globe Valve": { press: "Class 800", mat: "A105 Steel", temp: "-29°C to 425°C", desc: "The industry standard for precision throttling and regulation." },
    "Butterfly Valves": { press: "200 PSI", mat: "Ductile Iron", temp: "-10°C to 120°C", desc: "Quarter-turn valve used for isolation in large diameter pipes." },
    "Mechanical Seals (or PTFE Bellows)": { press: "10 Bar", mat: "PTFE", temp: "-50°C to 200°C", desc: "Prevents leakage in pumps handling aggressive chemicals." },
    "Gate Valve (Flanged)": { press: "Class 150", mat: "WCB Steel", temp: "-29°C to 425°C", desc: "Provides straight-through flow with minimum resistance." },
    "Knife Gate Valve": { press: "150 PSI", mat: "SS 304", temp: "-10°C to 150°C", desc: "Sharp blade to cut through slurries, pulp, and solids." },
    "Eccentric Plug Valve": { press: "175 PSI", mat: "Ductile Iron", temp: "0°C to 80°C", desc: "Ideal for wastewater and abrasive slurries." },

    // Needle Valves
    "Compression Needle Valve (Double Ferrule)": { press: "6000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "Double ferrule ends for direct, high-pressure tube connection." },
    "High-Pressure Needle Valve (6000 PSI)": { press: "6000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "Forged body valve providing fine control of gas or liquid." },
    "Angle Needle Valve": { press: "6000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "90-degree body design for tight instrumentation layouts." },
    "Panel Mount Needle Valve": { press: "3000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "Threaded bonnet for secure mounting on control panels." },
    "Integral Bonnet Needle Valve": { press: "5000 PSI", mat: "Brass", temp: "-40°C to 149°C", desc: "Economical valve for general purpose instrumentation." },
    "Brass Needle Valve (Butterfly handle)": { press: "3000 PSI", mat: "Brass", temp: "-20°C to 120°C", desc: "Corrosion-resistant valve for air and oil systems." },

    // Manifold Valves
    "2-Valve Manifold": { press: "6000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "Combines isolation and vent functions for pressure gauges." },
    "3-Valve Manifold": { press: "6000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "Used for differential pressure transmitters." },
    "5-Valve Manifold": { press: "6000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "Provides block, equalize, and vent functions for DP measurement." },
    "Monoflange Manifold": { press: "Class 2500", mat: "SS 316", temp: "-54°C to 400°C", desc: "Compact flange-mounted valve for high-pressure isolation." },
    "Double Block and Bleed Manifold": { press: "Class 2500", mat: "SS 316", temp: "-54°C to 400°C", desc: "Critical isolation with two block valves and a bleed port." },
    "Coplanar Manifold": { press: "6000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "Direct mounting for Coplanar style transmitters." },

    // Gauge Accessories
    "Diaphragm Seal (Flanged/Bolted)": { press: "Class 1500", mat: "SS 316", temp: "-40°C to 300°C", desc: "Isolates instruments from corrosive or hot media." },
    "Pigtail Siphon (Coil Siphon)": { press: "3000 PSI", mat: "Carbon Steel", temp: "Up to 400°C", desc: "Coiled pipe protecting gauges from steam damage." },
    "Gauge Cock (Pressure Gauge Valve)": { press: "500 PSI", mat: "Brass", temp: "-20°C to 120°C", desc: "Simple on/off isolation for gauge calibration." },
    "Gauge Adapter (Threaded Reducer/Bushing)": { press: "6000 PSI", mat: "SS 316", temp: "-50°C to 400°C", desc: "Adapts different thread sizes between gauges and pipes." },
    "Snubber (Pressure Pulsation Dampener)": { press: "5000 PSI", mat: "Brass", temp: "-20°C to 120°C", desc: "Dampens pressure surges to protect gauge internals." },
    "Pressure Gauge (Bourdon Tube)": { press: "10000 PSI", mat: "SS Case", temp: "-40°C to 65°C", desc: "Instrument for visual monitoring of system pressure." },

    // Check Valves
    "Ball Check Valve": { press: "3000 PSI", mat: "SS 316", temp: "-40°C to 200°C", desc: "Uses a loaded ball to prevent backflow in lines." },
    "Dual Plate Check Valve": { press: "Class 150", mat: "Cast Iron", temp: "-10°C to 120°C", desc: "Prevents water hammer in large diameter pipelines." },
    "Wafer Check Valve": { press: "150 PSI", mat: "SS 316", temp: "-20°C to 180°C", desc: "Ultra-thin valve designed for flange installation." },
    "Inline Spring Check Valve": { press: "6000 PSI", mat: "SS 316", temp: "-50°C to 230°C", desc: "High-reliability poppet-style check valve." },
    "Swing Check Valve": { press: "800 PSI", mat: "Forged Steel", temp: "-29°C to 425°C", desc: "Uses a swinging disc to allow straight flow." },
    "Lift Check Valve": { press: "Class 800", mat: "SS 316", temp: "-29°C to 425°C", desc: "Gravity-assisted valve for horizontal service." }
};

const viewSubcategoryProducts = (subName: string, subId: string) => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
        const spec = specMapping[subName] || { 
            press: "Industrial Grade", mat: "SS 316", temp: "-40°C to 200°C", 
            desc: `High-quality ${subName} for Satyam Controls precision control.` 
        };

        const productData = {
            name: subName,
            desc: spec.desc,
            mat: spec.mat,
            press: spec.press,
            temp: spec.temp,
            img: `  /api/products/image/${subId}`
        };

        localStorage.setItem('selectedProduct', JSON.stringify(productData));
        window.location.href = 'product-detail.html';
    }, 400);
};

// FIXED: Renamed from loadSubcategories to loadCatalogSubcategories
const loadCatalogSubcategories = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('cat') || 'tube-fittings';
    
    try {
        const response = await fetch(`  /api/products/category/${categoryId}/subcategories`);
        const data = await response.json();
        
        const grid = document.getElementById('products-grid-view');
        if (!grid) return;
        
        // Reset styles for back button transition
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'scale(1)';
        }

        grid.innerHTML = ''; 

        data.subcategories.slice(0, 6).forEach((sub: any) => {
            const currentId = sub._id || sub.id;
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="image-container">
                    <img src="  /api/products/image/${currentId}" alt="${sub.name}" 
                         onerror="this.src='https://placehold.co/400x300?text=Product'">
                </div>
                <div class="product-info"><h3>${sub.name}</h3></div>
            `;
            card.addEventListener('click', () => viewSubcategoryProducts(sub.name, currentId));
            grid.appendChild(card);
        });

        const title = document.getElementById('display-title');
        if (title) title.textContent = data.categoryName.toUpperCase();
    } catch (e) { console.error(e); }
};

// FIXED: Updated function calls
window.addEventListener('pageshow', (event) => {
    loadCatalogSubcategories();
});

document.addEventListener('DOMContentLoaded', loadCatalogSubcategories);