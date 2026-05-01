// admin-dashboard.ts - ORIGINAL STRUCTURE PRESERVED, ONLY API PATHS FIXED

declare const Chart: any;

class PredictiveAdminDashboard {
    private charts: Map<string, any>;
    private token: string | null;
    private mlData: any = null;
    private currentDrillLevel: string = 'daily';
    private refreshInterval: number | null = null;

    constructor() {
        this.charts = new Map();
        this.token = localStorage.getItem('admin_token');
        this.initialize();
    }

    private async initialize(): Promise<void> {
        this.showLoading();
        this.startClock();
        this.setupNavigation();
        await this.loadDashboardData();
        this.startAutoRefresh();
        this.hideLoading();
    }

    private startAutoRefresh(): void {
        // Refresh every 30 seconds to show real-time updates
        this.refreshInterval = window.setInterval(() => {
            this.loadDashboardData();
        }, 30000);
    }

    private async loadDashboardData(): Promise<void> {
        try {
            const headers: HeadersInit = {};
            if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

            let visitors: any[] = [];
            let inquiries: any[] = [];
            let clickstream: any[] = [];
            let products: any[] = [];

            // Fetch real data from your Node.js backend - FIXED: Removed localhost
            try {
                const visitorsRes = await fetch('/api/tracking/analytics', { headers });
                if (visitorsRes.ok) {
                    const data = await visitorsRes.json();
                    visitors = data.visitors || [];
                    console.log(`✅ Loaded ${visitors.length} visitors`);
                }
            } catch (e) { console.log('No visitor data'); }

            try {
                const inquiriesRes = await fetch('/api/contact/all', { headers });
                if (inquiriesRes.ok) {
                    const data = await inquiriesRes.json();
                    inquiries = data.inquiries || [];
                    console.log(`✅ Loaded ${inquiries.length} inquiries`);
                }
            } catch (e) { console.log('No inquiry data'); }

            try {
                const clickstreamRes = await fetch('/api/tracking/analytics', { headers });
                if (clickstreamRes.ok) {
                    const data = await clickstreamRes.json();
                    clickstream = data.clickstream || [];
                    console.log(`✅ Loaded ${clickstream.length} clickstream events`);
                }
            } catch (e) { console.log('No clickstream data'); }

            try {
                const productsRes = await fetch('/api/products', { headers });
                if (productsRes.ok) {
                    products = await productsRes.json();
                    console.log(`✅ Loaded ${products.length} products`);
                }
            } catch (e) { console.log('No product data'); }

            // Send to Python ML service for analysis - FIXED: Removed localhost
            const response = await fetch('/api/admin/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitors, inquiries, clickstream, products })
            });
            
            if (response.ok) {
                this.mlData = await response.json();
                console.log('✅ ML Data updated:', this.mlData);
                this.renderOverview();
                this.renderSentimentPage();
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    private renderOverview(): void {
        const container = document.getElementById('dynamic-content');
        if (!container) return;

        const dailyTraffic = this.mlData?.analytics?.daily_traffic || [];
        const lstmForecast = this.mlData?.analytics?.traffic_forecast || [];
        const deviceStats = this.mlData?.analytics?.device_stats || { Desktop: 0, Mobile: 0, Tablet: 0 };
        const topProducts = this.mlData?.analytics?.top_products || [];
        const clusters = this.mlData?.analytics?.customer_clusters || {};
        const kpi = this.mlData?.kpi || { 
            total_visitors: 0, total_inquiries: 0, hot_leads: 0, warm_leads: 0, cold_leads: 0, 
            avg_session: 0, bounce_rate: 0, conversion_rate: 0 
        };

        container.innerHTML = `
            <!-- KPI Cards -->
            <div class="kpi-row">
                <div class="card kpi">
                    <h4><i class="fas fa-users"></i> Total Visitors</h4>
                    <p>${kpi.total_visitors}</p>
                    <small>Unique visitors (30 days)</small>
                </div>
                <div class="card kpi">
                    <h4><i class="fas fa-clock"></i> Avg Session</h4>
                    <p>${kpi.avg_session} min</p>
                    <small>Time on site</small>
                </div>
                <div class="card kpi">
                    <h4><i class="fas fa-chart-line"></i> Bounce Rate</h4>
                    <p>${kpi.bounce_rate}%</p>
                    <small>${kpi.bounce_rate < 40 ? '✓ Good' : '⚠ High'}</small>
                </div>
                <div class="card kpi">
                    <h4><i class="fas fa-percent"></i> Conversion</h4>
                    <p>${kpi.conversion_rate}%</p>
                    <small>Inquiry rate</small>
                </div>
            </div>

            <!-- Traffic Analysis -->
            <div class="card" style="margin-bottom: 20px;">
                <h3><i class="fas fa-chart-line"></i> Traffic Analysis 
                    <span style="float: right;">
                        <button class="drill-btn" data-level="daily" style="background: #2d7a9b; border: none; color: white; padding: 5px 12px; border-radius: 5px; margin: 0 3px; cursor: pointer;">Daily</button>
                        <button class="drill-btn" data-level="forecast" style="background: #ffb347; border: none; color: #171F22; padding: 5px 12px; border-radius: 5px; margin: 0 3px; cursor: pointer;">Forecast</button>
                    </span>
                </h3>
                <div class="chart-container" style="height: 350px;">
                    <canvas id="mainTrafficChart"></canvas>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="grid-main">
                <div class="card">
                    <h3><i class="fas fa-chart-pie"></i> Device Distribution</h3>
                    <div class="chart-container"><canvas id="deviceChart"></canvas></div>
                </div>
                <div class="card">
                    <h3><i class="fas fa-chart-bar"></i> Top Products by Views</h3>
                    <div class="chart-container"><canvas id="topProductsChart"></canvas></div>
                </div>
            </div>
        `;

        setTimeout(() => {
            this.initMainTrafficChart(dailyTraffic);
            this.initDeviceChart(deviceStats);
            this.initTopProductsChart(topProducts);
            this.setupDrillButtons(dailyTraffic, lstmForecast);
        }, 100);
    }

    private setupDrillButtons(daily: any[], forecast: number[]): void {
        document.querySelectorAll('.drill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = (e.target as HTMLElement).dataset.level;
                this.currentDrillLevel = level;
                
                let data: number[], labels: string[];
                if (level === 'daily') {
                    data = daily.map(d => d.count);
                    labels = daily.map(d => d.date);
                } else {
                    data = forecast;
                    const now = new Date();
                    labels = [];
                    for (let i = 0; i < 7; i++) {
                        const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
                        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                    }
                }
                this.updateMainChart(data, labels, level);
            });
        });
    }

    private updateMainChart(data: number[], labels: string[], level: string): void {
        const canvas = document.getElementById('mainTrafficChart') as HTMLCanvasElement;
        if (!canvas) return;
        
        if (this.charts.has('mainTrafficChart')) {
            this.charts.get('mainTrafficChart').destroy();
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 350);
        gradient.addColorStop(0, 'rgba(45, 122, 155, 0.3)');
        gradient.addColorStop(1, 'rgba(45, 122, 155, 0)');
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: level === 'forecast' ? 'Forecast' : 'Daily Visitors',
                    data: data,
                    borderColor: level === 'forecast' ? '#ffb347' : '#2d7a9b',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: level === 'forecast' ? '#ffb347' : '#2d7a9b',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { color: '#BDC2C7' } } },
                scales: { y: { beginAtZero: true, ticks: { color: '#848A98' } }, x: { ticks: { color: '#848A98', maxRotation: 45 } } }
            }
        });
        this.charts.set('mainTrafficChart', chart);
    }

    private initMainTrafficChart(daily: any[]): void {
        const canvas = document.getElementById('mainTrafficChart') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 350);
        gradient.addColorStop(0, 'rgba(45, 122, 155, 0.3)');
        gradient.addColorStop(1, 'rgba(45, 122, 155, 0)');
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: daily.map(d => d.date),
                datasets: [{
                    label: 'Daily Visitors',
                    data: daily.map(d => d.count),
                    borderColor: '#2d7a9b',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#2d7a9b',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { color: '#BDC2C7' } } },
                scales: { y: { beginAtZero: true, ticks: { color: '#848A98' } }, x: { ticks: { color: '#848A98', maxRotation: 45 } } }
            }
        });
        this.charts.set('mainTrafficChart', chart);
    }

    private initDeviceChart(deviceStats: any): void {
        const canvas = document.getElementById('deviceChart') as HTMLCanvasElement;
        if (!canvas) return;
        this.destroyChart('deviceChart');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const hasData = Object.values(deviceStats).some(v => (v as number) > 0);
        if (!hasData) {
            new Chart(ctx, { type: 'doughnut', data: { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#666'] }] } });
            return;
        }

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(deviceStats),
                datasets: [{ data: Object.values(deviceStats), backgroundColor: ['#2d7a9b', '#4caf9e', '#ffb347'], borderWidth: 0 }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'bottom', labels: { color: '#BDC2C7' } } } }
        });
    }

    private initTopProductsChart(products: any[]): void {
        const canvas = document.getElementById('topProductsChart') as HTMLCanvasElement;
        if (!canvas) return;
        this.destroyChart('topProductsChart');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const top5 = products.slice(0, 5);
        if (top5.length === 0) {
            new Chart(ctx, { type: 'bar', data: { labels: ['No Data'], datasets: [{ data: [0], backgroundColor: '#2d7a9b' }] } });
            return;
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top5.map(p => p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name),
                datasets: [{ label: 'Views', data: top5.map(p => p.views || 0), backgroundColor: '#2d7a9b', borderRadius: 6 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#BDC2C7' } } }, scales: { y: { beginAtZero: true, ticks: { color: '#848A98' } }, x: { ticks: { color: '#848A98' } } } }
        });
    }

    private renderSentimentPage(): void {
        const container = document.getElementById('dynamic-content-sentiment');
        if (!container) return;

        const sentimentDist = this.mlData?.analytics?.sentiment_distribution || { Positive: 0, Neutral: 0, Negative: 0, Urgent: 0 };
        const topProducts = this.mlData?.analytics?.top_products || [];
        const recommendations = this.mlData?.ml_insights?.recommendations || [];
        const topLeads = this.mlData?.analytics?.top_leads || [];
        const sentimentTotal = Object.values(sentimentDist).reduce((a: number, b: number) => a + (b as number), 0);

        container.innerHTML = `
            <!-- AI Recommendations -->
            <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(45,122,155,0.2), rgba(45,122,155,0.05)); border-left: 4px solid #ffb347;">
                <h3><i class="fas fa-robot"></i> AI-Powered Real-Time Insights</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">
                    ${recommendations.map((rec: string) => `
                        <div style="padding: 15px; background: rgba(45,122,155,0.15); border-radius: 12px; border-left: 3px solid #ffb347;">
                            <i class="fas fa-lightbulb" style="color: #ffb347; font-size: 18px; margin-right: 12px;"></i>
                            <span style="font-size: 13px; line-height: 1.5;">${rec}</span>
                        </div>
                    `).join('')}
                    ${recommendations.length === 0 ? '<div style="padding: 15px;">Analyzing data...</div>' : ''}
                </div>
            </div>

            <!-- Sentiment Chart and Leads -->
            <div class="grid-main">
                <div class="card">
                    <h3><i class="fas fa-chart-pie"></i> Sentiment Distribution</h3>
                    <div class="chart-container">
                        <canvas id="sentimentChart"></canvas>
                    </div>
                    <div style="margin-top: 15px; text-align: center;">
                        <p style="color: #4caf9e;">📊 Based on ${sentimentTotal} customer inquiries</p>
                        ${(sentimentDist.Urgent as number) > 0 ? `<p style="color: #e74c3c;">⚠️ ${sentimentDist.Urgent} urgent inquiries need attention</p>` : ''}
                    </div>
                </div>
                <div class="card">
                    <h3><i class="fas fa-trophy"></i> Priority Leads (Hot/Warm)</h3>
                    <div style="max-height: 350px; overflow-y: auto;">
                        ${topLeads.slice(0, 8).map((lead: any) => `
                            <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <span style="font-weight: 600;">${lead.name}</span>
                                        <div style="font-size: 11px; color: #C1D1CF; margin-top: 4px;">${lead.email || ''}</div>
                                        <div style="font-size: 10px; color: #ffb347; margin-top: 4px;">${lead.sentiment || 'Neutral'}</div>
                                    </div>
                                    <span style="color: ${lead.quality === 'Hot' ? '#e74c3c' : lead.quality === 'Warm' ? '#ffb347' : '#b0b8c0'}; font-weight: 600;">
                                        ${lead.score}% • ${lead.quality}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                        ${topLeads.length === 0 ? '<div style="padding: 20px; text-align: center;">No leads data available</div>' : ''}
                    </div>
                </div>
            </div>

            <!-- Top Products Grid -->
            <div class="card" style="margin-top: 20px;">
                <h3><i class="fas fa-chart-bar"></i> Top Products by Page Views</h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 15px;">
                    ${topProducts.map((p: any) => `
                        <div style="background: linear-gradient(135deg, rgba(45,122,155,0.25), rgba(45,122,155,0.1)); border-radius: 12px; padding: 15px; text-align: center;">
                            <div style="font-size: 12px; color: #ffb347;">${p.category || 'Product'}</div>
                            <div style="font-size: 13px; font-weight: 600; margin: 8px 0;">${p.name.length > 20 ? p.name.substring(0, 17) + '...' : p.name}</div>
                            <div style="font-size: 28px; font-weight: 700; color: white;">${p.popularity_score}%</div>
                            <div style="font-size: 11px; margin-top: 8px; color: #4caf9e;">
                                👁️ ${p.views} views
                            </div>
                        </div>
                    `).join('')}
                    ${topProducts.length === 0 ? '<div style="grid-column: span 4; text-align: center; padding: 40px;">No product view data available</div>' : ''}
                </div>
            </div>
        `;

        setTimeout(() => {
            this.initSentimentChart(sentimentDist);
        }, 100);
    }

    private initSentimentChart(sentimentDist: any): void {
        const canvas = document.getElementById('sentimentChart') as HTMLCanvasElement;
        if (!canvas) return;
        this.destroyChart('sentimentChart');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const values = Object.values(sentimentDist) as number[];
        const hasData = values.some(v => v > 0);
        
        if (!hasData) {
            new Chart(ctx, { type: 'doughnut', data: { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#666'] }] } });
            return;
        }

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(sentimentDist),
                datasets: [{ data: values, backgroundColor: ['#4caf9e', '#ffb347', '#e74c3c', '#2d7a9b'], borderWidth: 0 }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#BDC2C7' } } } }
        });
    }

    private destroyChart(id: string): void {
        if (this.charts.has(id)) {
            this.charts.get(id)?.destroy();
            this.charts.delete(id);
        }
    }

    private showLoading(): void {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'flex';
    }

    private hideLoading(): void {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    private startClock(): void {
        const clockEl = document.getElementById('clock');
        if (!clockEl) return;
        const update = () => {
            const now = new Date();
            clockEl.innerHTML = now.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase();
        };
        update();
        setInterval(update, 1000);
    }

    private setupNavigation(): void {
        const menuItems = document.querySelectorAll<HTMLLIElement>("#side-menu li");
        const titleEl = document.getElementById("title");
        const sections = document.querySelectorAll<HTMLElement>(".section");

        menuItems.forEach(li => {
            li.addEventListener('click', () => {
                const page = li.getAttribute("data-page");
                if (!page) return;
                document.querySelector("#side-menu li.active")?.classList.remove("active");
                li.classList.add("active");
                if (titleEl) titleEl.innerText = page === 'overview' ? 'Analytics' : 'Sentiment & Predictions';
                sections.forEach(s => s.classList.remove('active'));
                if (page === 'overview') {
                    document.getElementById('overview')?.classList.add('active');
                    this.renderOverview();
                } else {
                    document.getElementById('sentiment')?.classList.add('active');
                    this.renderSentimentPage();
                }
            });
        });
    }
}

new PredictiveAdminDashboard();