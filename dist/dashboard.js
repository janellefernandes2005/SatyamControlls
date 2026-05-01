/**
 * Satyam Controls Admin Dashboard Logic
 */
const initDashboard = () => {
    // 1. Load Data
    const rawData = localStorage.getItem('pageLogs');
    const logs = rawData ? JSON.parse(rawData) : [];
    // 2. Statistics Calculations
    const totalHits = logs.length;
    const uniqueUsers = new Set(logs.map(l => l.fingerprint)).size;
    const totalDuration = logs.reduce((acc, curr) => acc + curr.duration, 0);
    const avgTime = totalHits > 0 ? Math.round(totalDuration / totalHits) : 0;
    // Aggregating for Popular Page
    const pageHits = {};
    logs.forEach(l => {
        pageHits[l.page] = (pageHits[l.page] || 0) + 1;
    });
    const sortedPages = Object.entries(pageHits).sort((a, b) => b[1] - a[1]);
    const popularPage = sortedPages.length > 0 ? sortedPages[0][0].replace('.html', '') : "N/A";
    // 3. Update UI Elements
    document.getElementById('totalHits').innerText = totalHits.toString();
    document.getElementById('uniqueUsers').innerText = uniqueUsers.toString();
    document.getElementById('avgTime').innerText = `${avgTime}s`;
    document.getElementById('topPage').innerText = popularPage.toUpperCase();
    // 4. Update Recent Log Table
    const tableBody = document.getElementById('logTable');
    logs.slice(-5).reverse().forEach(log => {
        const row = `<tr>
            <td style="color:#A3AED0">${log.fingerprint}</td>
            <td>${log.page.replace('.html', '')}</td>
            <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    // 5. Line Chart (Exact Styling from Image)
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(pageHits).map(k => k.replace('.html', '')),
            datasets: [{
                    label: 'Interactions',
                    data: Object.values(pageHits),
                    borderColor: '#4318FF',
                    backgroundColor: 'rgba(67, 24, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { display: false }, ticks: { display: false } },
                x: { grid: { display: false } }
            }
        }
    });
};
/**
 * FIXED LOGOUT LOGIC
 */
const handleLogout = () => {
    // 1. Remove Auth Tokens
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    // 2. Redirect and prevent "Back" button usage
    window.location.replace("admin-login.html");
};
window.onload = () => {
    initDashboard();
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
};
export {};
