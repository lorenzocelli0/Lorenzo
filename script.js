// Canais de notícias
const CATEGORY_FEEDS = {
    'inicio': [
        { name: 'GE', url: 'https://ge.globo.com/rss/ge/' },
        { name: 'Trivela', url: 'https://trivela.com.br/feed/' },
        { name: 'Gazeta', url: 'https://www.gazetaesportiva.com/feed/' }
    ],
    'brasileirao': [{ name: 'Brasileirão', url: 'https://ge.globo.com/rss/ge/futebol/brasileirao-serie-a/' }],
    'copa-do-brasil': [{ name: 'Copa do Brasil', url: 'https://ge.globo.com/rss/ge/futebol/copa-do-brasil/' }],
    'mercado': [{ name: 'Mercado', url: 'https://ge.globo.com/rss/ge/mercado-da-bola/' }],
    'selecao': [{ name: 'Seleção', url: 'https://ge.globo.com/rss/ge/selecao-brasileira/' }]
};

// Dados OFICIAIS Brasileirão 2026
const fullStandings2026 = [
    { pos: 1, team: 'Palmeiras', pts: 29, pj: 12, v: 9, e: 2, d: 1, sg: 12 },
    { pos: 2, team: 'Flamengo', pts: 23, pj: 11, v: 7, e: 2, d: 2, sg: 10 },
    { pos: 3, team: 'Fluminense', pts: 23, pj: 12, v: 7, e: 2, d: 3, sg: 6 },
    { pos: 4, team: 'São Paulo', pts: 20, pj: 12, v: 6, e: 2, d: 4, sg: 5 },
    { pos: 5, team: 'Bahia', pts: 20, pj: 11, v: 6, e: 2, d: 3, sg: 3 },
    { pos: 6, team: 'Athletico-PR', pts: 19, pj: 12, v: 6, e: 1, d: 5, sg: 3 },
    { pos: 7, team: 'Coritiba', pts: 19, pj: 12, v: 5, e: 4, d: 3, sg: 3 },
    { pos: 8, team: 'Bragantino', pts: 17, pj: 12, v: 5, e: 2, d: 5, sg: 1 },
    { pos: 9, team: 'Botafogo', pts: 16, pj: 11, v: 5, e: 1, d: 5, sg: 0 },
    { pos: 10, team: 'Vasco da Gama', pts: 16, pj: 12, v: 4, e: 4, d: 4, sg: 0 },
    { pos: 11, team: 'EC Vitória', pts: 15, pj: 11, v: 4, e: 3, d: 4, sg: -3 },
    { pos: 12, team: 'Atlético-MG', pts: 14, pj: 12, v: 4, e: 2, d: 6, sg: -1 },
    { pos: 13, team: 'Grêmio', pts: 13, pj: 12, v: 3, e: 4, d: 5, sg: -2 },
    { pos: 14, team: 'Fortaleza', pts: 13, pj: 12, v: 3, e: 4, d: 5, sg: -4 },
    { pos: 15, team: 'Cuiabá', pts: 12, pj: 11, v: 3, e: 3, d: 5, sg: -5 },
    { pos: 16, team: 'Ceará', pts: 12, pj: 12, v: 3, e: 3, d: 6, sg: -6 },
    { pos: 17, team: 'Corinthians', pts: 12, pj: 12, v: 2, e: 6, d: 4, sg: -3 },
    { pos: 18, team: 'Mirassol', pts: 9, pj: 11, v: 2, e: 3, d: 6, sg: -4 },
    { pos: 19, team: 'Remo', pts: 8, pj: 12, v: 1, e: 5, d: 6, sg: -9 },
    { pos: 20, team: 'Chapecoense', pts: 8, pj: 11, v: 1, e: 5, d: 5, sg: -11 }
];

// Banco de imagens de reserva ampliado (10 imagens variadas)
const fallbacks = [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551280857-2b9bbe52cfcd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511886929837-399a8a11bcac?q=80&w=800&auto=format&fit=crop'
];

let currentCategory = 'inicio';

// Função para escolher imagem baseada no título (garante variedade)
function getFallbackByTitle(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % fallbacks.length);
    return fallbacks[index];
}

