// details.ts - Final Version

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

    // Load Unique Image with smooth fade-in
    const imgEl = document.getElementById('p-img') as HTMLImageElement;
    if (imgEl) {
        imgEl.style.opacity = '0';
        imgEl.src = product.img;
        imgEl.onload = () => {
            imgEl.style.transition = 'opacity 0.8s ease';
            imgEl.style.opacity = '1';
        };
        imgEl.onerror = () => {
            imgEl.src = 'https://placehold.co/600x400?text=Unavailable';
            imgEl.style.opacity = '1';
        };
    }

    document.title = `${product.name} | Satyam Controls`;
});