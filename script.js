const RSS_FEEDS = [
    { name: 'GE', url: 'https://ge.globo.com/rss/ge/' },
    { name: 'Trivela', url: 'https://trivela.com.br/feed/' },
    { name: 'Gazeta Esportiva', url: 'https://www.gazetaesportiva.com/feed/' }
];

// Extração de imagem aprimorada
function extractImage(item) {
    if (item.thumbnail) return item.thumbnail;
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
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
                const newsItems = data.items.map(item => {
                    const img = extractImage(item);
                    return {
                        title: item.title,
                        link: item.link,
                        thumbnail: img,
                        category: feed.name,
                        pubDate: new Date(item.pubDate),
                        desc: item.description.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'
                    };
                });
                allNews = [...allNews, ...newsItems];
            }
        } catch (error) { console.warn(`Erro feed ${feed.name}:`, error); }
    }
    if (allNews.length > 0) {
        allNews.sort((a, b) => b.pubDate - a.pubDate);
        renderDynamicNews(allNews.slice(0, 10));
    }
}

function renderDynamicNews(news) {
    const container = document.getElementById('news-container');
    container.innerHTML = news.map(item => `
        <article class="feed-card" onclick="window.open('${item.link}', '_blank')">
            <div class="card-img">
                <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop'">
            </div>
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <span class="time">Hoje às ${item.pubDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </article>
    `).join('');
    updateHeroSection(news.slice(0, 3));
}

function updateHeroSection(heroNews) {
    const heroItems = document.querySelectorAll('.hero-item');
    heroNews.forEach((news, index) => {
        if (heroItems[index]) {
            const img = heroItems[index].querySelector('img');
            const title = heroItems[index].querySelector('h1') || heroItems[index].querySelector('h2');
            const badge = heroItems[index].querySelector('.badge');
            if (img) img.src = news.thumbnail;
            if (title) title.textContent = news.title;
            if (badge) badge.textContent = news.category;
            heroItems[index].onclick = () => window.open(news.link, '_blank');
        }
    });
}

// BUSCA DE CLASSIFICAÇÃO REAL (API)
async function fetchStandings() {
    const body = document.getElementById('standingsBody');
    if (!body) return;

    try {
        // Usando a API gratuita do TheSportsDB para o Brasileirão (Série A ID: 4351)
        const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4351&s=2024');
        const data = await response.json();

        if (data.table) {
            // Pegar apenas os top 8 para o widget da sidebar
            const top8 = data.table.slice(0, 8);
            body.innerHTML = top8.map((s, index) => `
                <tr>
                    <td><span style="color: #999; margin-right: 12px; font-weight: 800;">${index + 1}</span> <span class="team-name">${s.strTeam}</span></td>
                    <td class="points">${s.intPoints}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao buscar classificação:', error);
        body.innerHTML = '<tr><td colspan="2">Erro ao carregar tabela</td></tr>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchStandings();
    fetchNews();
});
