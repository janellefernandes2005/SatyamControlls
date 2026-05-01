export const productDatabase = {
    "tube-fittings": {
        name: "Tube Fittings",
        items: [
            { name: "Compression Male Connector", img: "compression male connector.png", desc: "Precision-engineered connectors for high-pressure instrumentation systems. These provide a high-integrity, leak-proof seal in vacuum and high-pressure applications.", mat: "SS 316 / 316L", press: "Up to 6000 PSI", temp: "-320°F to 1200°F" },
            { name: "Compression Hose Barb Adapter", img: "compression horse barb.png", desc: "Designed for a secure transition between rigid instrumentation tubing and flexible hoses. Ideal for sampling and low-pressure fluid transfer.", mat: "Brass / SS 316", press: "2500 PSI", temp: "-40°C to 120°C" },
            { name: "Press-Fit 90° Elbow", img: "press fit 90.png", desc: "Designed for rapid, flame-free installation in industrial piping systems, significantly reducing installation time.", mat: "SS 304 / 316", press: "500 PSI (Water)", temp: "-20°C to 150°C" },
            { name: "Compression Union", img: "compression union.png", desc: "A robust solution for connecting two tubes of equal diameter, manufactured to ensure repeatable, gas-tight seals.", mat: "SS 316", press: "6000 PSI", temp: "Up to 600°C" },
            { name: "Threaded Female Equal Tee", img: "threaded female tee.png", desc: "T-shaped fitting allows for high-pressure flow distribution in three directions. Precision-threaded to NPT/BSP standards.", mat: "Carbon Steel / SS 316", press: "3000 PSI", temp: "-50°C to 200°C" },
            { name: "Compression Reducing Union", img: "compression reducing union.png", desc: "Engineered to join tubes of different sizes without losing flow integrity. Vital for transitioning main lines to instrumentation loops.", mat: "SS 316", press: "6000 PSI", temp: "-20°C to 150°C" }
        ]
    },
    "ball-valves": {
        name: "Ball Valves",
        items: [
            { name: "3-Piece Ball Valve (Threaded)", img: "3-piece ball valve.png", desc: "Allows the center section to be swung out for maintenance without disturbing pipework. Professional choice for process control.", mat: "ASTM A351 CF8M", press: "1000 WOG", temp: "-20°F to 450°F" },
            { name: "True Union Ball Valve (PVC)", img: "true union ball valve.png", desc: "Specially designed for corrosive chemical environments. 'True Union' design allows removal by simply unscrewing nuts.", mat: "PVC / CPVC / PP", press: "150 PSI", temp: "32°F to 140°F" },
            { name: "3-Piece Flanged Ball Valve", img: "3-piece flanged ball ....png", desc: "Heavy-duty flanged design built for maximum safety in high-pressure oil and gas pipelines. Fire-safe standards compliant.", mat: "Carbon Steel / SS 316", press: "ASME Class 150/300/600", temp: "-29°C to 200°C" },
            { name: "2-Piece Ball Valve (Standard)", img: "2-piece ball valve.png", desc: "Compact industrial valve featuring a blow-out proof stem. Industry standard for air, water, and steam systems.", mat: "WCB Carbon Steel", press: "2000 PSI", temp: "-20°C to 200°C" },
            { name: "Full Port Ball Valve", img: "1-piece ball valve.png", desc: "Zero flow restriction. The ball's inner diameter is identical to pipe diameter, ensuring maximum flow rates.", mat: "Bronze / SS 316", press: "600 PSI", temp: "-20°C to 200°C" },
            { name: "3-Way Ball Valve", img: "3-way ball valve.png", desc: "Multi-port valve designed for flow diversion, mixing, and system bypass. Replaces multiple two-way valves to save space.", mat: "SS 316", press: "1000 PSI", temp: "-20°C to 150°C" }
        ]
    },
    "pipe-valves": {
        name: "Pipe Valves",
        items: [
            { name: "Globe Valve", img: "globe valve.png", desc: "Linear motion valve for high-precision throttling. Superior control for managing steam and high-pressure gases.", mat: "F316 SS", press: "Class 150-2500", temp: "-20°C to 450°C" },
            { name: "Butterfly Valves", img: "butterfly valves.png", desc: "Quarter-turn disc valve for flow control in large-diameter piping. Cost-effective for water treatment and HVAC.", mat: "Cast Iron / SS", press: "150-300 PSI", temp: "-20°C to 150°C" },
            { name: "Mechanical Seals", img: "mechanical seals.png", desc: "Premium PTFE sealing solutions for pumps. Engineered to prevent leakage of hazardous industrial fluids.", mat: "PTFE / Ceramic", press: "Standard", temp: "-40°C to 200°C" },
            { name: "Gate Valve (Flanged)", img: "gate valve.png", desc: "Full-bore isolation valve providing an unobstructed flow path. Suitable for oil, gas, and power plant pipelines.", mat: "Carbon Steel", press: "ANSI 150/300", temp: "-20°C to 400°C" },
            { name: "Knife Gate Valve", img: "knife gate valve.png", desc: "Features a sharpened stainless steel gate to cut through thick slurries, paper pulp, and wastewater.", mat: "Ductile Iron", press: "150 PSI", temp: "-20°C to 150°C" },
            { name: "Eccentric Plug Valve", img: "eccentric plug valve.png", desc: "Designed for abrasive liquids. The plug moves away from seat instantly, reducing wear and ensuring bubble-tight shut-off.", mat: "Ductile Iron", press: "200 PSI", temp: "-20°C to 100°C" }
        ]
    },
    "needle-valves": {
        name: "Needle Valves",
        items: [
            { name: "Compression Needle Valve", img: "compression needle valve.png", desc: "Fine-threaded stem provides accurate flow control for instrumentation. Double-ferrule ends ensure leak-proof tubing.", mat: "SS 316", press: "6000 PSI", temp: "-40°C to 200°C" },
            { name: "High-Pressure Needle Valve", img: "high-pressure needle valve.png", desc: "Heavy industrial valve built for extreme environments. Features hardened non-rotating stem tip to prevent galling.", mat: "SS 316", press: "6000 PSI", temp: "-50°C to 200°C" },
            { name: "Angle Needle Valve", img: "angle needle valve.png", desc: "90-degree configuration for compact panel mounting. Combines precision control with elbow routing functionality.", mat: "SS 316", press: "3000 PSI", temp: "-20°C to 150°C" },
            { name: "Panel Mount Needle Valve", img: "panel mount needle valve.png", desc: "Specifically for laboratory and process control panel installations. Features integrated bulkhead mounting nut.", mat: "Brass / SS 316", press: "3000 PSI", temp: "-20°C to 120°C" },
            { name: "Integral Bonnet Needle Valve", img: "integral bonnet needle valve.png", desc: "Compact single-piece body. Absence of separate bonnet eliminates primary leak paths, perfect for vibration.", mat: "SS 316", press: "5000 PSI", temp: "-40°C to 200°C" },
            { name: "Brass Needle Valve", img: "brass needle valve.png", desc: "Economical choice for low-pressure air and water systems. Features high-leverage butterfly handle.", mat: "Brass", press: "1000 PSI", temp: "-20°C to 120°C" }
        ]
    },
    "manifold-valves": {
        name: "Manifold Valves",
        items: [
            { name: "2-Valve Manifold", img: "2-valve manifold.png", desc: "Isolating and calibrating pressure transmitters. Allows field calibration without removing instrument.", mat: "SS 316", press: "6000 PSI", temp: "-50°C to 200°C" },
            { name: "3-Valve Manifold", img: "3-valve manifold.png", desc: "Standard for differential pressure transmitters. Features two isolation and one equalizer valve.", mat: "SS 316", press: "6000 PSI", temp: "-50°C to 200°C" },
            { name: "5-Valve Manifold", img: "5-valve manifold.png", desc: "Advanced control for DP measurement. Essential for complex instrumentation loops requiring frequent venting.", mat: "SS 316", press: "6000 PSI", temp: "-50°C to 200°C" },
            { name: "Monoflange Manifold", img: "monoflange manifold.png", desc: "Slim-line manifold combining primary and secondary isolation. Simplifies mounting instruments to process flanges.", mat: "SS 316", press: "6000 PSI", temp: "-50°C to 200°C" },
            { name: "Double Block & Bleed", img: "double block.png", desc: "Critical safety manifold for high-risk chemical operations. Provides dual isolation and central bleed.", mat: "A105 / F316", press: "6000 PSI", temp: "-29°C to 200°C" },
            { name: "Coplanar Manifold", img: "coplanar manifold.png", desc: "Mounts directly to transmitter pressure cells. Eliminates impulse lines, creating a rigid leak-resistant assembly.", mat: "SS 316", press: "6000 PSI", temp: "-50°C to 200°C" }
        ]
    },
    "gauge-accessories": {
        name: "Gauge Accessories",
        items: [
            { name: "Diaphragm Seal", img: "diaphragm seal.png", desc: "Flexible membrane isolating gauge mechanism from aggressive media. Transmits pressure via fill fluid.", mat: "SS / Hastelloy", press: "6000 PSI", temp: "-50°C to 400°C" },
            { name: "Pigtail Siphon", img: "pigtail.png", desc: "Coiled pipe protecting pressure instruments from high-temperature steam by creating a cool liquid barrier.", mat: "SS 304", press: "600 PSI", temp: "-20°C to 300°C" },
            { name: "Gauge Cock", img: "gauge clock.png", desc: "Manual shut-off valve allowing gauge removal while system remains pressurized.", mat: "Brass / SS 316", press: "3000 PSI", temp: "-20°C to 120°C" },
            { name: "Gauge Adapter", img: "gauge adapter.png", desc: "Precision bushings used to convert thread types (NPT to BSP) for gauge installation.", mat: "Brass / SS 316", press: "3000 PSI", temp: "-20°C to 120°C" },
            { name: "Snubber", img: "snubber.png", desc: "Dampens pressure spikes and pulsations from pumps, protecting internal mechanism from fatigue.", mat: "SS 316", press: "5000 PSI", temp: "-40°C to 120°C" },
            { name: "Pressure Gauge", img: "pressuregauge.png", desc: "High-accuracy Bourdon tube pressure gauge. First line of defense in maintaining system safety.", mat: "SS Case", press: "Varies", temp: "-20°C to 120°C" }
        ]
    },
    "check-valves": {
        name: "Check Valves",
        items: [
            { name: "Ball Check Valve", img: "ball check valve.png", desc: "Highly reliable valve using a free-moving ball mechanism. Effective for thick or viscous fluids.", mat: "SS / PVC", press: "600 PSI", temp: "-20°C to 150°C" },
            { name: "Dual Plate Check Valve", img: "dual plate check valve.png", desc: "Spring-loaded plates close instantly to prevent water hammer. Very compact compared to swing types.", mat: "SS 316", press: "2500 PSI", temp: "-29°C to 200°C" },
            { name: "Wafer Check Valve", img: "wafer check valve.png", desc: "Ultra-slim design clamped between flanges. Ideal for HVAC and water distribution skids.", mat: "Ductile Iron", press: "300 PSI", temp: "-20°C to 150°C" },
            { name: "Inline Spring Check Valve", img: "inline spring check valve.png", desc: "Poppet-style valve providing positive shut-off. Widely used in instrumentation panels.", mat: "Brass / SS 316", press: "600 PSI", temp: "-20°C to 120°C" },
            { name: "Swing Check Valve", img: "swing check valve.png", desc: "Hinged disc offers very low flow resistance. Primary choice for large municipal water lines.", mat: "Cast Iron / WCB", press: "300 PSI", temp: "-20°C to 150°C" },
            { name: "Lift Check Valve", img: "lift check valve.png", desc: "Disc lifts vertically and returns via gravity. Rugged design suitable for industrial steam.", mat: "Carbon / SS 316", press: "2500 PSI", temp: "-29°C to 250°C" },
            { name: "Tube Fitting Check Valve", img: "compression needle valve.png", desc: "Miniature check valve integrated with tube fittings for analytical instrumentation.", mat: "SS 316", press: "6000 PSI", temp: "-40°C to 200°C" }
        ]
    }
};
