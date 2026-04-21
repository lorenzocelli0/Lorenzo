const RSS_FEEDS = [
    { name: 'GE', url: 'https://ge.globo.com/rss/ge/' },
    { name: 'Trivela', url: 'https://trivela.com.br/feed/' },
    { name: 'Gazeta Esportiva', url: 'https://www.gazetaesportiva.com/feed/' }
];

// Função para extrair imagem do HTML caso o feed não forneça campo direto
function extractImage(item) {
    if (item.thumbnail) return item.thumbnail;
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    
    // Tenta buscar no conteúdo (comum no GE e Trivela)
    const content = item.content || item.description || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];
    
    // Fallback: Imagem padrão FutNews com base na categoria
    return `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop`; 
}

async function fetchNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    let allNews = [];

    for (const feed of RSS_FEEDS) {
        try {
            // Usando o serviço rss2json com um timestamp para evitar cache
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
        } catch (error) {
            console.warn(`Erro ao carregar feed ${feed.name}:`, error);
        }
    }

    if (allNews.length > 0) {
        // Ordenar por data (mais recentes primeiro)
        allNews.sort((a, b) => b.pubDate - a.pubDate);
        renderDynamicNews(allNews.slice(0, 10));
    } else {
        container.innerHTML = '<div class="error">Nenhuma notícia encontrada no momento.</div>';
    }
}

function renderDynamicNews(news) {
    const container = document.getElementById('news-container');
    if (!container) return;

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
            const titleElement = heroItems[index].querySelector('h1') || heroItems[index].querySelector('h2');
            const badge = heroItems[index].querySelector('.badge');
            
            if (img) {
                img.src = news.thumbnail;
                img.style.opacity = "1";
            }
            if (titleElement) titleElement.textContent = news.title;
            if (badge) badge.textContent = news.category;
            
            heroItems[index].onclick = () => window.open(news.link, '_blank');
        }
    });
}

// Mecânica de Tabela
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
    setInterval(fetchNews, 300000); // Atualiza a cada 5 minutos
});
