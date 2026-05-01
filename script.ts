// script.ts - MAIN CATEGORIES PAGE

interface MainCategory {
    id: string;
    name: string;
    desc: string;
    imageUrl: string;
    count: number;
    bg: string;
}

let mainCategories: MainCategory[] = [];
let currentIndex = 0;
let slideInterval: number;

// Background colors for categories
const backgroundColors = ["#C1D1CF", "#E2E8E2", "#B5BFC6", "#D6E4F0", "#E8D7F1", "#F0E6D2", "#D4E6F1"];

// Image error handler
const handleImageError = (img: HTMLImageElement, text: string): void => {
    console.log(`❌ Image failed: ${text}`);
    img.src = `https://via.placeholder.com/800x600/292C36/FFFFFF?text=${encodeURIComponent(text)}`;
};

// Load main categories from MongoDB
const loadMainCategories = async (): Promise<void> => {
    try {
        console.log('🔄 Loading main categories from MongoDB...');
        
        const response = await fetch('  /api/products/main-categories');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const categories = await response.json();
        
        // Add background colors
        mainCategories = categories.map((category: any, index: number) => ({
            id: category.id,
            name: category.name,
            desc: category.desc || `Explore our ${category.name} collection`,
            imageUrl: category.imageUrl,
            count: category.count || 0,
            bg: backgroundColors[index % backgroundColors.length]
        }));
        
        console.log(`✅ Loaded ${mainCategories.length} main categories`);
        initializeCarousel();
        
    } catch (error) {
        console.error('❌ Failed to load main categories:', error);
        // Fallback
        mainCategories = [
            { 
                id: "tube-fittings", 
                name: "Tube Fittings", 
                desc: "Precision tube connections and fittings for industrial instrumentation.", 
                imageUrl: "  /api/products/main-category-image/tube-fittings",
                count: 0,
                bg: "#C1D1CF" 
            },
            { 
                id: "ball-valves", 
                name: "Ball Valves", 
                desc: "High-performance ball valves for industrial flow control applications.", 
                imageUrl: "  /api/products/main-category-image/ball-valves",
                count: 0,
                bg: "#E2E8E2" 
            },
            { 
                id: "pipe-valves", 
                name: "Pipe Valves", 
                desc: "Heavy-duty valves for piping systems including globe, gate, and butterfly valves.", 
                imageUrl: "  /api/products/main-category-image/pipe-valves",
                count: 0,
                bg: "#B5BFC6" 
            },
            { 
                id: "needle-valves", 
                name: "Needle Valves", 
                desc: "Precision needle valves for fine flow regulation and control.", 
                imageUrl: "  /api/products/main-category-image/needle-valves",
                count: 0,
                bg: "#D6E4F0" 
            },
            { 
                id: "manifold-valves", 
                name: "Manifold Valves", 
                desc: "Multi-valve manifolds for instrumentation and pressure management.", 
                imageUrl: "  /api/products/main-category-image/manifold-valves",
                count: 0,
                bg: "#b8b2ba" 
            },
            { 
                id: "gauge-accessories", 
                name: "Gauge Accessories", 
                desc: "Pressure gauge accessories including seals, snubbers, and siphons.", 
                imageUrl: "  /api/products/main-category-image/gauge-accessories",
                count: 0,
                bg: "#ada89f" 
            },
            { 
                id: "check-valves", 
                name: "Check Valves", 
                desc: "Backflow prevention valves for industrial piping systems.", 
                imageUrl: "  /api/products/main-category-image/check-valves",
                count: 0,
                bg: "#99a1a0" 
            }
        ];
        initializeCarousel();
    }
};

const initializeCarousel = (): void => {
    const activeProductImg = document.getElementById('activeProductImg') as HTMLImageElement;
    const prodTitle = document.getElementById('prodTitle') as HTMLElement;
    const prodDesc = document.getElementById('prodDesc') as HTMLElement;
    const textContent = document.getElementById('textContent') as HTMLElement;
    const track = document.getElementById('track') as HTMLElement;
    const viewBtn = document.getElementById('viewBtn') as HTMLButtonElement;

    if (mainCategories.length === 0) {
        console.error('No categories to display');
        return;
    }

    // Set main image
    if (activeProductImg) {
        const category = mainCategories[currentIndex];
        activeProductImg.src = category.imageUrl;
        activeProductImg.alt = category.name;
        activeProductImg.onerror = () => handleImageError(activeProductImg, category.name);
    }

    // Clear track
    if (track) {
        track.innerHTML = '';
    }

    // Create category cards
    mainCategories.forEach((category, index) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        
        const img = document.createElement('img') as HTMLImageElement;
        img.src = category.imageUrl;
        img.alt = category.name;
        img.onerror = () => handleImageError(img, category.name);
        
        const title = document.createElement('h3');
        title.textContent = category.name;
        title.style.cssText = `
            margin-top: 15px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            color: var(--dark-jungle);
            font-size: 1.1rem;
            text-align: center;
        `;
        
        card.appendChild(img);
        card.appendChild(title);
        
        card.addEventListener('click', () => {
            if (currentIndex === index) return;
            currentIndex = index;
            updateDisplay();
            startTimer();
        });
        
        if (track) track.appendChild(card);
    });

    updateDisplay();
    startTimer();

    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            const currentCategory = mainCategories[currentIndex];
            console.log(`🎯 Navigating to subcategories: ${currentCategory.name}`);
            window.location.href = `view-category.html?cat=${currentCategory.id}`;
        });
    }

    function updateDisplay(): void {
        if (mainCategories.length === 0) return;
        
        const category = mainCategories[currentIndex];
        
        if (textContent) textContent.classList.add('hero-hidden');
        if (activeProductImg) activeProductImg.classList.add('hero-hidden');
        
        if (track) {
            track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            track.style.transform = `translateX(-330px)`;
        }

        setTimeout(() => {
            if (prodTitle) prodTitle.textContent = category.name;
            if (prodDesc) prodDesc.textContent = category.desc;
            
            if (activeProductImg) {
                activeProductImg.src = category.imageUrl;
                activeProductImg.alt = category.name;
                activeProductImg.onerror = () => handleImageError(activeProductImg, category.name);
            }
            
            document.body.style.backgroundColor = category.bg;
            
            if (track) {
                const firstCard = track.children[0];
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                track.appendChild(firstCard);
            }
            
            requestAnimationFrame(() => {
                if (textContent) textContent.classList.remove('hero-hidden');
                if (activeProductImg) activeProductImg.classList.remove('hero-hidden');
            });
        }, 150); 
    }

    function autoSlide(): void {
        if (mainCategories.length === 0) return;
        currentIndex = (currentIndex + 1) % mainCategories.length;
        updateDisplay();
    }

    function startTimer(): void {
        clearInterval(slideInterval);
        // SLOWER: Changed to 8 seconds
        slideInterval = window.setInterval(autoSlide, 8000); 
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    const activeProductImg = document.getElementById('activeProductImg') as HTMLImageElement;
    const prodTitle = document.getElementById('prodTitle') as HTMLElement;
    const prodDesc = document.getElementById('prodDesc') as HTMLElement;

    // Set initial loading state
    if (prodTitle) prodTitle.textContent = "Loading...";
    if (prodDesc) prodDesc.textContent = "Loading categories...";
    if (activeProductImg) {
        activeProductImg.src = "https://via.placeholder.com/800x600/292C36/FFFFFF?text=Loading...";
    }

    // Load main categories from MongoDB
    loadMainCategories();
});