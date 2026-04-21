// Configuração de Feeds
const CATEGORY_FEEDS = {
    'inicio': [{ name: 'GE', url: 'https://ge.globo.com/rss/ge/' }, { name: 'Trivela', url: 'https://trivela.com.br/feed/' }],
    'brasileirao': [{ name: 'Brasileirão', url: 'https://ge.globo.com/rss/ge/futebol/brasileirao-serie-a/' }],
    'copa-do-brasil': [{ name: 'Copa do Brasil', url: 'https://ge.globo.com/rss/ge/futebol/copa-do-brasil/' }],
    'mercado': [{ name: 'Mercado', url: 'https://ge.globo.com/rss/ge/mercado-da-bola/' }],
    'selecao': [{ name: 'Seleção', url: 'https://ge.globo.com/rss/ge/selecao-brasileira/' }]
};

// Dados Tabela 2026 (Fiel à imagem)
const standings2026 = [
    { pos: 1, team: 'Palmeiras', pts: 29, pj: 12, v: 9, sg: 12, trend: 'up' },
    { pos: 2, team: 'Flamengo', pts: 23, pj: 11, v: 7, sg: 10, trend: 'none' },
    { pos: 3, team: 'Fluminense', pts: 23, pj: 12, v: 7, sg: 6, trend: 'up' },
    { pos: 4, team: 'São Paulo', pts: 20, pj: 12, v: 6, sg: 5, trend: 'down' },
    { pos: 5, team: 'Bahia', pts: 20, pj: 11, v: 6, sg: 3, trend: 'none' },
    { pos: 6, team: 'Athletico-PR', pts: 19, pj: 12, v: 6, sg: 3, trend: 'none' },
    { pos: 7, team: 'Coritiba', pts: 19, pj: 12, v: 5, sg: 3, trend: 'up' },
    { pos: 8, team: 'Bragantino', pts: 17, pj: 12, v: 5, sg: 1, trend: 'down' },
    { pos: 9, team: 'Botafogo', pts: 16, pj: 11, v: 5, sg: 0, trend: 'down' },
    { pos: 10, team: 'Vasco da Gama', pts: 16, pj: 12, v: 4, sg: 0, trend: 'up' },
    { pos: 11, team: 'EC Vitória', pts: 15, pj: 11, v: 4, sg: -3, trend: 'up' },
    { pos: 12, team: 'Atlético-MG', pts: 14, pj: 12, v: 4, sg: -1, trend: 'down' },
    { pos: 13, team: 'Grêmio', pts: 13, pj: 12, v: 3, sg: -2, trend: 'down' },
    { pos: 14, team: 'Fortaleza', pts: 13, pj: 12, v: 3, sg: -4, trend: 'down' },
    { pos: 15, team: 'Cuiabá', pts: 12, pj: 11, v: 3, sg: -5, trend: 'down' },
    { pos: 16, team: 'Ceará', pts: 12, pj: 12, v: 3, sg: -6, trend: 'down' },
    { pos: 17, team: 'Corinthians', pts: 12, pj: 12, v: 2, sg: -3, trend: 'none' },
    { pos: 18, team: 'Mirassol', pts: 9, pj: 11, v: 2, sg: -4, trend: 'down' },
    { pos: 19, team: 'Remo', pts: 8, pj: 12, v: 1, sg: -9, trend: 'up' },
    { pos: 20, team: 'Chapecoense', pts: 8, pj: 11, v: 1, sg: -11, trend: 'down' }
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

// MODO ESCURO (Restaurado)
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        toggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}

// BUSCA AO VIVO (API REAL)
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

    container.innerHTML = '<div class="loading">Sincronizando últimas do futebol...</div>';
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

function renderNews(news) {
    const container = document.getElementById('news-container');
    container.innerHTML = news.map(item => `
        <article class="feed-card" onclick="window.open('${item.link}', '_blank')">
            <div class="card-img"><img src="${item.thumbnail}" onerror="handleImgError(this)"></div>
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <span class="time">Publicado hoje às ${item.pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </article>
    `).join('');
    
    const items = document.querySelectorAll('.hero-item');
    news.slice(0, 3).forEach((n, i) => {
        if (items[i]) {
            items[i].querySelector('img').src = n.thumbnail;
            const h = items[i].querySelector('h1') || items[i].querySelector('h2');
            if (h) h.textContent = n.title;
            const tag = items[i].querySelector('.hero-tag');
            if (tag) tag.textContent = n.category;
            items[i].onclick = () => window.open(n.link, '_blank');
        }
    });
}

function renderStandings() {
    const side = document.getElementById('standingsBody');
    const full = document.getElementById('fullStandingsBody');
    if (side) {
        side.innerHTML = standings2026.slice(0, 8).map(s => `
            <tr>
                <td class="td-pos">${s.pos}<span class="pos-change ${s.trend}">${s.trend === 'up' ? '▲' : s.trend === 'down' ? '▼' : ''}</span></td>
                <td class="team-name">${s.team}</td>
                <td class="points">${s.pts}</td>
            </tr>
        `).join('');
    }
    if (full) {
        full.innerHTML = standings2026.map(s => `
            <tr>
                <td><strong>${s.pos}</strong></td>
                <td><strong>${s.team}</strong></td>
                <td><strong>${s.pts}</strong></td>
                <td>${s.pj}</td>
                <td>${s.v}</td>
                <td>${s.sg}</td>
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
    initTheme();
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
            link.classList.add('active');
            fetchNews(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    const modal = document.getElementById('tabelaModal');
    document.querySelector('.full-link').onclick = () => modal.style.display = "block";
    document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }
});
