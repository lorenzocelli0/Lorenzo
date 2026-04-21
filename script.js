// Configuração de Feeds
const CATEGORY_FEEDS = {
    'inicio': [{ name: 'GE', url: 'https://ge.globo.com/rss/ge/' }, { name: 'Trivela', url: 'https://trivela.com.br/feed/' }],
    'brasileirao': [{ name: 'Brasileirão', url: 'https://ge.globo.com/rss/ge/futebol/brasileirao-serie-a/' }],
    'copa-do-brasil': [{ name: 'Copa do Brasil', url: 'https://ge.globo.com/rss/ge/futebol/copa-do-brasil/' }],
    'mercado': [{ name: 'Mercado', url: 'https://ge.globo.com/rss/ge/mercado-da-bola/' }],
    'selecao': [{ name: 'Seleção', url: 'https://ge.globo.com/rss/ge/selecao-brasileira/' }]
};

// Dados Tabela 2026
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

const footballFallbacks = [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop'
];

function handleImgError(img) {
    img.src = footballFallbacks[Math.floor(Math.random() * footballFallbacks.length)];
    img.onerror = null;
}

function extractImage(item) {
    if (item.thumbnail && item.thumbnail !== '') return item.thumbnail;
    const content = item.content || item.description || '';
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : footballFallbacks[Math.floor(Math.random() * footballFallbacks.length)];
}

// MODO ESCURO
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// DISQUS INTEGRATION
function loadDisqus(id, url, title) {
    const d = document, s = d.createElement('script');
    s.src = 'https://futnews-portal.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    
    window.disqus_config = function () {
        this.page.url = url;
        this.page.identifier = id;
        this.page.title = title;
    };
}

// RENDERIZAÇÃO
async function fetchNews(category = 'inicio') {
    const container = document.getElementById('news-container');
    const quickList = document.getElementById('quick-news-list');
    if (!container) return;

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
        renderQuickNews(allNews.slice(10, 18));
    }
}

function renderNews(news) {
    const container = document.getElementById('news-container');
    container.innerHTML = news.map(item => `
        <article class="feed-card" onclick="openNews('${item.link}', '${item.title}')">
            <div class="card-img"><img src="${item.thumbnail}" onerror="handleImgError(this)"></div>
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <span class="time">Publicado hoje</span>
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
            items[i].onclick = () => openNews(n.link, n.title);
        }
    });
}

function renderQuickNews(news) {
    const container = document.getElementById('quick-news-list');
    container.innerHTML = news.map(item => `
        <li class="quick-news-item" onclick="openNews('${item.link}', '${item.title}')">
            <span class="quick-news-text">${item.title}</span>
        </li>
    `).join('');
}

function openNews(link, title) {
    const modal = document.getElementById('tabelaModal');
    const content = document.getElementById('modal-content-area');
    content.innerHTML = `<h2 class="section-title">Notícia Completa</h2><p>Você está sendo redirecionado para a matéria original do portal parceiro.</p><a href="${link}" target="_blank" class="nav-link" style="color:var(--fn-blue-primary)">Clique aqui para ler no site oficial</a>`;
    modal.style.display = "block";
    loadDisqus(link, link, title);
}

function renderStandings() {
    const side = document.getElementById('standingsBody');
    if (side) {
        side.innerHTML = standings2026.map(s => `
            <tr>
                <td><span style="color: #999; font-weight: 800;">${s.pos}</span><span class="pos-change ${s.trend}">${s.trend === 'up' ? '▲' : s.trend === 'down' ? '▼' : ''}</span></td>
                <td class="team-name">${s.team}</td>
                <td class="points">${s.pts}</td>
                <td><div class="last-matches">${s.form.map(f => `<span class="match-dot ${f}"></span>`).join('')}</div></td>
            </tr>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderStandings();
    fetchNews('inicio');
    
    // Tema inicial
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    document.querySelectorAll('[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            fetchNews(tab);
        });
    });

    const modal = document.getElementById('tabelaModal');
    document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
});
