// Canais de notícias (Dinâmicos)
const RSS_FEEDS = [
    { name: 'GE', url: 'https://ge.globo.com/rss/ge/' },
    { name: 'Trivela', url: 'https://trivela.com.br/feed/' },
    { name: 'Gazeta Esportiva', url: 'https://www.gazetaesportiva.com/feed/' }
];

// Dados do Brasileirão 2026 (Simulados conforme o seu projeto)
const standings2026 = [
    { pos: 1, team: 'Flamengo', points: 28 },
    { pos: 2, team: 'Palmeiras', points: 26 },
    { pos: 3, team: 'Botafogo', points: 24 },
    { pos: 4, team: 'São Paulo', points: 22 },
    { pos: 5, team: 'Bahia', points: 21 },
    { pos: 6, team: 'Cruzeiro', points: 20 },
    { pos: 7, team: 'Athletico-PR', points: 19 },
    { pos: 8, team: 'RB Bragantino', points: 18 }
];

// Jogos de Hoje (Copa do Brasil 2026)
const todayMatches = [
    { competition: 'COPA DO BRASIL', time: '19:30', home: 'Grêmio', away: 'Confiança' },
    { competition: 'COPA DO BRASIL', time: '21:30', home: 'Barra', away: 'Corinthians' },
    { competition: 'COPA DO BRASIL', time: '21:30', home: 'Paysandu', away: 'Vasco' }
];

// --- Lógica de Notícias ---
function extractImage(item) {
    if (item.thumbnail) return item.thumbnail;
    const content = item.content || item.description || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];
    return `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop`; 
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
                const newsItems = data.items.map(item => ({
                    title: item.title,
                    link: item.link,
                    thumbnail: extractImage(item),
                    category: feed.name,
                    pubDate: new Date(item.pubDate),
                    desc: item.description.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'
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
            <div class="card-img"><img src="${item.thumbnail}" loading="lazy"></div>
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <span class="time">Publicado hoje às ${item.pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </article>
    `).join('');
    updateHero(news.slice(0, 3));
}

function updateHero(news) {
    const items = document.querySelectorAll('.hero-item');
    news.forEach((n, i) => {
        if (items[i]) {
            items[i].querySelector('img').src = n.thumbnail;
            const title = items[i].querySelector('h1') || items[i].querySelector('h2');
            if (title) title.textContent = n.title;
            items[i].querySelector('.badge').textContent = n.category;
            items[i].onclick = () => window.open(n.link, '_blank');
        }
    });
}

// --- Lógica de Tabela e Jogos ---
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
