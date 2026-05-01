const heroProducts = [
    { name: "Ball Valve", id: "ball-valves", bg: "#C1D1CF", img: "ball valve.png", desc: "High-performance flow control solutions designed for industrial excellence." },
    { name: "Check Valve", id: "check-valves", bg: "#E2E8E2", img: "check valve.png", desc: "Advanced backflow prevention technology to safeguard infrastructure." },
    { name: "Manifold Valve", id: "manifold-valves", bg: "#B5BFC6", img: "manifold valve.png", desc: "Precision-engineered multi-valve blocks that optimize space." },
    { name: "Pipe Fitting", id: "pipe-valves", bg: "#C1D1CF", img: "pipe fitting.png", desc: "Industrial-strength connectors built for extreme pressure." },
    { name: "Tube Fittings", id: "tube-fittings", bg: "#E2E8E2", img: "tube fittings.png", desc: "Leak-proof instrumentation fittings for high-pressure systems." }
];
let currentIndex = 0;
const moveAmount = 360;
const track = document.getElementById('track');
const mainImg = document.getElementById('activeProductImg');
const textGroup = document.getElementById('textContent');
const title = document.getElementById('prodTitle');
const desc = document.getElementById('prodDesc');
const viewBtn = document.getElementById('viewBtn');
// Restoration of "View Products" logic
viewBtn.onclick = () => {
    window.location.href = `view-category.html?cat=${heroProducts[currentIndex].id}`;
};
const slideNext = () => {
    if (!track || !mainImg || !title || !textGroup || !desc)
        return;
    currentIndex = (currentIndex + 1) % heroProducts.length;
    const data = heroProducts[currentIndex];
    // ANIMATION OUT (Restored)
    textGroup.classList.add('hero-hidden');
    mainImg.classList.add('hero-hidden');
    document.body.style.backgroundColor = data.bg;
    track.style.transition = "transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)";
    track.style.transform = `translateX(-${moveAmount}px)`;
    const firstCard = track.children[0];
    if (firstCard) {
        firstCard.classList.add('card-exit');
    }
    // STATE SWAP (Restored 600ms Delay)
    setTimeout(() => {
        title.textContent = data.name;
        desc.textContent = data.desc;
        mainImg.src = data.img;
        // Reset track position instantly
        track.style.transition = "none";
        track.style.transform = "translateX(0)";
        if (firstCard) {
            track.appendChild(firstCard);
            firstCard.classList.remove('card-exit');
        }
        // ANIMATION IN (Restored)
        textGroup.classList.remove('hero-hidden');
        mainImg.classList.remove('hero-hidden');
        // Re-enable transition for next cycle
        setTimeout(() => {
            track.style.transition = "transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)";
        }, 50);
    }, 600);
};
setInterval(slideNext, 4000);
