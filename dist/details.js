const product = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
if (product.name) {
    document.getElementById('p-img').src = product.img;
    document.getElementById('p-name').textContent = product.name;
    document.getElementById('p-desc').textContent = product.desc;
    document.getElementById('p-mat').textContent = product.mat;
    document.getElementById('p-press').textContent = product.press;
    document.getElementById('p-temp').textContent = product.temp;
}
