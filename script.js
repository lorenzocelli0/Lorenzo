const RSS_FEEDS = [
    { name: 'GE', url: 'https://ge.globo.com/rss/ge/' },
    { name: 'Trivela', url: 'https://trivela.com.br/feed/' },
    { name: 'Gazeta Esportiva', url: 'https://www.gazetaesportiva.com/feed/' }
];

async function fetchNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        let allNews = [];

        for (const feed of RSS_FEEDS) {
            // Usando rss2json para converter o feed para JSON (Grátis até 10k requests)
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=your_api_key_optional`);
            const data = await response.json();
            
            if (data.status === 'ok') {
                const newsItems = data.items.map(item => ({
                    title: item.title,
                    link: item.link,
                    thumbnail: item.thumbnail || item.enclosure.link || 'https://via.placeholder.com/300x200/001f3f/ffffff?text=FutNews',
                    category: feed.name,
                    pubDate: new Date(item.pubDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    desc: item.description.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'
                }));
                allNews = [...allNews, ...newsItems];
            }
        }

        // Embaralhar e pegar as 6 mais recentes
        allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        renderDynamicNews(allNews.slice(0, 8));

    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        container.innerHTML = '<div class="error">Não foi possível carregar as notícias. Tente novamente mais tarde.</div>';
    }
}

function renderDynamicNews(news) {
    const container = document.getElementById('news-container');
    container.innerHTML = news.map(item => `
        <article class="feed-card" onclick="window.open('${item.link}', '_blank')">
            <div class="card-img">
                <img src="${item.thumbnail}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200/001f3f/ffffff?text=FutNews'">
            </div>
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <span class="time">Publicado às ${item.pubDate}</span>
            </div>
        </article>
    `).join('');

    // Atualiza também os destaques do topo com as 3 primeiras
    updateHeroSection(news.slice(0, 3));
}

function updateHeroSection(heroNews) {
    const heroItems = document.querySelectorAll('.hero-item');
    heroNews.forEach((news, index) => {
        if (heroItems[index]) {
            const img = heroItems[index].querySelector('img');
            const h1 = heroItems[index].querySelector('h1') || heroItems[index].querySelector('h2');
            const badge = heroItems[index].querySelector('.badge');
            
            if (img) img.src = news.thumbnail;
            if (h1) h1.textContent = news.title;
            if (badge) badge.textContent = news.category;
            
            heroItems[index].onclick = () => window.open(news.link, '_blank');
        }
    });
}

// Manter as mecânicas de tabela e jogos
const standings = [
    { pos: 1, team: 'Flamengo', points: 28 },
    { pos: 2, team: 'Palmeiras', points: 26 },
    { pos: 3, team: 'Botafogo', points: 24 },
    { pos: 4, team: 'São Paulo', points: 22 },
    { pos: 5, team: 'Cruzeiro', points: 20 },
    { pos: 6, team: 'Bahia', points: 20 },
    { pos: 7, team: 'Athletico-PR', points: 19 },
    { pos: 8, team: 'Galo', points: 18 }
];

function renderStandings() {
    const body = document.getElementById('standingsBody');
    if (body) {
        body.innerHTML = standings.map(s => `
            <tr>
                <td><span style="color: #999; margin-right: 12px; font-weight: 800;">${s.pos}</span> <span class="team-name">${s.team}</span></td>
                <td class="points">${s.points}</td>
            </tr>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderStandings();
    fetchNews();
    // Atualizar a cada 10 minutos
    setInterval(fetchNews, 600000);
});
