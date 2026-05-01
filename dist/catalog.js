const specMapping = {
    "Compression Male Connector": { press: "6000 PSI", mat: "SS 316", temp: "-50°C to 400°C", desc: "Precision-engineered for leak-proof connection." },
    "Ball Valve": { press: "1000 PSI", mat: "CF8M Stainless", temp: "-20°C to 180°C", desc: "High-performance ball valve for industrial flow control." },
    "Needle Valve": { press: "6000 PSI", mat: "SS 316", temp: "-54°C to 232°C", desc: "Precision needle valve for fine flow regulation." }
};
const viewSubcategoryProducts = (subName, subId) => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = '0';
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
            img: `/api/products/image/${subId}`
        };
        localStorage.setItem('selectedProduct', JSON.stringify(productData));
        window.location.href = 'product-detail.html';
    }, 400);
};
const loadSubcategories = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('cat') || 'tube-fittings';
    try {
        const response = await fetch(`/api/products/category/${categoryId}/subcategories`);
        const data = await response.json();
        const grid = document.getElementById('products-grid-view');
        if (!grid)
            return;
        grid.innerHTML = '';
        data.subcategories.slice(0, 6).forEach((sub) => {
            const currentId = sub._id || sub.id;
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cssText = 'border: 1px solid #ddd; border-radius: 10px; padding: 15px; margin: 10px; cursor: pointer; transition: transform 0.3s;';
            card.innerHTML = `
                <div class="image-container" style="text-align: center;">
                    <img src="/api/products/image/${currentId}" 
                         alt="${sub.name}"
                         style="width: 100%; height: 200px; object-fit: contain;"
                         onerror="this.src='/api/products/image/6975126cd0195fb59dbeeeed'">
                </div>
                <div class="product-info" style="text-align: center; margin-top: 15px;">
                    <h3 style="font-size: 16px;">${sub.name}</h3>
                </div>
            `;
            card.addEventListener('click', () => viewSubcategoryProducts(sub.name, currentId));
            grid.appendChild(card);
        });
        const title = document.getElementById('display-title');
        if (title)
            title.textContent = data.categoryName?.toUpperCase() || categoryId.toUpperCase();
    }
    catch (error) {
        console.error('Error loading subcategories:', error);
    }
};
document.addEventListener('DOMContentLoaded', loadSubcategories);
