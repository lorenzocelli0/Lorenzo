// Canais de notícias (Dinâmicos)
const RSS_FEEDS = [
    { name: 'GE', url: 'https://ge.globo.com/rss/ge/' },
    { name: 'Trivela', url: 'https://trivela.com.br/feed/' },
    { name: 'Gazeta Esportiva', url: 'https://www.gazetaesportiva.com/feed/' }
];

// Tabela OFICIAL Brasileirão 2026 (Conforme sua imagem)
const standings2026 = [
    { pos: 1, team: 'Palmeiras', points: 29 },
    { pos: 2, team: 'Flamengo', points: 23 },
    { pos: 3, team: 'Fluminense', points: 23 },
    { pos: 4, team: 'São Paulo', points: 20 },
    { pos: 5, team: 'Bahia', points: 20 },
    { pos: 6, team: 'Athletico-PR', points: 19 },
    { pos: 7, team: 'Coritiba', points: 19 },
    { pos: 8, team: 'Bragantino', points: 17 }
];

// Jogos de Hoje (Simulados 2026)
const todayMatches = [
    { competition: 'COPA DO BRASIL', time: '19:30', home: 'Grêmio', away: 'Confiança' },
    { competition: 'COPA DO BRASIL', time: '21:30', home: 'Barra', away: 'Corinthians' },
    { competition: 'COPA DO BRASIL', time: '21:30', home: 'Paysandu', away: 'Vasco' }
];

// Banco de imagens de reserva (Caso a notícia venha sem foto)
const fallbacks = [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop'
];

function extractImage(item, index) {
    if (item.thumbnail && item.thumbnail !== '') return item.thumbnail;
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    
    const content = item.content || item.description || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];
    
    // Se não achar nada, usa uma do banco de reserva rotativo
    return fallbacks[index % fallbacks.length];
}

async function fetchNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    let allNews = [];
    for (const feed of RSS_FEEDS) {
        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&t=${Date.now()}`);
            const data = await response.json();
            if (data.status === 'ok' && data.items) {
                const newsItems = data.items.map((item, idx) => ({
                    title: item.title,
                    link: item.link,
                    thumbnail: extractImage(item, idx),
                    category: feed.name,
                    pubDate: new Date(item.pubDate),
                    desc: item.description.replace(/<[^>]*>?/gm, '').substring(0, 90) + '...'
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
            <div class="card-img"><img src="${item.thumbnail}" onerror="this.src='${fallbacks[0]}'"></div>
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <span class="time">Hoje às ${item.pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </article>
    `).join('');
    updateHero(news.slice(0, 3));
}

function updateHero(news) {
    const items = document.querySelectorAll('.hero-item');
    news.forEach((n, i) => {
        if (items[i]) {
            const img = items[i].querySelector('img');
            img.src = n.thumbnail;
            img.onerror = () => { img.src = fallbacks[i]; };
            const title = items[i].querySelector('h1') || items[i].querySelector('h2');
            if (title) title.textContent = n.title;
            items[i].querySelector('.badge').textContent = n.category;
            items[i].onclick = () => window.open(n.link, '_blank');
        }
    });
}

function renderStandings() {
    const body = document.getElementById('standingsBody');
    if (body) {
        body.innerHTML = standings2026.map(s => `
            <tr>
                <td><span style="color: #999; margin-right: 12px; font-weight: 800;">${s.pos}</span> <span class="team-name">${s.team}</span></td>
                <td class="points">${s.points}</td>
            </tr>
        `).join('');
    }
}

function renderMatches() {
    const container = document.getElementById('todayMatches');
    if (container) {
        container.innerHTML = todayMatches.map(m => `
            <div class="match-item">
                <div class="match-info">${m.competition} • HOJE ${m.time}</div>
                <div class="match-teams">
                    <span>${m.home}</span>
                    <span class="match-vs">VS</span>
                    <span>${m.away}</span>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderStandings();
    renderMatches();
    fetchNews();
});
