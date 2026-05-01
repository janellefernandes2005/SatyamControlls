import { productDatabase } from './database';
const grid = document.getElementById('products-grid-view');
const params = new URLSearchParams(window.location.search);
const catId = params.get('cat') || "tube-fittings";
const category = productDatabase[catId];
if (category) {
    document.getElementById('display-title').textContent = category.name.toUpperCase();
    grid.innerHTML = category.items.map((item, index) => `
        <div class="product-card" data-index="${index}">
            <img src="${item.img}">
            <h3>${item.name}</h3>
        </div>
    `).join('');
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const idx = card.dataset.index;
            localStorage.setItem('selectedProduct', JSON.stringify(category.items[parseInt(idx)]));
            window.location.href = 'product-detail.html';
        });
    });
}
