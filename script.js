// Configuração de Feeds
const CATEGORY_FEEDS = {
    'inicio': [
        { name: 'GE', url: 'https://ge.globo.com/rss/ge/' },
        { name: 'Trivela', url: 'https://trivela.com.br/feed/' }
    ],
    'brasileirao': [{ name: 'Brasileirão', url: 'https://ge.globo.com/rss/ge/futebol/brasileirao-serie-a/' }],
    'copa-do-brasil': [{ name: 'Copa do Brasil', url: 'https://ge.globo.com/rss/ge/futebol/copa-do-brasil/' }],
    'mercado': [{ name: 'Mercado', url: 'https://ge.globo.com/rss/ge/mercado-da-bola/' }],
    'selecao': [{ name: 'Seleção', url: 'https://ge.globo.com/rss/ge/selecao-brasileira/' }]
};

// Dados Tabela 2026 Melhorada (com histórico e tendência)
const standings2026 = [
    { pos: 1, team: 'Palmeiras', pts: 29, trend: 'up', form: ['win', 'win', 'win', 'draw', 'win'] },
    { pos: 2, team: 'Flamengo', pts: 23, trend: 'none', form: ['draw', 'loss', 'win', 'win', 'win'] },
    { pos: 3, team: 'Fluminense', pts: 23, trend: 'up', form: ['win', 'win', 'draw', 'loss', 'win'] },
    { pos: 4, team: 'São Paulo', pts: 20, trend: 'down', form: ['loss', 'draw', 'win', 'win', 'loss'] },
    { pos: 5, team: 'Bahia', pts: 20, trend: 'none', form: ['loss', 'win', 'draw', 'win', 'loss'] },
    { pos: 6, team: 'Athletico-PR', pts: 19, trend: 'none', form: ['win', 'loss', 'win', 'draw', 'loss'] },
    { pos: 7, team: 'Coritiba', pts: 19, trend: 'up', form: ['loss', 'draw', 'draw', 'win', 'win'] },
    { pos: 8, team: 'Bragantino', pts: 17, trend: 'down', form: ['loss', 'win', 'win', 'draw', 'loss'] }
];

// Dados Mercado da Bola (Exclusivos para aba Mercado)
const transferMarket = [
    { player: 'Neymar Jr', current: 'Al-Hilal', target: 'Santos', status: 'negociando', label: '🟡 NEGOCIANDO' },
    { player: 'Gabigol', current: 'Flamengo', target: 'Cruzeiro', status: 'fechado', label: '🟢 FECHADO' },
    { player: 'Arrascaeta', current: 'Flamengo', target: 'Boca Juniors', status: 'esfriou', label: '🔴 ESFRIOU' },
    { player: 'Estêvão', current: 'Palmeiras', target: 'Chelsea', status: 'fechado', label: '🟢 FECHADO' }
];

const footballFallbacks = [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop'
];

function handleImgError(img) {
    const idx = Math.floor(Math.random() * footballFallbacks.length);
    img.src = footballFallbacks[idx];
    img.onerror = null;
}

function extractImage(item) {
    if (item.thumbnail && item.thumbnail !== '') return item.thumbnail;
    const content = item.content || item.description || '';
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : footballFallbacks[Math.floor(Math.random() * footballFallbacks.length)];
}

async function fetchLiveScores() {
    const container = document.getElementById('live-container');
    if (!container) return;
    try {
        const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/livescore.php');
        const data = await response.json();
        if (data.events) {
            container.innerHTML = data.events.map(event => `
                <div class="live-card">
                    <div class="live-badge">LIVE</div>
                    <div class="live-teams-row"><span>${event.strHomeTeam}</span><span class="live-score-val">${event.intHomeScore}</span></div>
                    <div class="live-teams-row"><span>${event.strAwayTeam}</span><span class="live-score-val">${event.intAwayScore}</span></div>
                </div>
            `).join('');
        } else { container.innerHTML = '<span class="no-live">Nenhum jogo ao vivo no momento</span>'; }
    } catch (e) { container.innerHTML = '<span class="no-live">Nenhum jogo ao vivo no momento</span>'; }
}

