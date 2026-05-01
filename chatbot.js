// chatbot.js - ULTIMATE FIXED VERSION - Recognizes ALL products including CHECK VALVE
const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api'
    : '/api';
(function() {
    // ============ COMPLETE PRODUCT DATABASE ============
    const PRODUCT_DATABASE = {
        // Tube Fittings
        "compression male connector": {
            name: "Compression Male Connector",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-50°C to 400°C",
            description: "Precision-engineered for leak-proof connection from tubes to female NPT threads.",
            applications: ["instrumentation", "hydraulic systems", "control panels"],
            suitableFor: ["high pressure", "industrial", "precision connections"]
        },
        "compression hose barb adapter": {
            name: "Compression Hose Barb Adapter",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            pressure: "500 PSI",
            material: "Brass",
            temperature: "-20°C to 120°C",
            description: "Connects flexible tubing to compression systems with a secure barbed grip.",
            applications: ["pneumatic systems", "cooling lines", "low pressure"],
            suitableFor: ["low pressure", "flexible connections", "general purpose"]
        },
        "press-fit 90° elbow": {
            name: "Press-Fit 90° Elbow",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            pressure: "300 PSI",
            material: "SS 304/316",
            temperature: "0°C to 100°C",
            description: "Allows quick, flame-free pipe connections in plumbing and industrial cooling.",
            applications: ["plumbing", "cooling systems", "water lines"],
            suitableFor: ["quick installation", "space-saving", "moderate pressure"]
        },
        "compression union": {
            name: "Compression Union",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-50°C to 400°C",
            description: "Designed to join two tubes of the same size with a high-pressure seal.",
            applications: ["tube joining", "instrumentation", "hydraulics"],
            suitableFor: ["high pressure", "tube connections", "industrial"]
        },
        "threaded female equal tee": {
            name: "Threaded Female Equal Tee",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            pressure: "3000 PSI",
            material: "Forged Steel",
            temperature: "-29°C to 425°C",
            description: "A T-shaped fitting with three female threads for branching flow.",
            applications: ["branching", "manifolds", "distribution"],
            suitableFor: ["branch connections", "industrial piping"]
        },
        "compression reducing union": {
            name: "Compression Reducing Union",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-50°C to 400°C",
            description: "Connects different sizes of tubing while maintaining pressure integrity.",
            applications: ["size transitions", "instrumentation", "hydraulics"],
            suitableFor: ["different tube sizes", "high pressure"]
        },

        // Ball Valves
        "3-piece ball valve": {
            name: "3-Piece Ball Valve (Threaded)",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            pressure: "1000 PSI",
            material: "CF8M Stainless",
            temperature: "-20°C to 180°C",
            description: "Disassemblable valve for easy in-line cleaning and seal replacement.",
            applications: ["chemical processing", "pharmaceutical", "food industry"],
            suitableFor: ["easy maintenance", "sanitary applications", "moderate pressure"]
        },
        "true union ball valve": {
            name: "True Union Ball Valve (PVC/Plastic)",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            pressure: "150 PSI",
            material: "PVC / CPVC",
            temperature: "0°C to 60°C",
            description: "Corrosion-resistant valve for plastic piping systems.",
            applications: ["water treatment", "chemical dosing", "corrosive fluids"],
            suitableFor: ["corrosive environments", "low pressure", "chemical resistance"]
        },
        "3-piece flanged ball valve": {
            name: "3-Piece Flanged Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            pressure: "ANSI Class 300 (720 PSI)",
            material: "Cast Steel",
            temperature: "-29°C to 425°C",
            description: "Heavy-duty flanged valve for oil and gas processing lines.",
            applications: ["oil & gas", "refineries", "high temperature processes"],
            suitableFor: ["high temperature", "industrial", "flanged connections"]
        },
        "2-piece ball valve": {
            name: "2-Piece Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            pressure: "2000 WOG",
            material: "SS 316",
            temperature: "-20°C to 200°C",
            description: "A robust valve used for on/off control in water and gas systems.",
            applications: ["water systems", "gas lines", "general purpose"],
            suitableFor: ["on/off control", "industrial", "reliable"]
        },
        "full port ball valve": {
            name: "Full Port Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            pressure: "1000 PSI",
            material: "Brass",
            temperature: "-10°C to 120°C",
            description: "Features an unrestricted flow path to minimize pressure drop.",
            applications: ["high flow", "minimal pressure drop", "general service"],
            suitableFor: ["full flow", "low pressure drop"]
        },
        "3-way ball valve": {
            name: "3-Way Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            pressure: "1000 PSI",
            material: "SS 316",
            temperature: "-20°C to 180°C",
            description: "Diverter valve available in L-port or T-port configurations.",
            applications: ["diversion", "mixing", "multi-directional flow"],
            suitableFor: ["flow diversion", "mixing applications"]
        },

        // Needle Valves
        "high pressure needle valve": {
            name: "High-Pressure Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-54°C to 232°C",
            description: "Forged body valve providing fine control of gas or liquid.",
            applications: ["instrumentation", "sampling systems", "high pressure lines"],
            suitableFor: ["precise control", "high pressure", "gas systems"]
        },
        "angle needle valve": {
            name: "Angle Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-54°C to 232°C",
            description: "90-degree body design for tight instrumentation layouts.",
            applications: ["panel mounting", "space-constrained areas", "instrumentation"],
            suitableFor: ["tight spaces", "angled installations", "precision control"]
        },
        "compression needle valve": {
            name: "Compression Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-54°C to 232°C",
            description: "Double ferrule ends for direct, high-pressure tube connection.",
            applications: ["tube systems", "instrumentation", "hydraulics"],
            suitableFor: ["direct tube connection", "high pressure"]
        },
        "panel mount needle valve": {
            name: "Panel Mount Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            pressure: "3000 PSI",
            material: "SS 316",
            temperature: "-54°C to 232°C",
            description: "Threaded bonnet for secure mounting on control panels.",
            applications: ["control panels", "instrumentation", "test stands"],
            suitableFor: ["panel mounting", "industrial control"]
        },
        "integral bonnet needle valve": {
            name: "Integral Bonnet Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            pressure: "5000 PSI",
            material: "Brass",
            temperature: "-40°C to 149°C",
            description: "Economical valve for general purpose instrumentation.",
            applications: ["general purpose", "air systems", "oil systems"],
            suitableFor: ["economical", "general instrumentation"]
        },
        "brass needle valve": {
            name: "Brass Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            pressure: "3000 PSI",
            material: "Brass",
            temperature: "-20°C to 120°C",
            description: "Corrosion-resistant valve for air and oil systems.",
            applications: ["air systems", "oil systems", "general purpose"],
            suitableFor: ["corrosion resistance", "moderate pressure"]
        },

        // Manifold Valves
        "2-valve manifold": {
            name: "2-Valve Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-54°C to 232°C",
            description: "Combines isolation and vent functions for pressure gauges.",
            applications: ["pressure transmitters", "gauge isolation", "instrumentation"],
            suitableFor: ["gauge protection", "instrument isolation", "compact design"]
        },
        "3-valve manifold": {
            name: "3-Valve Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-54°C to 232°C",
            description: "Used for differential pressure transmitters.",
            applications: ["DP transmitters", "flow measurement", "level measurement"],
            suitableFor: ["differential pressure", "precision measurement", "instrumentation"]
        },
        "5-valve manifold": {
            name: "5-Valve Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-54°C to 232°C",
            description: "Provides block, equalize, and vent functions for DP measurement.",
            applications: ["DP transmitters", "critical measurement", "industrial"],
            suitableFor: ["complete isolation", "DP measurement"]
        },
        "monoflange manifold": {
            name: "Monoflange Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            pressure: "Class 2500 (6000 PSI)",
            material: "SS 316",
            temperature: "-54°C to 400°C",
            description: "Compact flange-mounted valve for high-pressure isolation.",
            applications: ["direct mount", "high pressure", "offshore"],
            suitableFor: ["compact installation", "high pressure"]
        },
        "double block and bleed manifold": {
            name: "Double Block and Bleed Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            pressure: "Class 2500 (6000 PSI)",
            material: "SS 316",
            temperature: "-54°C to 400°C",
            description: "Critical isolation with two block valves and a bleed port.",
            applications: ["critical isolation", "safety systems", "instrumentation"],
            suitableFor: ["positive isolation", "safety critical"]
        },
        "coplanar manifold": {
            name: "Coplanar Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-54°C to 232°C",
            description: "Direct mounting for Coplanar style transmitters.",
            applications: ["coplanar transmitters", "instrumentation", "industrial"],
            suitableFor: ["direct transmitter mount", "compact"]
        },

        // CHECK VALVES - COMPLETE SECTION
        "ball check valve": {
            name: "Ball Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            pressure: "3000 PSI",
            material: "SS 316",
            temperature: "-40°C to 200°C",
            description: "Uses a loaded ball to prevent backflow in lines.",
            applications: ["pump protection", "backflow prevention", "general piping"],
            suitableFor: ["vertical installation", "clean fluids", "moderate pressure"]
        },
        "inline spring check valve": {
            name: "Inline Spring Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-50°C to 230°C",
            description: "High-reliability poppet-style check valve.",
            applications: ["high pressure systems", "hydraulics", "critical backflow prevention"],
            suitableFor: ["any orientation", "high pressure", "reliable sealing"]
        },
        "dual plate check valve": {
            name: "Dual Plate Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            pressure: "Class 150 (285 PSI)",
            material: "Cast Iron",
            temperature: "-10°C to 120°C",
            description: "Prevents water hammer in large diameter pipelines.",
            applications: ["water hammer prevention", "large pipelines", "water systems"],
            suitableFor: ["water hammer control", "large diameter"]
        },
        "swing check valve": {
            name: "Swing Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            pressure: "800 PSI",
            material: "Forged Steel",
            temperature: "-29°C to 425°C",
            description: "Uses a swinging disc to allow straight flow.",
            applications: ["horizontal flow", "industrial piping", "general service"],
            suitableFor: ["horizontal installation", "low pressure drop"]
        },
        "lift check valve": {
            name: "Lift Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            pressure: "Class 800 (2000 PSI)",
            material: "SS 316",
            temperature: "-29°C to 425°C",
            description: "Gravity-assisted valve for horizontal service.",
            applications: ["horizontal lines", "steam service", "industrial"],
            suitableFor: ["horizontal installation", "steam"]
        },
        "wafer check valve": {
            name: "Wafer Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            pressure: "150 PSI",
            material: "SS 316",
            temperature: "-20°C to 180°C",
            description: "Ultra-thin valve designed for flange installation.",
            applications: ["space-saving", "between flanges", "general service"],
            suitableFor: ["compact installation", "between flanges"]
        },

        // Gauge Accessories
        "diaphragm seal": {
            name: "Diaphragm Seal",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            pressure: "Class 1500 (3600 PSI)",
            material: "SS 316",
            temperature: "-40°C to 300°C",
            description: "Isolates instruments from corrosive or hot media.",
            applications: ["corrosive fluids", "high temperature", "viscous media"],
            suitableFor: ["gauge protection", "corrosive environments", "high temperature"]
        },
        "pigtail siphon": {
            name: "Pigtail Siphon",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            pressure: "3000 PSI",
            material: "Carbon Steel",
            temperature: "Up to 400°C",
            description: "Coiled pipe protecting gauges from steam damage.",
            applications: ["steam lines", "boilers", "high temperature measurement"],
            suitableFor: ["steam service", "high temperature", "pressure gauges"]
        },
        "gauge cock": {
            name: "Gauge Cock",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            pressure: "500 PSI",
            material: "Brass",
            temperature: "-20°C to 120°C",
            description: "Simple on/off isolation for gauge calibration.",
            applications: ["gauge isolation", "calibration", "general purpose"],
            suitableFor: ["gauge isolation", "economical"]
        },
        "gauge adapter": {
            name: "Gauge Adapter",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            pressure: "6000 PSI",
            material: "SS 316",
            temperature: "-50°C to 400°C",
            description: "Adapts different thread sizes between gauges and pipes.",
            applications: ["thread adaptation", "gauge mounting", "instrumentation"],
            suitableFor: ["thread conversion", "high pressure"]
        },
        "snubber": {
            name: "Snubber",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            pressure: "5000 PSI",
            material: "Brass",
            temperature: "-20°C to 120°C",
            description: "Dampens pressure surges to protect gauge internals.",
            applications: ["pulsation control", "surge protection", "gauge protection"],
            suitableFor: ["pressure pulsation", "gauge protection"]
        },
        "pressure gauge": {
            name: "Pressure Gauge",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            pressure: "10000 PSI",
            material: "SS Case",
            temperature: "-40°C to 65°C",
            description: "Instrument for visual monitoring of system pressure.",
            applications: ["pressure monitoring", "visual indication", "general purpose"],
            suitableFor: ["pressure reading", "local indication"]
        }
    };

    // ============ MULTILINGUAL RESPONSES ============
    const TRANSLATIONS = {
        en: {
            welcome: '⚙️ SYSTEM BOOTING...\n🔄 INITIALIZING SATYAM INDUSTRIAL ASSISTANT...\n✅ SYSTEM READY\n\n🔧 Hello! I am your industrial assistant. Please select your language:',
            selectLang: '🔧 SELECT LANGUAGE:',
            hi: '🇮🇳 हिन्दी',
            en: '🇬🇧 ENGLISH',
            mr: '🇮🇳 मराठी',
            kn: '🇮🇳 ಕನ್ನಡ',
            greeting: '👋 Hello! How can I help you today?',
            help: '💬 I can help you with:\n• Finding specific products\n• Contact details\n• Business hours\n• Address & location\n• Product recommendations based on pressure/temperature\n• Step-by-step navigation guide\n\nJust tell me what you need!',
            needHelp: '😊 What would you like help with?',
            thankYou: '🙏 You\'re welcome! Is there anything else I can help with?',
            menu: '⚙️ HOW CAN I HELP?',
            contact: '📞 CONTACT DETAILS',
            products: '🔧 PRODUCTS',
            about: '🏭 ABOUT US',
            hours: '⏰ BUSINESS HOURS',
            address: '📍 ADDRESS',
            guide: '🧭 NAVIGATION GUIDE',
            typeHere: '⚙️ TYPE YOUR QUERY...',
            send: '➤',
            contactInfo: {
                title: '📋 CONTACT INFORMATION',
                address: '🏭 UNIT NO 20, GROUND FLOOR\nVASUNDHRA INDUSTRIAL ESTATE\nKT PARK, GORAL PADA\nVASAI (EAST), MAHARASHTRA 401208',
                phone: '📞 +91 86000 85244',
                email: '✉️ satyamcontrols10@gmail.com',
                hours: '⏰ MON-FRI: 9AM-6PM | SAT: 9AM-2PM',
                map: '🗺️ OPEN IN GOOGLE MAPS'
            },
            aboutInfo: {
                title: '🏭 ABOUT SATYAM CONTROLS',
                description: 'Leading manufacturer of industrial instrumentation products since 2005.',
                products: '🔧 Our Products:\n• Tube Fittings - Precision connections\n• Ball Valves - Flow control\n• Pipe Valves - Industrial valves\n• Needle Valves - Fine regulation\n• Manifold Valves - Pressure management\n• Gauge Accessories - Instrument protection\n• Check Valves - Backflow prevention',
                quality: '✨ Quality: ISO 9001, CE certified',
                applications: '⚙️ Industries: Oil & Gas, Chemical, Pharmaceutical, Power, Water Treatment'
            },
            navGuide: {
                title: '🧭 HOW TO FIND PRODUCTS:',
                step1: '1️⃣ Click on "Products" in the navigation bar',
                step2: '2️⃣ Browse main categories:',
                categories: '   • Tube Fittings\n   • Ball Valves\n   • Pipe Valves\n   • Needle Valves\n   • Manifold Valves\n   • Gauge Accessories\n   • Check Valves',
                step3: '3️⃣ Click any category to see sub-products',
                step4: '4️⃣ Click any product to view details',
                help: '💡 Or tell me which product you need and I\'ll guide you directly!'
            },
            specificNav: {
                title: '🔍 To find {product}:',
                step1: '1️⃣ Click on "Products" in the navigation bar',
                step2: '2️⃣ Click on the **{category}** category',
                step3: '3️⃣ Scroll through products in {category}',
                step4: '4️⃣ Look for **{product}** and click to view details',
                direct: '⚡ Would you like me to take you directly to the {category} section?'
            },
            productPrompt: '🔧 Which product category are you interested in?\n\n• Tube Fittings\n• Ball Valves\n• Pipe Valves\n• Needle Valves\n• Manifold Valves\n• Gauge Accessories\n• Check Valves',
            navigating: '🔍 Taking you to {category} section...',
            needMoreHelp: '❓ Still need help? I can:',
            options: {
                guide: '🧭 Show navigation guide',
                specific: '🔍 Help find specific product',
                contact: '📞 Contact support'
            },
            searching: '🔍 Searching for products matching your requirements...',
            foundProducts: '✨ I found these products that might work for you:',
            highPressureResponse: '🔧 **High Pressure Products (6000 PSI):**\n\n• Compression Male Connector\n• Compression Union\n• High-Pressure Needle Valve\n• 2-Valve Manifold\n• 3-Valve Manifold\n• Inline Spring Check Valve\n• Angle Needle Valve\n• Gauge Adapter\n\nAll these products are rated for 6000 PSI and suitable for high-pressure applications.',
            buyingGuidance: '📝 **How to Purchase Products:**\n\nYou can purchase our products through any of these methods:\n\n📧 **Email:** Send your inquiry with product details to satyamcontrols10@gmail.com\n\n📞 **Phone:** Call us at +91 86000 85244 for immediate assistance\n\n🌐 **Website:** Fill out the contact form on our Contact page\n\n💬 **Chat:** Continue chatting with me and I\'ll help you find the right product\n\nOur team will respond within 24 hours with quotation and availability.',
            recommendationPrompt: '🔍 **To give you the best recommendation, please tell me:**\n\n• What is your application? (e.g., instrumentation, hydraulic, steam)\n• What pressure rating do you need? (e.g., 150 PSI, 1000 PSI, 6000 PSI)\n• What temperature range?\n• Any specific material requirement? (SS 316, Brass, Carbon Steel)\n\nI\'ll suggest the most suitable products based on your needs!',
            contactSupport: '📞 **Contact Support:**\n\nOur technical support team is ready to help you!\n\n📧 Email: satyamcontrols10@gmail.com\n📞 Phone: +91 86000 85244\n\nPlease share your requirements and our team will get back to you with expert recommendations.',
            productInfo: {
                title: '📋 Product Information',
                pressure: 'Pressure',
                temperature: 'Temperature',
                material: 'Material',
                category: 'Category'
            }
        },
        hi: {
            welcome: '⚙️ सिस्टम शुरू हो रहा है...\n🔄 सत्यम इंडस्ट्रियल असिस्टेंट शुरू...\n✅ सिस्टम तैयार\n\n🔧 नमस्ते! मैं आपका सहायक हूं। कृपया अपनी भाषा चुनें:',
            selectLang: '🔧 भाषा चुनें:',
            hi: '🇮🇳 हिन्दी',
            en: '🇬🇧 ENGLISH',
            mr: '🇮🇳 मराठी',
            kn: '🇮🇳 ಕನ್ನಡ',
            greeting: '👋 नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?',
            help: '💬 मैं आपकी इन चीजों में मदद कर सकता हूं:\n• खास प्रोडक्ट ढूंढना\n• संपर्क विवरण\n• व्यावसायिक समय\n• पता और स्थान\n• दबाव/तापमान के आधार पर प्रोडक्ट सुझाव\n• चरण-दर-चरण नेविगेशन गाइड\n\nबस मुझे बताएं कि आपको क्या चाहिए!',
            needHelp: '😊 आपको क्या चाहिए?',
            thankYou: '🙏 धन्यवाद! कुछ और मदद चाहिए?',
            menu: '⚙️ कैसे मदद करूं?',
            contact: '📞 संपर्क विवरण',
            products: '🔧 प्रोडक्ट्स',
            about: '🏭 हमारे बारे में',
            hours: '⏰ व्यावसायिक समय',
            address: '📍 पता',
            guide: '🧭 नेविगेशन गाइड',
            typeHere: '⚙️ अपना सवाल लिखें...',
            send: 'भेजें',
            contactInfo: {
                title: '📋 संपर्क जानकारी',
                address: '🏭 यूनिट नंबर 20, ग्राउंड फ्लोर\nवसुंधरा इंडस्ट्रियल एस्टेट\nकेटी पार्क, गोराल पाडा\nवसई (पूर्व), महाराष्ट्र 401208',
                phone: '📞 +91 86000 85244',
                email: '✉️ satyamcontrols10@gmail.com',
                hours: '⏰ सोम-शुक्र: सुबह 9-शाम 6 | शनि: सुबह 9-दोपहर 2',
                map: '🗺️ गूगल मैप्स में खोलें'
            },
            aboutInfo: {
                title: '🏭 सत्यम कंट्रोल्स के बारे में',
                description: '2005 से औद्योगिक इंस्ट्रूमेंटेशन उत्पादों के अग्रणी निर्माता।',
                products: '🔧 हमारे उत्पाद:\n• ट्यूब फिटिंग - प्रिसिजन कनेक्शन\n• बॉल वाल्व - फ्लो कंट्रोल\n• पाइप वाल्व - इंडस्ट्रियल वाल्व\n• नीडल वाल्व - फाइन रेगुलेशन\n• मैनिफोल्ड वाल्व - प्रेशर मैनेजमेंट\n• गेज एक्सेसरीज - इंस्ट्रूमेंट प्रोटेक्शन\n• चेक वाल्व - बैकफ्लो प्रिवेंशन',
                quality: '✨ गुणवत्ता: ISO 9001, CE प्रमाणित',
                applications: '⚙️ उद्योग: तेल और गैस, रसायन, फार्मास्युटिकल, बिजली, जल उपचार'
            },
            navGuide: {
                title: '🧭 प्रोडक्ट कैसे ढूंढे:',
                step1: '1️⃣ "Products" बटन पर क्लिक करें',
                step2: '2️⃣ मुख्य श्रेणियां देखें:',
                categories: '   • ट्यूब फिटिंग\n   • बॉल वाल्व\n   • पाइप वाल्व\n   • नीडल वाल्व\n   • मैनिफोल्ड वाल्व\n   • गेज एक्सेसरीज\n   • चेक वाल्व',
                step3: '3️⃣ किसी भी श्रेणी पर क्लिक करें',
                step4: '4️⃣ प्रोडक्ट पर क्लिक करके विवरण देखें',
                help: '💡 या मुझे बताएं कि आपको कौन सा प्रोडक्ट चाहिए!'
            },
            specificNav: {
                title: '🔍 {product} ढूंढने के लिए:',
                step1: '1️⃣ "Products" बटन पर क्लिक करें',
                step2: '2️⃣ **{category}** श्रेणी पर क्लिक करें',
                step3: '3️⃣ {category} में प्रोडक्ट देखें',
                step4: '4️⃣ **{product}** ढूंढें और क्लिक करें',
                direct: '⚡ क्या आपको सीधे {category} सेक्शन में ले जाऊं?'
            },
            productPrompt: '🔧 आपको कौन सी श्रेणी चाहिए?\n\n• ट्यूब फिटिंग\n• बॉल वाल्व\n• पाइप वाल्व\n• नीडल वाल्व\n• मैनिफोल्ड वाल्व\n• गेज एक्सेसरीज\n• चेक वाल्व',
            navigating: '🔍 {category} सेक्शन में ले जा रहा हूं...',
            needMoreHelp: '❓ और मदद चाहिए?',
            options: {
                guide: '🧭 नेविगेशन दिखाएं',
                specific: '🔍 खास प्रोडक्ट ढूंढें',
                contact: '📞 सपोर्ट से संपर्क करें'
            },
            searching: '🔍 आपकी जरूरत के प्रोडक्ट ढूंढ रहा हूं...',
            foundProducts: '✨ ये प्रोडक्ट आपके काम आ सकते हैं:',
            highPressureResponse: '🔧 **हाई प्रेशर प्रोडक्ट्स (6000 PSI):**\n\n• कंप्रेशन मेल कनेक्टर\n• कंप्रेशन यूनियन\n• हाई-प्रेशर नीडल वाल्व\n• 2-वाल्व मैनिफोल्ड\n• 3-वाल्व मैनिफोल्ड\n• इनलाइन स्प्रिंग चेक वाल्व\n• एंगल नीडल वाल्व\n• गेज एडाप्टर\n\nये सभी प्रोडक्ट 6000 PSI के लिए बने हैं।',
            buyingGuidance: '📝 **प्रोडक्ट कैसे खरीदें:**\n\nआप इन तरीकों से प्रोडक्ट खरीद सकते हैं:\n\n📧 **ईमेल:** satyamcontrols10@gmail.com पर इन्क्वायरी भेजें\n\n📞 **फोन:** +91 86000 85244 पर कॉल करें\n\n🌐 **वेबसाइट:** Contact पेज पर फॉर्म भरें\n\n💬 **चैट:** मुझसे बात करते रहें\n\nहमारी टीम 24 घंटे में जवाब देगी।',
            recommendationPrompt: '🔍 **बेहतर सुझाव के लिए बताएं:**\n\n• आपका एप्लीकेशन क्या है?\n• कितना प्रेशर चाहिए? (150 PSI, 1000 PSI, 6000 PSI)\n• कितना तापमान?\n• कौन सी सामग्री? (SS 316, Brass, Carbon Steel)\n\nमैं सबसे सही प्रोडक्ट सुझाऊंगा!',
            contactSupport: '📞 **सपोर्ट से संपर्क करें:**\n\nहमारी टीम आपकी मदद के लिए तैयार है!\n\n📧 ईमेल: satyamcontrols10@gmail.com\n📞 फोन: +91 86000 85244\n\nअपनी जरूरतें बताएं, हमारी टीम जवाब देगी।',
            productInfo: {
                title: '📋 प्रोडक्ट जानकारी',
                pressure: 'प्रेशर',
                temperature: 'तापमान',
                material: 'सामग्री',
                category: 'श्रेणी'
            }
        },
        mr: {
            welcome: '⚙️ सिस्टम सुरू होत आहे...\n🔄 सत्यम इंडस्ट्रियल असिस्टंट सुरू...\n✅ सिस्टम तयार\n\n🔧 नमस्कार! मी तुमचा सहाय्यक आहे. कृपया तुमची भाषा निवडा:',
            selectLang: '🔧 भाषा निवडा:',
            hi: '🇮🇳 हिन्दी',
            en: '🇬🇧 ENGLISH',
            mr: '🇮🇳 मराठी',
            kn: '🇮🇳 ಕನ್ನಡ',
            greeting: '👋 नमस्कार! मी तुमची कशी मदत करू शकतो?',
            help: '💬 मी यामध्ये मदत करू शकतो:\n• खास उत्पादने शोधणे\n• संपर्क माहिती\n• व्यवसाय वेळ\n• पत्ता आणि स्थान\n• दाब/तापमानानुसार सूचना\n• नेव्हिगेशन मार्गदर्शक\n\nफक्त सांगा!',
            needHelp: '😊 काय हवे आहे?',
            thankYou: '🙏 धन्यवाद! आणखी काही?',
            menu: '⚙️ कशी मदत करू?',
            contact: '📞 संपर्क',
            products: '🔧 उत्पादने',
            about: '🏭 आमच्याबद्दल',
            hours: '⏰ वेळ',
            address: '📍 पत्ता',
            guide: '🧭 मार्गदर्शक',
            typeHere: '⚙️ तुमचा प्रश्न लिहा...',
            send: 'पाठवा',
            contactInfo: {
                title: '📋 संपर्क माहिती',
                address: '🏭 युनिट क्रं 20, ग्राउंड फ्लोर\nवसुंधरा इंडस्ट्रियल इस्टेट\nकेटी पार्क, गोराल पाडा\nवसई (पूर्व), महाराष्ट्र 401208',
                phone: '📞 +91 86000 85244',
                email: '✉️ satyamcontrols10@gmail.com',
                hours: '⏰ सोम-शुक्र: सकाळी 9-संध्याकाळी 6 | शनि: सकाळी 9-दुपारी 2',
                map: '🗺️ गूगल मॅप्समध्ये उघडा'
            },
            aboutInfo: {
                title: '🏭 सत्यम कंट्रोल्स बद्दल',
                description: '2005 पासून औद्योगिक उत्पादनांचे अग्रगण्य उत्पादक.',
                products: '🔧 आमची उत्पादने:\n• ट्यूब फिटिंग - प्रिसिजन कनेक्शन\n• बॉल वाल्व - फ्लो कंट्रोल\n• पाइप वाल्व - इंडस्ट्रियल वाल्व\n• नीडल वाल्व - फाइन रेगुलेशन\n• मॅनिफोल्ड वाल्व - प्रेशर मॅनेजमेंट\n• गेज अॅक्सेसरीज - इंस्ट्रूमेंट प्रोटेक्शन\n• चेक वाल्व - बैकफ्लो प्रिवेंशन',
                quality: '✨ गुणवत्ता: ISO 9001, CE प्रमाणित',
                applications: '⚙️ उद्योग: तेल आणि वायू, रसायन, फार्मास्युटिकल, वीज, जल उपचार'
            },
            navGuide: {
                title: '🧭 उत्पादने कशी शोधायची:',
                step1: '1️⃣ "Products" बटनवर क्लिक करा',
                step2: '2️⃣ मुख्य श्रेणी पहा:',
                categories: '   • ट्यूब फिटिंग\n   • बॉल वाल्व\n   • पाइप वाल्व\n   • नीडल वाल्व\n   • मॅनिफोल्ड वाल्व\n   • गेज अॅक्सेसरीज\n   • चेक वाल्व',
                step3: '3️⃣ श्रेणीवर क्लिक करा',
                step4: '4️⃣ उत्पादनावर क्लिक करून तपशील पहा',
                help: '💡 किंवा मला सांगा कोणते उत्पादन हवे!'
            },
            specificNav: {
                title: '🔍 {product} शोधण्यासाठी:',
                step1: '1️⃣ "Products" बटनवर क्लिक करा',
                step2: '2️⃣ **{category}** श्रेणीवर क्लिक करा',
                step3: '3️⃣ {category} मध्ये उत्पादने पहा',
                step4: '4️⃣ **{product}** शोधा आणि क्लिक करा',
                direct: '⚡ सरळ {category} सेक्शनमध्ये जाऊ का?'
            },
            productPrompt: '🔧 कोणती श्रेणी पाहिजे?\n\n• ट्यूब फिटिंग\n• बॉल वाल्व\n• पाइप वाल्व\n• नीडल वाल्व\n• मॅनिफोल्ड वाल्व\n• गेज अॅक्सेसरीज\n• चेक वाल्व',
            navigating: '🔍 {category} सेक्शनमध्ये नेतोय...',
            needMoreHelp: '❓ आणखी मदत?',
            options: {
                guide: '🧭 मार्गदर्शक दाखवा',
                specific: '🔍 खास उत्पादन शोधा',
                contact: '📞 सपोर्टशी संपर्क'
            },
            searching: '🔍 तुमच्या गरजेची उत्पादने शोधतोय...',
            foundProducts: '✨ ही उत्पादने तुमच्यासाठी उपयुक्त ठरू शकतात:',
            highPressureResponse: '🔧 **हाय प्रेशर उत्पादने (6000 PSI):**\n\n• कंप्रेशन मेल कनेक्टर\n• कंप्रेशन यूनियन\n• हाय-प्रेशर नीडल वाल्व\n• 2-वाल्व मॅनिफोल्ड\n• 3-वाल्व मॅनिफोल्ड\n• इनलाइन स्प्रिंग चेक वाल्व\n• एंगल नीडल वाल्व\n• गेज अॅडाप्टर\n\nहे सर्व 6000 PSI साठी योग्य आहेत।',
            buyingGuidance: '📝 **उत्पादने कशी खरेदी करावीत:**\n\nतुम्ही अशा प्रकारे खरेदी करू शकता:\n\n📧 **ईमेल:** satyamcontrols10@gmail.com वर चौकशी पाठवा\n\n📞 **फोन:** +91 86000 85244 वर कॉल करा\n\n🌐 **वेबसाइट:** Contact पेजवर फॉर्म भरा\n\n💬 **चॅट:** माझ्याशी बोलत रहा\n\nआमची टीम २४ तासांत उत्तर देईल।',
            recommendationPrompt: '🔍 **चांगल्या सूचनेसाठी सांगा:**\n\n• तुमचा एप्लीकेशन काय आहे?\n• किती प्रेशर हवे? (150 PSI, 1000 PSI, 6000 PSI)\n• किती तापमान?\n• कोणती सामग्री? (SS 316, Brass, Carbon Steel)\n\nमी सर्वोत्तम उत्पादन सुचवेन!',
            contactSupport: '📞 **सपोर्टशी संपर्क:**\n\nआमची टीम मदतीसाठी सज्ज!\n\n📧 ईमेल: satyamcontrols10@gmail.com\n📞 फोन: +91 86000 85244\n\nतुमच्या गरजा सांगा, आमची टीम उत्तर देईल।',
            productInfo: {
                title: '📋 उत्पादन माहिती',
                pressure: 'प्रेशर',
                temperature: 'तापमान',
                material: 'सामग्री',
                category: 'श्रेणी'
            }
        },
        kn: {
            welcome: '⚙️ ಸಿಸ್ಟಮ್ ಬೂಟ್ ಆಗುತ್ತಿದೆ...\n🔄 ಸತ್ಯಮ್ ಇಂಡಸ್ಟ್ರಿಯಲ್ ಅಸಿಸ್ಟಂಟ್ ಆರಂಭ...\n✅ ಸಿಸ್ಟಮ್ ಸಿದ್ಧ\n\n🔧 ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸಹಾಯಕ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
            selectLang: '🔧 ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ:',
            hi: '🇮🇳 हिन्दी',
            en: '🇬🇧 ENGLISH',
            mr: '🇮🇳 मराठी',
            kn: '🇮🇳 ಕನ್ನಡ',
            greeting: '👋 ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
            help: '💬 ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n• ನಿರ್ದಿಷ್ಟ ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕುವುದು\n• ಸಂಪರ್ಕ ಮಾಹಿತಿ\n• ವ್ಯವಹಾರ ಸಮಯ\n• ವಿಳಾಸ ಮತ್ತು ಸ್ಥಳ\n• ಒತ್ತಡ/ತಾಪಮಾನದ ಆಧಾರದಲ್ಲಿ ಸೂಚನೆಗಳು\n• ನ್ಯಾವಿಗೇಷನ್ ಮಾರ್ಗದರ್ಶಿ\n\nದಯವಿಟ್ಟು ಹೇಳಿ!',
            needHelp: '😊 ಏನು ಬೇಕು?',
            thankYou: '🙏 ಧನ್ಯವಾದಗಳು! ಬೇರೆ ಏನಾದರೂ?',
            menu: '⚙️ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
            contact: '📞 ಸಂಪರ್ಕ ಮಾಹಿತಿ',
            products: '🔧 ಉತ್ಪನ್ನಗಳು',
            about: '🏭 ನಮ್ಮ ಬಗ್ಗೆ',
            hours: '⏰ ವ್ಯವಹಾರ ಸಮಯ',
            address: '📍 ವಿಳಾಸ',
            guide: '🧭 ಮಾರ್ಗದರ್ಶಿ',
            typeHere: '⚙️ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ...',
            send: 'ಕಳುಹಿಸು',
            contactInfo: {
                title: '📋 ಸಂಪರ್ಕ ಮಾಹಿತಿ',
                address: '🏭 ಯುನಿಟ್ ನಂ 20, ಗ್ರೌಂಡ್ ಫ್ಲೋರ್\nವಸುಂಧರಾ ಇಂಡಸ್ಟ್ರಿಯಲ್ ಎಸ್ಟೇಟ್\nಕೆಟಿ ಪಾರ್ಕ್, ಗೋರಾಲ್ ಪಾಡಾ\nವಸಾಯ್ (ಪೂರ್ವ), ಮಹಾರಾಷ್ಟ್ರ 401208',
                phone: '📞 +91 86000 85244',
                email: '✉️ satyamcontrols10@gmail.com',
                hours: '⏰ ಸೋಮ-ಶುಕ್ರ: ಬೆಳಿಗ್ಗೆ 9-ಸಂಜೆ 6 | ಶನಿ: ಬೆಳಿಗ್ಗೆ 9-ಮಧ್ಯಾಹ್ನ 2',
                map: '🗺️ ಗೂಗಲ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ'
            },
            aboutInfo: {
                title: '🏭 ಸತ್ಯಮ್ ಕಂಟ್ರೋಲ್ಸ್ ಬಗ್ಗೆ',
                description: '2005 ರಿಂದ ಕೈಗಾರಿಕಾ ಉತ್ಪನ್ನಗಳ ಪ್ರಮುಖ ತಯಾರಕ.',
                products: '🔧 ನಮ್ಮ ಉತ್ಪನ್ನಗಳು:\n• ಟ್ಯೂಬ್ ಫಿಟ್ಟಿಂಗ್ - ಪ್ರಿಸಿಷನ್ ಕನೆಕ್ಷನ್\n• ಬಾಲ್ ವಾಲ್ವ್ - ಫ್ಲೋ ಕಂಟ್ರೋಲ್\n• ಪೈಪ್ ವಾಲ್ವ್ - ಇಂಡಸ್ಟ್ರಿಯಲ್ ವಾಲ್ವ್\n• ನೀಡಲ್ ವಾಲ್ವ್ - ಫೈನ್ ರೆಗ್ಯುಲೇಷನ್\n• ಮ್ಯಾನಿಫೋಲ್ಡ್ ವಾಲ್ವ್ - ಪ್ರೆಶರ್ ಮ್ಯಾನೇಜ್ಮೆಂಟ್\n• ಗೇಜ್ ಅಕ್ಸೆಸರೀಸ್ - ಇನ್‌ಸ್ಟ್ರುಮೆಂಟ್ ಪ್ರೊಟೆಕ್ಷನ್\n• ಚೆಕ್ ವಾಲ್ವ್ - ಬ್ಯಾಕ್ಫ್ಲೋ ಪ್ರಿವೆನ್ಷನ್',
                quality: '✨ ಗುಣಮಟ್ಟ: ISO 9001, CE ಪ್ರಮಾಣೀಕೃತ',
                applications: '⚙️ ಕೈಗಾರಿಕೆಗಳು: ತೈಲ ಮತ್ತು ಅನಿಲ, ರಾಸಾಯನಿಕ, ಔಷಧೀಯ, ವಿದ್ಯುತ್, ನೀರಿನ ಸಂಸ್ಕರಣೆ'
            }
        }
    };

    // ============ COMPREHENSIVE PRODUCT NAVIGATION WITH KEYWORDS ============
    const PRODUCT_NAVIGATION = {
        // Tube Fittings
        "compression male connector": {
            name: "Compression Male Connector",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            keywords: [
                'compression male', 'male connector', 'compression male connector',
                'कंप्रेशन मेल', 'मेल कनेक्टर', 'male vala', 'male wala',
                'compression male connctor', 'male fitting'
            ]
        },
        "compression hose barb adapter": {
            name: "Compression Hose Barb Adapter",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            keywords: [
                'hose barb', 'barb adapter', 'hose connector', 'barb fitting',
                'होज बार्ब', 'बार्ब एडाप्टर', 'hose barb adapter', 'barb vala'
            ]
        },
        "press-fit 90° elbow": {
            name: "Press-Fit 90° Elbow",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            keywords: [
                'press fit', '90 elbow', 'elbow fitting', 'pressfit',
                'प्रेस फिट', 'मोड़', 'एल्बो', '90 degree', 'press fit elbow'
            ]
        },
        "compression union": {
            name: "Compression Union",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            keywords: [
                'compression union', 'tube union', 'union connector', 'union fitting',
                'कंप्रेशन यूनियन', 'यूनियन', 'union', 'compression union'
            ]
        },
        "threaded female equal tee": {
            name: "Threaded Female Equal Tee",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            keywords: [
                'female tee', 'equal tee', 'threaded tee', 'थ्रेडेड टी'
            ]
        },
        "compression reducing union": {
            name: "Compression Reducing Union",
            category: "tube-fittings",
            categoryDisplay: "Tube Fittings",
            keywords: [
                'reducing union', 'compression reducing', 'रेड्यूसिंग यूनियन'
            ]
        },

        // Ball Valves
        "3-piece ball valve": {
            name: "3-Piece Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            keywords: [
                '3-piece ball', '3 piece ball', 'three piece ball', 'ball valve 3',
                'बॉल वाल्व 3', 'ball valve', 'बॉल वाल्व', '3 pc ball valve'
            ]
        },
        "true union ball valve": {
            name: "True Union Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            keywords: [
                'true union', 'pvc ball valve', 'plastic ball valve',
                'पीवीसी बॉल', 'union ball', 'true union ball'
            ]
        },
        "3-piece flanged ball valve": {
            name: "3-Piece Flanged Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            keywords: [
                'flanged ball', '3-piece flanged', 'फ्लेंज्ड बॉल'
            ]
        },
        "2-piece ball valve": {
            name: "2-Piece Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            keywords: [
                '2-piece ball', '2 piece ball', 'two piece ball',
                '2 pc ball valve', 'two piece ball valv'
            ]
        },
        "full port ball valve": {
            name: "Full Port Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            keywords: [
                'full port', 'full bore', 'फुल पोर्ट'
            ]
        },
        "3-way ball valve": {
            name: "3-Way Ball Valve",
            category: "ball-valves",
            categoryDisplay: "Ball Valves",
            keywords: [
                '3-way ball', '3 way ball', 'three way ball', 'multi-port ball'
            ]
        },

        // Needle Valves
        "high pressure needle valve": {
            name: "High-Pressure Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            keywords: [
                'high pressure needle', 'needle valve 6000', 'हाई प्रेशर नीडल',
                'needle valve', 'नीडल वाल्व', 'needal valve', 'nidel valve'
            ]
        },
        "angle needle valve": {
            name: "Angle Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            keywords: [
                'angle needle', '90 degree needle', 'एंगल नीडल', 'angle valve'
            ]
        },
        "compression needle valve": {
            name: "Compression Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            keywords: [
                'compression needle', 'कंप्रेशन नीडल'
            ]
        },
        "panel mount needle valve": {
            name: "Panel Mount Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            keywords: [
                'panel mount needle', 'पैनल माउंट'
            ]
        },
        "integral bonnet needle valve": {
            name: "Integral Bonnet Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            keywords: [
                'integral bonnet', 'इंटीग्रल बोनट'
            ]
        },
        "brass needle valve": {
            name: "Brass Needle Valve",
            category: "needle-valves",
            categoryDisplay: "Needle Valves",
            keywords: [
                'brass needle', 'पीतल नीडल'
            ]
        },

        // Manifold Valves
        "2-valve manifold": {
            name: "2-Valve Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            keywords: [
                '2-valve', '2 valve', 'two valve', '2 way manifold', 'मैनिफोल्ड 2'
            ]
        },
        "3-valve manifold": {
            name: "3-Valve Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            keywords: [
                '3-valve', '3 valve', 'three valve', '3 way manifold'
            ]
        },
        "5-valve manifold": {
            name: "5-Valve Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            keywords: [
                '5-valve', '5 valve', 'five valve'
            ]
        },
        "monoflange manifold": {
            name: "Monoflange Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            keywords: [
                'monoflange', 'मोनोफ्लेंज'
            ]
        },
        "double block and bleed manifold": {
            name: "Double Block and Bleed Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            keywords: [
                'double block', 'dbb', 'डबल ब्लॉक'
            ]
        },
        "coplanar manifold": {
            name: "Coplanar Manifold",
            category: "manifold-valves",
            categoryDisplay: "Manifold Valves",
            keywords: [
                'coplanar', 'कोप्लानर'
            ]
        },

        // CHECK VALVES - COMPLETE WITH ALL KEYWORDS
        "ball check valve": {
            name: "Ball Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            keywords: [
                'ball check', 'ball check valve', 'check valve ball',
                'बॉल चेक', 'चेक वाल्व बॉल', 'ball type check', 'ball check valv'
            ]
        },
        "inline spring check valve": {
            name: "Inline Spring Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            keywords: [
                'inline spring', 'spring check', 'inline spring check',
                'स्प्रिंग चेक', 'inline check', 'spring loaded check'
            ]
        },
        "dual plate check valve": {
            name: "Dual Plate Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            keywords: [
                'dual plate', 'dual plate check', 'डुअल प्लेट'
            ]
        },
        "swing check valve": {
            name: "Swing Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            keywords: [
                'swing check', 'swing check valve', 'स्विंग चेक'
            ]
        },
        "lift check valve": {
            name: "Lift Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            keywords: [
                'lift check', 'lift check valve', 'लिफ्ट चेक'
            ]
        },
        "wafer check valve": {
            name: "Wafer Check Valve",
            category: "check-valves",
            categoryDisplay: "Check Valves",
            keywords: [
                'wafer check', 'wafer check valve', 'वेफर चेक'
            ]
        },

        // Gauge Accessories
        "diaphragm seal": {
            name: "Diaphragm Seal",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            keywords: [
                'diaphragm seal', 'डायाफ्राम सील', 'seal', 'diaphram'
            ]
        },
        "pigtail siphon": {
            name: "Pigtail Siphon",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            keywords: [
                'pigtail', 'siphon', 'pigtail siphon', 'pig tail', 'steam siphon'
            ]
        },
        "gauge cock": {
            name: "Gauge Cock",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            keywords: [
                'gauge cock', 'गेज कॉक'
            ]
        },
        "gauge adapter": {
            name: "Gauge Adapter",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            keywords: [
                'gauge adapter', 'गेज एडाप्टर'
            ]
        },
        "snubber": {
            name: "Snubber",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            keywords: [
                'snubber', 'स्नबर'
            ]
        },
        "pressure gauge": {
            name: "Pressure Gauge",
            category: "gauge-accessories",
            categoryDisplay: "Gauge Accessories",
            keywords: [
                'pressure gauge', 'gauge', 'प्रेशर गेज', 'गेज', 'gage', 'guage'
            ]
        }
    };

    // ============ CUTE ROBOT STYLES ============
    const styles = `
        .satyam-chat-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            font-family: 'Courier New', 'Segoe UI', monospace;
        }
        
        /* ===== CUTE INDUSTRIAL ROBOT BUTTON ===== */
        .satyam-chat-button {
            width: 75px;
            height: 75px;
            border-radius: 50%;
            background: linear-gradient(145deg, #4a4e49 0%, #2d2f2b 100%);
            cursor: pointer;
            box-shadow: 0 0 0 3px #C1D1CF, 0 10px 25px rgba(0,0,0,0.5);
            transition: all 0.3s ease;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: industrialPulse 2s infinite;
            border: 2px solid #ffd700;
        }
        
        @keyframes industrialPulse {
            0% { box-shadow: 0 0 0 3px #C1D1CF, 0 10px 25px rgba(0,0,0,0.5); }
            50% { box-shadow: 0 0 0 5px #ffd700, 0 15px 35px rgba(0,0,0,0.6); }
            100% { box-shadow: 0 0 0 3px #C1D1CF, 0 10px 25px rgba(0,0,0,0.5); }
        }
        
        .satyam-chat-button:hover {
            transform: scale(1.1) rotate(10deg);
        }
        
        .robot-face {
            width: 60px;
            height: 60px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .nut {
            position: absolute;
            width: 12px;
            height: 12px;
            background: #C1D1CF;
            border-radius: 50%;
            border: 2px solid #ffd700;
            z-index: 2;
        }
        
        .nut1 { top: 5px; left: 5px; animation: spin 3s linear infinite; }
        .nut2 { bottom: 5px; right: 5px; animation: spin 4s linear infinite reverse; }
        .nut3 { top: 45px; left: 40px; animation: spin 5s linear infinite; }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .nut::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 3px;
            background: #C1D1CF;
            top: 4px;
            left: -4px;
            border-radius: 2px;
        }
        
        .nut::before {
            content: '';
            position: absolute;
            width: 3px;
            height: 16px;
            background: #C1D1CF;
            left: 4px;
            top: -4px;
            border-radius: 2px;
        }
        
        .robot-svg {
            width: 55px;
            height: 55px;
            position: relative;
            z-index: 3;
        }
        
        .robot-eyes {
            animation: cuteBlink 3s ease-in-out infinite;
        }
        
        @keyframes cuteBlink {
            0%, 48%, 52%, 100% { r: 8; }
            50% { r: 2; }
        }
        
        .robot-mouth {
            animation: cuteSmile 2s ease-in-out infinite;
        }
        
        @keyframes cuteSmile {
            0%, 100% { d: path("M30 65 Q50 75, 70 65"); }
            50% { d: path("M30 65 Q50 80, 70 65"); }
        }
        
        /* ===== CHAT WINDOW ===== */
        .satyam-chat-window {
            position: absolute;
            bottom: 90px;
            right: 0;
            width: 400px;
            height: 600px;
            background: #F9F7F2;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 3px solid #C1D1CF;
            font-family: 'Segoe UI', sans-serif;
        }
        
        .satyam-chat-window.active {
            display: flex;
            animation: expandWindow 0.3s ease;
        }
        
        @keyframes expandWindow {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .status-bar {
            background: #171F22;
            color: #0f0;
            padding: 8px 12px;
            font-size: 11px;
            border-bottom: 2px solid #C1D1CF;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .status-text {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .lang-selector {
            background: white;
            padding: 20px;
            border-bottom: 2px solid #C1D1CF;
        }
        
        .lang-title {
            color: #171F22;
            font-size: 14px;
            margin-bottom: 15px;
            font-weight: 600;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .lang-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        
        .lang-btn {
            background: #F0F4F3;
            border: 1px solid #C1D1CF;
            color: #171F22;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
            text-transform: uppercase;
        }
        
        .lang-btn:hover, .lang-btn.active {
            background: #2d7a9b;
            color: white;
            border-color: #2d7a9b;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(45,122,155,0.2);
        }
        
        .chat-header {
            background: white;
            padding: 12px 15px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 2px solid #C1D1CF;
        }
        
        .header-avatar {
            width: 40px;
            height: 40px;
            background: #2d7a9b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            color: white;
            border: 2px solid #ffd700;
        }
        
        .header-text {
            flex: 1;
        }
        
        .header-text h3 {
            margin: 0;
            font-size: 15px;
            color: #171F22;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .header-text p {
            margin: 2px 0 0;
            font-size: 10px;
            color: #2d7a9b;
        }
        
        .close-chat {
            cursor: pointer;
            font-size: 18px;
            color: #636467;
            transition: all 0.3s;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .close-chat:hover {
            background: #F0F4F3;
            color: #2d7a9b;
        }
        
        .chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #F9F7F2;
            scrollbar-width: thin;
            scrollbar-color: #C1D1CF #F0F4F3;
        }
        
        .chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
            background: #F0F4F3;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
            background: #C1D1CF;
            border-radius: 10px;
        }
        
        .message {
            margin-bottom: 15px;
            display: flex;
            animation: messageSlide 0.3s ease;
        }
        
        @keyframes messageSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .message.bot {
            justify-content: flex-start;
        }
        
        .message.user {
            justify-content: flex-end;
        }
        
        .message-content {
            max-width: 85%;
            padding: 12px 15px;
            border-radius: 15px;
            font-size: 13px;
            line-height: 1.5;
            white-space: pre-line;
        }
        
        .bot .message-content {
            background: white;
            color: #171F22;
            border-bottom-left-radius: 5px;
            border: 1px solid #C1D1CF;
            border-left: 3px solid #2d7a9b;
        }
        
        .user .message-content {
            background: #2d7a9b;
            color: white;
            border-bottom-right-radius: 5px;
        }
        
        .quick-options {
            padding: 12px;
            background: white;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            border-top: 1px solid #C1D1CF;
            border-bottom: 1px solid #C1D1CF;
        }
        
        .quick-option {
            background: #F0F4F3;
            border: 1px solid #C1D1CF;
            color: #171F22;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            flex: 1 1 auto;
        }
        
        .quick-option:hover {
            background: #2d7a9b;
            color: white;
            border-color: #2d7a9b;
            transform: translateY(-2px);
        }
        
        .chat-input-area {
            padding: 12px;
            background: white;
            display: flex;
            gap: 8px;
            border-top: 2px solid #C1D1CF;
        }
        
        .chat-input-area input {
            flex: 1;
            padding: 10px 15px;
            background: #F0F4F3;
            border: 1px solid #C1D1CF;
            color: #171F22;
            border-radius: 25px;
            outline: none;
            font-size: 13px;
            transition: all 0.3s ease;
        }
        
        .chat-input-area input:focus {
            border-color: #2d7a9b;
            box-shadow: 0 0 0 2px rgba(45,122,155,0.1);
        }
        
        .chat-input-area input::placeholder {
            color: #9BA5A9;
        }
        
        .chat-input-area button {
            width: 40px;
            height: 40px;
            background: #2d7a9b;
            border: none;
            color: white;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-input-area button:hover {
            background: #1f5a73;
            transform: scale(1.1);
        }
        
        .typing-indicator {
            padding: 12px 15px;
            background: white;
            border-radius: 15px;
            border-bottom-left-radius: 5px;
            display: inline-block;
            border: 1px solid #C1D1CF;
            border-left: 3px solid #2d7a9b;
        }
        
        .typing-indicator span {
            width: 8px;
            height: 8px;
            background: #2d7a9b;
            border-radius: 50%;
            display: inline-block;
            margin: 0 2px;
            animation: typing 1.4s infinite;
        }
        
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-8px); }
        }
        
        .help-options {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        
        .help-option {
            background: white;
            border: 1px solid #2d7a9b;
            color: #2d7a9b;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            font-weight: 500;
        }
        
        .help-option:hover {
            background: #2d7a9b;
            color: white;
        }
        
        .map-link {
            color: #2d7a9b;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            margin-top: 5px;
        }
        
        .map-link:hover {
            text-decoration: underline;
        }
    `;

    // ============ MAIN CHATBOT CLASS ============
    class SatyamCuteRobot {
        constructor() {
            this.currentLang = 'en';
            this.languageSelected = false;
            this.isTyping = false;
            this.greeted = false;
            this.conversationState = {
                lastQuery: '',
                lastResponse: '',
                expectingFollowUp: false,
                currentProduct: null
            };
            this.init();
        }

        init() {
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);

            const chatbotHTML = `
                <div class="satyam-chat-container">
                    <div class="satyam-chat-button" id="chatbot-toggle">
                        <div class="robot-face">
                            <div class="nut nut1"></div>
                            <div class="nut nut2"></div>
                            <div class="nut nut3"></div>
                            <svg class="robot-svg" viewBox="0 0 100 100">
                                <rect x="15" y="20" width="70" height="60" rx="15" fill="#2d7a9b" stroke="#ffd700" stroke-width="3"/>
                                <circle class="robot-eyes" cx="35" cy="45" r="8" fill="white" stroke="#ffd700" stroke-width="2"/>
                                <circle class="robot-eyes" cx="65" cy="45" r="8" fill="white" stroke="#ffd700" stroke-width="2"/>
                                <circle cx="35" cy="45" r="4" fill="#0f0"/>
                                <circle cx="65" cy="45" r="4" fill="#0f0"/>
                                <path class="robot-mouth" d="M30 70 Q50 80, 70 70" stroke="#ffd700" stroke-width="3" fill="none"/>
                                <circle cx="25" cy="60" r="6" fill="#ffb6c1" opacity="0.6"/>
                                <circle cx="75" cy="60" r="6" fill="#ffb6c1" opacity="0.6"/>
                                <circle cx="50" cy="15" r="6" fill="#ffd700" stroke="#ffd700" stroke-width="2"/>
                                <line x1="50" y1="20" x2="50" y2="30" stroke="#ffd700" stroke-width="3"/>
                            </svg>
                        </div>
                    </div>

                    <div class="satyam-chat-window" id="chatbot-window">
                        <div class="status-bar">
                            <span class="status-text">▶ SYSTEM ONLINE</span> | SATYAM v2.0
                        </div>

                        <div class="lang-selector" id="lang-selector">
                            <div class="lang-title">🔧 SELECT LANGUAGE</div>
                            <div class="lang-buttons">
                                <button class="lang-btn" data-lang="en">🇬🇧 ENGLISH</button>
                                <button class="lang-btn" data-lang="hi">🇮🇳 हिन्दी</button>
                                <button class="lang-btn" data-lang="mr">🇮🇳 मराठी</button>
                                <button class="lang-btn" data-lang="kn">🇮🇳 ಕನ್ನಡ</button>
                            </div>
                        </div>

                        <div class="chat-header" style="display: none;" id="chat-header">
                            <div class="header-avatar">⚙️</div>
                            <div class="header-text">
                                <h3 id="bot-name">SATYAM</h3>
                                <p>🟢 ONLINE</p>
                            </div>
                            <div class="close-chat" id="close-chat">✕</div>
                        </div>

                        <div class="chat-messages" id="chat-messages"></div>
                        <div class="quick-options" id="quick-options" style="display: none;"></div>

                        <div class="chat-input-area" id="chat-input-area" style="display: none;">
                            <input type="text" id="chat-input" placeholder="⚙️ TYPE YOUR QUERY...">
                            <button id="send-message">➤</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', chatbotHTML);
            this.bindEvents();
        }

        bindEvents() {
            document.getElementById('chatbot-toggle').addEventListener('click', () => {
                document.getElementById('chatbot-window').classList.toggle('active');
            });

            document.getElementById('close-chat').addEventListener('click', () => {
                document.getElementById('chatbot-window').classList.remove('active');
            });

            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selectedLang = e.target.dataset.lang;
                    this.selectLanguage(selectedLang);
                });
            });

            document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
            document.getElementById('chat-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        selectLanguage(lang) {
            this.currentLang = lang;
            this.languageSelected = true;
            this.greeted = false;
            
            document.getElementById('lang-selector').style.display = 'none';
            document.getElementById('chat-header').style.display = 'flex';
            document.getElementById('quick-options').style.display = 'flex';
            document.getElementById('chat-input-area').style.display = 'flex';
            
            document.getElementById('bot-name').textContent = `SATYAM ${lang.toUpperCase()}`;
            document.getElementById('chat-input').placeholder = TRANSLATIONS[lang].typeHere;
            
            this.addMessage(TRANSLATIONS[lang].welcome, 'bot');
            this.showMenuOptions();
        }

        showMenuOptions() {
            const t = TRANSLATIONS[this.currentLang];
            const options = [
                { text: t.products, action: 'products' },
                { text: t.contact, action: 'contact' },
                { text: t.guide, action: 'guide' },
                { text: t.hours, action: 'hours' },
                { text: t.address, action: 'address' }
            ];

            document.getElementById('quick-options').innerHTML = options.map(opt => 
                `<button class="quick-option" data-action="${opt.action}">${opt.text}</button>`
            ).join('');

            document.querySelectorAll('.quick-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleQuickAction(e.target.dataset.action);
                });
            });
        }

        handleQuickAction(action) {
            const t = TRANSLATIONS[this.currentLang];
            
            switch(action) {
                case 'contact':
                    this.addMessage(
                        `${t.contactInfo.title}\n\n` +
                        `${t.contactInfo.address}\n\n` +
                        `${t.contactInfo.phone}\n` +
                        `${t.contactInfo.email}\n\n` +
                        `${t.contactInfo.hours}\n\n` +
                        `<a href="https://maps.google.com/?q=19.4178207,72.8368597" target="_blank" class="map-link">📍 ${t.contactInfo.map}</a>`, 
                        'bot'
                    );
                    break;
                    
                case 'address':
                    this.addMessage(
                        `${t.contactInfo.address}\n\n` +
                        `<a href="https://maps.google.com/?q=19.4178207,72.8368597" target="_blank" class="map-link">📍 ${t.contactInfo.map}</a>`, 
                        'bot'
                    );
                    break;
                    
                case 'hours':
                    this.addMessage(t.contactInfo.hours, 'bot');
                    break;
                    
                case 'guide':
                    this.addMessage(
                        `${t.navGuide.title}\n\n` +
                        `${t.navGuide.step1}\n` +
                        `${t.navGuide.step2}\n` +
                        `${t.navGuide.categories}\n` +
                        `${t.navGuide.step3}\n` +
                        `${t.navGuide.step4}\n\n` +
                        `${t.navGuide.help}`,
                        'bot'
                    );
                    break;
                    
                case 'products':
                    this.addMessage(t.productPrompt, 'bot');
                    break;
            }
        }

        sendMessage() {
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            
            if (!message || !this.languageSelected) return;
            
            this.addMessage(message, 'user');
            input.value = '';
            
            this.processUserMessage(message);
        }

        // Smart text matching for ANY language
        smartMatch(text, patterns) {
            const lowerText = text.toLowerCase();
            
            for (let pattern of patterns) {
                const lowerPattern = pattern.toLowerCase();
                
                // Direct match
                if (lowerText.includes(lowerPattern)) return true;
                
                // Remove vowels for fuzzy matching (handles spelling mistakes)
                const simplifiedText = lowerText.replace(/[aeiou]/g, '');
                const simplifiedPattern = lowerPattern.replace(/[aeiou]/g, '');
                if (simplifiedText.includes(simplifiedPattern)) return true;
            }
            return false;
        }

        // Find ANY product in database
        findProduct(text) {
            const lowerText = text.toLowerCase();
            
            // SPECIAL CASE: Check for "check valve" specifically
            if (lowerText.includes('check valve') || lowerText.includes('check valv') || 
                lowerText.includes('चेक वाल्व') || lowerText.includes('चेक')) {
                // Return the first check valve as default
                return PRODUCT_NAVIGATION["ball check valve"];
            }
            
            // Check all products
            for (let [key, product] of Object.entries(PRODUCT_NAVIGATION)) {
                for (let keyword of product.keywords) {
                    if (this.smartMatch(lowerText, [keyword])) {
                        return product;
                    }
                }
            }
            return null;
        }

        // Check if query is about buying
        isBuyingQuery(text) {
            const lowerText = text.toLowerCase();
            const buyKeywords = [
                'buy', 'purchase', 'order', 'खरीद', 'खरेदी', 'ಖರೀದಿ',
                'price', 'cost', 'quote', 'कीमत', 'किंमत', 'how to get'
            ];
            return buyKeywords.some(k => lowerText.includes(k));
        }

        // Check if query is about recommendation
        isRecommendationQuery(text) {
            const lowerText = text.toLowerCase();
            const recommendKeywords = [
                'recommend', 'suggest', 'suitable', 'best', 'सुझाव', 'सूचना',
                'which one', 'कौन सा', 'कोणते', 'चाहिए', 'ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ'
            ];
            return recommendKeywords.some(k => lowerText.includes(k));
        }

        // Check if query is about high pressure
        isHighPressureQuery(text) {
            const lowerText = text.toLowerCase();
            const pressureKeywords = [
                'high pressure', '6000 psi', 'हाई प्रेशर', 'हाय प्रेशर',
                'दबाव', 'प्रेशर', 'दाब', 'ಒತ್ತಡ'
            ];
            return pressureKeywords.some(k => lowerText.includes(k));
        }

        // Check if query is about contact
        isContactQuery(text) {
            const lowerText = text.toLowerCase();
            const contactKeywords = [
                'contact', 'phone', 'call', 'email', 'संपर्क', 'फोन',
                'number', 'नंबर', 'कॉल', 'ಕಾಲ್'
            ];
            return contactKeywords.some(k => lowerText.includes(k));
        }

        // Check if query is about address
        isAddressQuery(text) {
            const lowerText = text.toLowerCase();
            const addressKeywords = [
                'address', 'location', 'where', 'पता', 'विळास', 'ವಿಳಾಸ',
                'kahan', 'कहां', 'जगह'
            ];
            // Don't match if it contains product keywords
            if (lowerText.includes('valve') || lowerText.includes('manifold') || 
                lowerText.includes('fitting') || lowerText.includes('union') ||
                lowerText.includes('gauge') || lowerText.includes('check')) {
                return false;
            }
            return addressKeywords.some(k => lowerText.includes(k));
        }

        // Check if query is about hours
        isHoursQuery(text) {
            const lowerText = text.toLowerCase();
            const hoursKeywords = [
                'hour', 'time', 'open', 'समय', 'वेळ', 'ಸಮಯ',
                'kitne baje', 'कितने बजे', 'कधी'
            ];
            return hoursKeywords.some(k => lowerText.includes(k));
        }

        // Check if query is a greeting
        isGreeting(text) {
            const lowerText = text.toLowerCase().trim();
            const greetings = [
                'hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'हाय',
                'kem cho', 'kaise ho', 'कैसे हो', 'केम छो'
            ];
            return greetings.includes(lowerText) || 
                   lowerText === 'hi' || lowerText === 'hello' || lowerText === 'hey';
        }

        // Show product navigation
        showProductNavigation(product) {
            const t = TRANSLATIONS[this.currentLang];
            
            const response = 
                `${t.specificNav.title.replace('{product}', product.name)}\n\n` +
                `📍 ${t.specificNav.step1}\n` +
                `📍 ${t.specificNav.step2.replace('{category}', `**${product.categoryDisplay}**`)}\n` +
                `📍 ${t.specificNav.step3.replace('{category}', product.categoryDisplay)}\n` +
                `📍 ${t.specificNav.step4.replace('{product}', `**${product.name}**`)}\n\n` +
                `⚡ ${t.specificNav.direct.replace('{category}', product.categoryDisplay)}`;
            
            this.addMessage(response, 'bot');
            
            // Add buttons
            setTimeout(() => {
                const messagesDiv = document.getElementById('chat-messages');
                const buttonDiv = document.createElement('div');
                buttonDiv.className = 'message bot';
                buttonDiv.innerHTML = `
                    <div class="help-options">
                        <button class="help-option" onclick="window.location.href='view-category.html?cat=${product.category}'">
                            🔧 Go to ${product.categoryDisplay}
                        </button>
                        <button class="help-option" id="need-help-${Date.now()}">
                            ❓ ${t.needMoreHelp}
                        </button>
                        <button class="help-option" id="need-recommend-${Date.now()}">
                            🔍 ${t.options.specific}
                        </button>
                    </div>
                `;
                messagesDiv.appendChild(buttonDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                
                document.getElementById(`need-help-${Date.now()}`)?.addEventListener('click', () => {
                    this.showHelpMenu();
                });
                
                document.getElementById(`need-recommend-${Date.now()}`)?.addEventListener('click', () => {
                    this.addMessage(t.recommendationPrompt, 'bot');
                });
            }, 500);
        }

        // Show help menu
        showHelpMenu() {
            const t = TRANSLATIONS[this.currentLang];
            const buttons = `
                <div class="help-options">
                    <button class="help-option" id="help-buy">🛒 How to Buy</button>
                    <button class="help-option" id="help-recommend">🔍 ${t.options.specific}</button>
                    <button class="help-option" id="help-contact">📞 ${t.options.contact}</button>
                    <button class="help-option" id="help-guide">🧭 ${t.options.guide}</button>
                </div>
            `;
            
            this.addMessage(t.needMoreHelp, 'bot');
            
            const messagesDiv = document.getElementById('chat-messages');
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'message bot';
            buttonDiv.innerHTML = buttons;
            messagesDiv.appendChild(buttonDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            
            setTimeout(() => {
                document.getElementById('help-buy')?.addEventListener('click', () => {
                    this.addMessage(t.buyingGuidance, 'bot');
                });
                document.getElementById('help-recommend')?.addEventListener('click', () => {
                    this.addMessage(t.recommendationPrompt, 'bot');
                });
                document.getElementById('help-contact')?.addEventListener('click', () => {
                    this.addMessage(t.contactSupport, 'bot');
                });
                document.getElementById('help-guide')?.addEventListener('click', () => {
                    this.handleQuickAction('guide');
                });
            }, 100);
        }

        processUserMessage(message) {
            const lowerMsg = message.toLowerCase().trim();
            const t = TRANSLATIONS[this.currentLang];
            
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.hideTypingIndicator();
                
                // SPECIAL CASE: Check for CHECK VALVE first
                if (lowerMsg.includes('check valve') || lowerMsg.includes('चेक वाल्व')) {
                    const product = PRODUCT_NAVIGATION["ball check valve"];
                    this.showProductNavigation(product);
                    return;
                }
                
                // 1. Check for any product
                const product = this.findProduct(lowerMsg);
                if (product) {
                    this.showProductNavigation(product);
                    return;
                }
                
                // 2. Check for buying
                if (this.isBuyingQuery(lowerMsg)) {
                    this.addMessage(t.buyingGuidance, 'bot');
                    return;
                }
                
                // 3. Check for recommendations
                if (this.isRecommendationQuery(lowerMsg)) {
                    this.addMessage(t.recommendationPrompt, 'bot');
                    return;
                }
                
                // 4. Check for high pressure
                if (this.isHighPressureQuery(lowerMsg)) {
                    this.addMessage(t.highPressureResponse, 'bot');
                    return;
                }
                
                // 5. Check for greetings
                if (this.isGreeting(lowerMsg) && !this.greeted) {
                    this.addMessage(t.greeting, 'bot');
                    this.greeted = true;
                    return;
                } else if (this.isGreeting(lowerMsg) && this.greeted) {
                    this.addMessage(t.needHelp, 'bot');
                    return;
                }
                
                // 6. Check for thank you
                if (lowerMsg.includes('thanks') || lowerMsg.includes('thank') || 
                    lowerMsg.includes('धन्यवाद') || lowerMsg.includes('शुक्रिया')) {
                    this.addMessage(t.thankYou, 'bot');
                    return;
                }
                
                // 7. Check for contact
                if (this.isContactQuery(lowerMsg)) {
                    this.handleQuickAction('contact');
                    return;
                }
                
                // 8. Check for address
                if (this.isAddressQuery(lowerMsg)) {
                    this.handleQuickAction('address');
                    return;
                }
                
                // 9. Check for hours
                if (this.isHoursQuery(lowerMsg)) {
                    this.handleQuickAction('hours');
                    return;
                }
                
                // 10. Check for general products
                if (lowerMsg.includes('product') || lowerMsg.includes('उत्पाद') || 
                    lowerMsg.includes('प्रोडक्ट') || lowerMsg.includes('ಉತ್ಪನ್ನ')) {
                    this.handleQuickAction('products');
                    return;
                }
                
                // 11. Check for help/navigation
                if (lowerMsg.includes('help') || lowerMsg.includes('guide') || 
                    lowerMsg.includes('मदद') || lowerMsg.includes('कैसे') ||
                    lowerMsg.includes('how')) {
                    this.handleQuickAction('guide');
                    return;
                }
                
                // Default: show help
                if (lowerMsg.length > 0) {
                    this.addMessage(t.help, 'bot');
                }
            }, 1000);
        }

        addMessage(text, sender) {
            const messagesDiv = document.getElementById('chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            messageDiv.innerHTML = `<div class="message-content">${text.replace(/\n/g, '<br>')}</div>`;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        showTypingIndicator() {
            if (this.isTyping) return;
            
            this.isTyping = true;
            const messagesDiv = document.getElementById('chat-messages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            `;
            messagesDiv.appendChild(typingDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        hideTypingIndicator() {
            this.isTyping = false;
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new SatyamCuteRobot();
    });
})();
// Add this to your existing chatbot.js - ML integration

