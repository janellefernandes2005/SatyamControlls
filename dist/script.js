let mainCategories = [];
let currentIndex = 0;
let slideInterval;
const loadMainCategories = async () => {
    try {
        console.log('🔄 Loading main categories...');
        const response = await fetch('/api/products/main-categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        mainCategories = categories.map((category) => ({
            id: category.id,
            name: category.name,
            desc: category.desc || `Explore our ${category.name} collection`,
            imageUrl: `/api/products/main-category-image/${category.id}`,
            count: category.count || 0
        }));
        console.log(`✅ Loaded ${mainCategories.length} main categories`);
        initializeCarousel();
    }
    catch (error) {
        console.error('❌ Failed to load main categories:', error);
        mainCategories = [
            {
                id: "tube-fittings",
                name: "Tube Fittings",
                desc: "Precision tube connections and fittings for industrial instrumentation.",
                imageUrl: "/api/products/image/6975126cd0195fb59dbeeeed",
                count: 0
            },
            {
                id: "ball-valves",
                name: "Ball Valves",
                desc: "High-performance ball valves for industrial flow control applications.",
                imageUrl: "/api/products/image/6975126cd0195fb59dbeeee3",
                count: 0
            }
        ];
        initializeCarousel();
    }
};
const initializeCarousel = () => {
    const activeProductImg = document.getElementById('activeProductImg');
    const prodTitle = document.getElementById('prodTitle');
    const prodDesc = document.getElementById('prodDesc');
    const track = document.getElementById('track');
    const viewBtn = document.getElementById('viewBtn');
    if (mainCategories.length === 0)
        return;
    // Set main image
    if (activeProductImg) {
        activeProductImg.src = mainCategories[currentIndex].imageUrl;
        activeProductImg.onerror = () => {
            activeProductImg.src = "/api/products/image/6975126cd0195fb59dbeeeed";
        };
    }
    // Create category cards
    if (track) {
        track.innerHTML = '';
        mainCategories.forEach((category, index) => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.style.cssText = 'min-width: 250px; padding: 20px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.1); border-radius: 15px; margin: 10px;';
            const img = document.createElement('img');
            img.src = category.imageUrl;
            img.alt = category.name;
            img.style.width = '120px';
            img.style.height = '120px';
            img.style.objectFit = 'contain';
            img.onerror = () => {
                img.src = "/api/products/image/6975126cd0195fb59dbeeeed";
            };
            const title = document.createElement('h3');
            title.textContent = category.name;
            title.style.marginTop = '15px';
            card.appendChild(img);
            card.appendChild(title);
            card.addEventListener('click', () => {
                window.location.href = `view-category.html?cat=${category.id}`;
            });
            track.appendChild(card);
        });
    }
    // Update display function
    const updateDisplay = () => {
        const category = mainCategories[currentIndex];
        if (prodTitle)
            prodTitle.textContent = category.name;
        if (prodDesc)
            prodDesc.textContent = category.desc;
        if (activeProductImg) {
            activeProductImg.src = category.imageUrl;
        }
    };
    updateDisplay();
    // Auto slide every 5 seconds
    if (slideInterval)
        clearInterval(slideInterval);
    slideInterval = window.setInterval(() => {
        currentIndex = (currentIndex + 1) % mainCategories.length;
        updateDisplay();
    }, 5000);
    if (viewBtn) {
        viewBtn.onclick = () => {
            window.location.href = `view-category.html?cat=${mainCategories[currentIndex].id}`;
        };
    }
};
// Start everything
document.addEventListener('DOMContentLoaded', loadMainCategories);
