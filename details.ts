// details.ts - FINAL WORKING VERSION
document.addEventListener('DOMContentLoaded', () => {
    const rawData = localStorage.getItem('selectedProduct');
    if (!rawData) {
        window.location.href = 'product.html';
        return;
    }

    const product = JSON.parse(rawData);

    // Apply text content
    const elements: Record<string, string> = {
        'p-name': product.name,
        'p-desc': product.desc,
        'p-mat': product.mat,
        'p-press': product.press,
        'p-temp': product.temp
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // Load image
    const imgEl = document.getElementById('p-img') as HTMLImageElement;
    if (imgEl) {
        imgEl.style.opacity = '0';
        
        let imageUrl = product.img;
        if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.includes('localhost')) {
            imageUrl = '/api/products/image/6975126cd0195fb59dbeeeed';
        }
        
        imgEl.src = imageUrl;
        imgEl.onload = () => {
            imgEl.style.transition = 'opacity 0.8s ease';
            imgEl.style.opacity = '1';
        };
        imgEl.onerror = () => {
            imgEl.src = '/api/products/image/6975126cd0195fb59dbeeeed';
            imgEl.style.opacity = '1';
        };
    }

    document.title = `${product.name} | Satyam Controls`;
});