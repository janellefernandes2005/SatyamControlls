class PredictiveAdminDashboard {
    constructor() {
        this.mlData = null;
        this.refreshInterval = null;
        this.charts = new Map();
        this.token = localStorage.getItem('admin_token');
        this.initialize();
    }
    async initialize() {
        this.showLoading();
        this.startClock();
        this.setupNavigation();
        await this.loadDashboardData();
        this.startAutoRefresh();
        this.hideLoading();
    }
    startAutoRefresh() {
        this.refreshInterval = window.setInterval(() => {
            this.loadDashboardData();
        }, 30000);
    }
    async loadDashboardData() {
        try {
            const headers = {};
            if (this.token)
                headers['Authorization'] = `Bearer ${this.token}`;
            let visitors = [];
            let inquiries = [];
            let clickstream = [];
            let products = [];
            // Fetch real data from backend
            try {
                const visitorsRes = await fetch('/api/tracking/analytics', { headers });
                if (visitorsRes.ok) {
                    const data = await visitorsRes.json();
                    visitors = data.visitors || [];
                }
            }
            catch (e) {
                console.log('No visitor data');
            }
            try {
                const inquiriesRes = await fetch('/api/contact/all', { headers });
                if (inquiriesRes.ok) {
                    const data = await inquiriesRes.json();
                    inquiries = data.inquiries || [];
                }
            }
            catch (e) {
                console.log('No inquiry data');
            }
            try {
                const productsRes = await fetch('/api/products', { headers });
                if (productsRes.ok) {
                    products = await productsRes.json();
                }
            }
            catch (e) {
                console.log('No product data');
            }
            // For now, use mock data for ML visualization
            this.mlData = {
                kpi: {
                    total_visitors: visitors.length || 156,
                    total_inquiries: inquiries.length || 45,
                    avg_session: 4.2,
                    bounce_rate: 38,
                    conversion_rate: 2.8,
                    hot_leads: 12,
                    warm_leads: 18,
                    cold_leads: 15
                },
                analytics: {
                    daily_traffic: [
                        { date: 'Jan 1', count: 45 },
                        { date: 'Jan 2', count: 52 },
                        { date: 'Jan 3', count: 48 },
                        { date: 'Jan 4', count: 61 },
                        { date: 'Jan 5', count: 55 },
                        { date: 'Jan 6', count: 67 },
                        { date: 'Jan 7', count: 72 }
                    ],
                    device_stats: { Desktop: 65, Mobile: 28, Tablet: 7 },
                    top_products: products.slice(0, 5).map((p, i) => ({
                        name: p.name || `Product ${i + 1}`,
                        views: Math.floor(Math.random() * 100) + 20,
                        popularity_score: Math.floor(Math.random() * 60) + 40
                    })),
                    sentiment_distribution: { Positive: 28, Neutral: 35, Negative: 12, Urgent: 8 },
                    top_leads: inquiries.slice(0, 5).map((i) => ({
                        name: i.fullName || 'Customer',
                        email: i.email,
                        score: Math.floor(Math.random() * 40) + 60,
                        quality: Math.random() > 0.5 ? 'Hot' : 'Warm',
                        sentiment: 'Interested'
                    }))
                },
                ml_insights: {
                    recommendations: [
                        '🔥 12 hot leads ready for follow-up',
                        '📈 Tube Fittings are your top category with 45% of views',
                        '⚠️ 8 urgent inquiries need immediate attention',
                        '😊 28 positive inquiries - 62% satisfaction rate',
                        '👥 156 unique visitors in last 30 days'
                    ]
                }
            };
            this.renderOverview();
            this.renderSentimentPage();
        }
        catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    renderOverview() {
        const container = document.getElementById('dynamic-content');
        if (!container)
            return;
        const dailyTraffic = this.mlData?.analytics?.daily_traffic || [];
        const deviceStats = this.mlData?.analytics?.device_stats || { Desktop: 0, Mobile: 0, Tablet: 0 };
        const topProducts = this.mlData?.analytics?.top_products || [];
        const kpi = this.mlData?.kpi || {};
        container.innerHTML = `
            <div class="kpi-row">
                <div class="card kpi">
                    <h4><i class="fas fa-users"></i> Total Visitors</h4>
                    <p>${kpi.total_visitors}</p>
                </div>
                <div class="card kpi">
                    <h4><i class="fas fa-clock"></i> Avg Session</h4>
                    <p>${kpi.avg_session} min</p>
                </div>
                <div class="card kpi">
                    <h4><i class="fas fa-chart-line"></i> Bounce Rate</h4>
                    <p>${kpi.bounce_rate}%</p>
                </div>
                <div class="card kpi">
                    <h4><i class="fas fa-percent"></i> Conversion</h4>
                    <p>${kpi.conversion_rate}%</p>
                </div>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <h3><i class="fas fa-chart-line"></i> Traffic Analysis</h3>
                <div class="chart-container" style="height: 350px;">
                    <canvas id="mainTrafficChart"></canvas>
                </div>
            </div>

            <div class="grid-main">
                <div class="card">
                    <h3><i class="fas fa-chart-pie"></i> Device Distribution</h3>
                    <div class="chart-container"><canvas id="deviceChart"></canvas></div>
                </div>
                <div class="card">
                    <h3><i class="fas fa-chart-bar"></i> Top Products</h3>
                    <div class="chart-container"><canvas id="topProductsChart"></canvas></div>
                </div>
            </div>
        `;
        setTimeout(() => {
            this.initMainTrafficChart(dailyTraffic);
            this.initDeviceChart(deviceStats);
            this.initTopProductsChart(topProducts);
        }, 100);
    }
    renderSentimentPage() {
        const container = document.getElementById('dynamic-content-sentiment');
        if (!container)
            return;
        const sentimentDist = this.mlData?.analytics?.sentiment_distribution || { Positive: 0, Neutral: 0, Negative: 0, Urgent: 0 };
        const recommendations = this.mlData?.ml_insights?.recommendations || [];
        const topLeads = this.mlData?.analytics?.top_leads || [];
        container.innerHTML = `
            <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(45,122,155,0.2), rgba(45,122,155,0.05));">
                <h3><i class="fas fa-robot"></i> AI-Powered Insights</h3>
                <div style="display: grid; gap: 15px; margin-top: 20px;">
                    ${recommendations.map((rec) => `
                        <div style="padding: 15px; background: rgba(45,122,155,0.15); border-radius: 12px;">
                            <i class="fas fa-lightbulb" style="color: #ffb347;"></i>
                            <span style="margin-left: 12px;">${rec}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="grid-main">
                <div class="card">
                    <h3><i class="fas fa-chart-pie"></i> Sentiment Distribution</h3>
                    <div class="chart-container"><canvas id="sentimentChart"></canvas></div>
                </div>
                <div class="card">
                    <h3><i class="fas fa-trophy"></i> Priority Leads</h3>
                    <div style="max-height: 350px; overflow-y: auto;">
                        ${topLeads.map((lead) => `
                            <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <div style="display: flex; justify-content: space-between;">
                                    <div>
                                        <strong>${lead.name}</strong>
                                        <div style="font-size: 11px;">${lead.email}</div>
                                    </div>
                                    <span style="color: ${lead.quality === 'Hot' ? '#e74c3c' : '#ffb347'}">${lead.score}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        setTimeout(() => {
            this.initSentimentChart(sentimentDist);
        }, 100);
    }
    initMainTrafficChart(daily) {
        const canvas = document.getElementById('mainTrafficChart');
        if (!canvas)
            return;
        if (this.charts.has('mainTrafficChart')) {
            this.charts.get('mainTrafficChart').destroy();
        }
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: daily.map(d => d.date),
                datasets: [{
                        label: 'Daily Visitors',
                        data: daily.map(d => d.count),
                        borderColor: '#2d7a9b',
                        backgroundColor: 'rgba(45, 122, 155, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#BDC2C7' } } },
                scales: { y: { ticks: { color: '#848A98' } }, x: { ticks: { color: '#848A98' } } }
            }
        });
        this.charts.set('mainTrafficChart', chart);
    }
    initDeviceChart(deviceStats) {
        const canvas = document.getElementById('deviceChart');
        if (!canvas)
            return;
        if (this.charts.has('deviceChart')) {
            this.charts.get('deviceChart').destroy();
        }
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(deviceStats),
                datasets: [{ data: Object.values(deviceStats), backgroundColor: ['#2d7a9b', '#4caf9e', '#ffb347'] }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#BDC2C7' } } } }
        });
        this.charts.set('deviceChart', chart);
    }
    initTopProductsChart(products) {
        const canvas = document.getElementById('topProductsChart');
        if (!canvas)
            return;
        if (this.charts.has('topProductsChart')) {
            this.charts.get('topProductsChart').destroy();
        }
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products.map(p => p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name),
                datasets: [{ label: 'Popularity Score', data: products.map(p => p.popularity_score), backgroundColor: '#2d7a9b' }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#BDC2C7' } } }, scales: { y: { ticks: { color: '#848A98' } }, x: { ticks: { color: '#848A98' } } } }
        });
        this.charts.set('topProductsChart', chart);
    }
    initSentimentChart(sentimentDist) {
        const canvas = document.getElementById('sentimentChart');
        if (!canvas)
            return;
        if (this.charts.has('sentimentChart')) {
            this.charts.get('sentimentChart').destroy();
        }
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(sentimentDist),
                datasets: [{ data: Object.values(sentimentDist), backgroundColor: ['#4caf9e', '#ffb347', '#e74c3c', '#2d7a9b'] }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#BDC2C7' } } } }
        });
        this.charts.set('sentimentChart', chart);
    }
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay)
            overlay.style.display = 'flex';
    }
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay)
            overlay.style.display = 'none';
    }
    startClock() {
        const clockEl = document.getElementById('clock');
        if (!clockEl)
            return;
        const update = () => {
            const now = new Date();
            clockEl.innerHTML = now.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).toUpperCase();
        };
        update();
        setInterval(update, 1000);
    }
    setupNavigation() {
        const menuItems = document.querySelectorAll("#side-menu li");
        const titleEl = document.getElementById("title");
        const sections = document.querySelectorAll(".section");
        menuItems.forEach(li => {
            li.addEventListener('click', () => {
                const page = li.getAttribute("data-page");
                if (!page)
                    return;
                document.querySelector("#side-menu li.active")?.classList.remove("active");
                li.classList.add("active");
                if (titleEl)
                    titleEl.innerText = page === 'overview' ? 'Analytics' : 'Sentiment & Predictions';
                sections.forEach(s => s.classList.remove('active'));
                if (page === 'overview') {
                    document.getElementById('overview')?.classList.add('active');
                    this.renderOverview();
                }
                else {
                    document.getElementById('sentiment')?.classList.add('active');
                    this.renderSentimentPage();
                }
            });
        });
    }
}
new PredictiveAdminDashboard();