async function fetchNews(category = 'inicio') {
    const container = document.getElementById('news-container');
    const label = document.getElementById('page-label');
    if (!container) return;

    const titles = { 'inicio': 'ÚLTIMAS NOTÍCIAS', 'brasileirao': 'BRASILEIRÃO 2026', 'copa-do-brasil': 'COPA DO BRASIL', 'mercado': 'MERCADO DA BOLA', 'selecao': 'SELEÇÃO BRASILEIRA' };
    if (label) label.textContent = titles[category];

    // Se for a aba mercado, renderizamos os cards especiais antes das notícias do feed
    if (category === 'mercado') {
        renderTransferMarket();
        return;
    }

    container.innerHTML = '<div class="loading">Sintonizando últimas do futebol...</div>';
    let allNews = [];
    const feeds = CATEGORY_FEEDS[category] || CATEGORY_FEEDS['inicio'];

    for (const f of feeds) {
        try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(f.url)}&t=${Date.now()}`);
            const data = await res.json();
            if (data.status === 'ok') {
                const items = data.items.map(item => ({
                    title: item.title, link: item.link, thumbnail: extractImage(item),
                    category: f.name, pubDate: new Date(item.pubDate), desc: item.description.replace(/<[^>]*>?/gm, '').substring(0, 90) + '...'
                }));
                allNews = [...allNews, ...items];
            }
        } catch (e) {}
    }

    if (allNews.length > 0) {
        allNews.sort((a, b) => b.pubDate - a.pubDate);
        renderNews(allNews.slice(0, 10));
    }
}

function renderTransferMarket() {
    const container = document.getElementById('news-container');
    container.innerHTML = `
        <div class="transfer-grid">
            ${transferMarket.map(t => `
                <div class="transfer-card">
                    <div class="transfer-player">${t.player}</div>
                    <div class="transfer-teams">
                        <span>${t.current}</span>
                        <i class="fas fa-arrow-right"></i>
                        <span>${t.target}</span>
                    </div>
                    <span class="transfer-status status-${t.status}">${t.label}</span>
                </div>
            `).join('')}
        </div>
        <h2 class="section-title" style="margin-top: 40px; width: 100%;">MAIS DO MERCADO</h2>
        <div id="more-market-news" class="news-grid">Carregando feed de transferências...</div>
    `;
    fetchMoreMarketNews();
}

async function fetchMoreMarketNews() {
    const container = document.getElementById('more-market-news');
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(CATEGORY_FEEDS['mercado'][0].url)}`);
    const data = await res.json();
    if (data.status === 'ok') {
        container.innerHTML = data.items.slice(0, 6).map(item => `
            <article class="feed-card" onclick="window.open('${item.link}', '_blank')">
                <div class="card-img"><img src="${extractImage(item)}" onerror="handleImgError(this)"></div>
                <div class="card-info">
                    <span class="tag">MERCADO</span>
                    <h3>${item.title}</h3>
                    <p>${item.description.replace(/<[^>]*>?/gm, '').substring(0, 90)}...</p>
                    <span class="time">Publicado hoje</span>
                </div>
            </article>
        `).join('');
    }
}

function renderNews(news) {
    const container = document.getElementById('news-container');
    container.innerHTML = news.map(item => `
        <article class="feed-card" onclick="window.open('${item.link}', '_blank')">
            <div class="card-img"><img src="${item.thumbnail}" onerror="handleImgError(this)"></div>
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <span class="time">Hoje às ${item.pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </article>
    `).join('');
    
    const items = document.querySelectorAll('.hero-item');
    news.slice(0, 3).forEach((n, i) => {
        if (items[i]) {
            items[i].querySelector('img').src = n.thumbnail;
            const h = items[i].querySelector('h1') || items[i].querySelector('h2');
            if (h) h.textContent = n.title;
            items[i].querySelector('.hero-tag').textContent = n.category;
            items[i].onclick = () => window.open(n.link, '_blank');
        }
    });
}

function renderStandings() {
    const body = document.getElementById('standingsBody');
    if (body) {
        body.innerHTML = standings2026.map(s => `
            <tr>
                <td>
                    <span style="color: #999; font-weight: 800;">${s.pos}</span>
                    <span class="pos-change ${s.trend}">${s.trend === 'up' ? '▲' : s.trend === 'down' ? '▼' : ''}</span>
                </td>
                <td class="team-name">${s.team}</td>
                <td class="points">${s.pts}</td>
                <td>
                    <div class="last-matches">
                        ${s.form.map(f => `<span class="match-dot ${f}"></span>`).join('')}
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

function renderMatches() {
    const container = document.getElementById('todayMatches');
    const matches = [{ h: 'Grêmio', a: 'Confiança', t: '19:30' }, { h: 'Barra', a: 'Corinthians', t: '21:30' }, { h: 'Paysandu', a: 'Vasco', t: '21:30' }];
    if (container) {
        container.innerHTML = matches.map(m => `
            <div class="match-item">
                <div class="match-info">COPA DO BRASIL • HOJE ${m.t}</div>
                <div class="match-teams"><span>${m.h}</span><span class="match-vs">VS</span><span>${m.a}</span></div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderStandings();
    renderMatches();
    fetchLiveScores();
    fetchNews('inicio');
    setInterval(fetchLiveScores, 60000);

    document.querySelectorAll('[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[data-tab="${tab}"]`);
            if (activeLink) activeLink.classList.add('active');
            fetchNews(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});