async function callMLService(endpoint, data) {
    try {
        const response = await fetch(`http://localhost:8001/api/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('ML Service error:', error);
        return null;
    }
}

// Enhanced message processing with ML
async function processMessageWithML(message, context) {
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call ML service for full analysis
        const mlResponse = await callMLService('chat', {
            text: message,
            language: this.currentLang,
            context: {
                sentiment_score: context.sentiment_score || 0,
                time_on_site: context.time_on_site || 0,
                page_views: context.page_views || 1,
                product_clicks: context.product_clicks || 0,
                session_count: context.session_count || 1,
                page_sequence: context.page_sequence || []
            }
        });
        
        hideTypingIndicator();
        
        if (mlResponse) {
            // Use ML response to craft better answers
            const t = TRANSLATIONS[this.currentLang];
            
            // Different responses based on intent
            switch (mlResponse.intent.intent) {
                case 'product_query':
                    if (mlResponse.recommendations && mlResponse.recommendations.length > 0) {
                        let response = t.recommendations + '\n\n';
                        mlResponse.recommendations.forEach(rec => {
                            response += `• ${rec.product}\n`;
                        });
                        this.addMessage(response, 'bot');
                    } else {
                        this.addMessage(t.productPrompt, 'bot');
                    }
                    break;
                    
                case 'buying':
                    this.addMessage(t.buyingGuidance, 'bot');
                    break;
                    
                case 'recommendation':
                    this.addMessage(t.recommendationPrompt, 'bot');
                    break;
                    
                case 'greeting':
                    this.addMessage(t.greeting, 'bot');
                    break;
                    
                case 'contact':
                    this.handleQuickAction('contact');
                    break;
                    
                case 'address':
                    this.handleQuickAction('address');
                    break;
                    
                case 'hours':
                    this.handleQuickAction('hours');
                    break;
                    
                default:
                    this.addMessage(t.help, 'bot');
            }
            
            // Show lead score if high
            if (mlResponse.lead_score && mlResponse.lead_score.score > 70) {
                setTimeout(() => {
                    this.addMessage(`💡 Our team will prioritize your inquiry! (Lead score: ${mlResponse.lead_score.score}%)`, 'bot');
                }, 1000);
            }
            
        } else {
            // Fallback to existing logic
            this.processUserMessage(message);
        }
        
    } catch (error) {
        hideTypingIndicator();
        this.processUserMessage(message);
    }
}
// Add this to track page views for dashboard
(function trackForDashboard() {
    if (!localStorage.getItem('satyam_visitor_id')) {
        localStorage.setItem('satyam_visitor_id', 'VIS-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    }
    const visitorId = localStorage.getItem('satyam_visitor_id');
    
    // Send page view to tracking API
    fetch('http://localhost:8000/api/tracking/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            visitorId: visitorId,
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            duration: 0,
            userAgent: navigator.userAgent
        }),
        keepalive: true
    }).catch(() => console.log('Tracking failed'));
})();