function extractImage(item) {
    if (item.thumbnail && item.thumbnail !== '') return item.thumbnail;
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    const content = item.content || item.description || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return (imgMatch && imgMatch[1]) ? imgMatch[1] : getFallbackByTitle(item.title);
}

async function fetchNews(category = 'inicio') {
    const container = document.getElementById('news-container');
    const label = document.querySelector('.section-label');
    if (!container) return;

    const titles = { 'inicio': 'NOTÍCIAS EM TEMPO REAL', 'brasileirao': 'BRASILEIRÃO 2026', 'copa-do-brasil': 'COPA DO BRASIL', 'mercado': 'MERCADO DA BOLA', 'selecao': 'SELEÇÃO BRASILEIRA' };
    if (label) label.textContent = titles[category];

    container.innerHTML = '<div class="loading">Buscando notícias exclusivas...</div>';
    let allNews = [];
    const feeds = CATEGORY_FEEDS[category] || CATEGORY_FEEDS['inicio'];

    for (const feed of feeds) {
        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&t=${Date.now()}`);
            const data = await response.json();
            if (data.status === 'ok' && data.items) {
                const newsItems = data.items.map(item => ({
                    title: item.title, link: item.link, thumbnail: extractImage(item), category: feed.name,
                    pubDate: new Date(item.pubDate), desc: item.description.replace(/<[^>]*>?/gm, '').substring(0, 90) + '...'
                }));
                allNews = [...allNews, ...newsItems];
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
            <div class="card-img">
                <img src="${item.thumbnail}" onerror="this.src='${getFallbackByTitle(item.title)}'">
            </div>
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <span class="time">Publicado hoje às ${item.pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </article>
    `).join('');
    if (currentCategory === 'inicio') updateHero(news.slice(0, 3));
}

function updateHero(news) {
    const items = document.querySelectorAll('.hero-item');
    news.forEach((n, i) => {
        if (items[i]) {
            const img = items[i].querySelector('img');
            img.src = n.thumbnail;
            img.onerror = () => { img.src = getFallbackByTitle(n.title); };
            const title = items[i].querySelector('h1') || items[i].querySelector('h2');
            if (title) title.textContent = n.title;
            items[i].querySelector('.badge').textContent = n.category;
            items[i].onclick = () => window.open(n.link, '_blank');
        }
    });
}

function renderStandings() {
    const body = document.getElementById('standingsBody');
    const fullBody = document.getElementById('fullStandingsBody');
    if (body) {
        body.innerHTML = fullStandings2026.slice(0, 8).map(s => `
            <tr>
                <td><span style="color: #999; margin-right: 12px; font-weight: 800;">${s.pos}</span> <span class="team-name">${s.team}</span></td>
                <td class="points">${s.pts}</td>
            </tr>
        `).join('');
    }
    if (fullBody) {
        fullBody.innerHTML = fullStandings2026.map(s => `
            <tr>
                <td><strong>${s.pos}</strong></td>
                <td class="team-name">${s.team}</td>
                <td><strong>${s.pts}</strong></td>
                <td>${s.pj}</td>
                <td>${s.v}</td>
                <td>${s.e}</td>
                <td>${s.d}</td>
                <td>${s.sg}</td>
            </tr>
        `).join('');
    }
}

function renderMatches() {
    const container = document.getElementById('todayMatches');
    const matches = [{ competition: 'COPA DO BRASIL', time: '19:30', home: 'Grêmio', away: 'Confiança' }, { competition: 'COPA DO BRASIL', time: '21:30', home: 'Barra', away: 'Corinthians' }, { competition: 'COPA DO BRASIL', time: '21:30', home: 'Paysandu', away: 'Vasco' }];
    if (container) {
        container.innerHTML = matches.map(m => `
            <div class="match-item">
                <div class="match-info">${m.competition} • HOJE ${m.time}</div>
                <div class="match-teams"><span>${m.home}</span><span class="match-vs">VS</span><span>${m.away}</span></div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderStandings();
    renderMatches();
    fetchNews('inicio');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCategory = category;
            fetchNews(category);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    const modal = document.getElementById('tabelaModal');
    const btn = document.querySelector('.full-link');
    const span = document.querySelector('.close-modal');
    if (btn) btn.onclick = () => modal.style.display = "block";
    if (span) span.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }
});
