// Dados dos resultados
const allResults = {
    'Rodada 1': [
        ['Flamengo', '3x0', 'Vitória'], ['Palmeiras', '2x0', 'Cruzeiro'], ['Corinthians', '1x1', 'Grêmio'],
        ['São Paulo', '0x1', 'Fluminense'], ['Atlético-MG', '2x2', 'Botafogo'], ['Vasco', '2x1', 'Santos'],
        ['Bahia', '1x0', 'RB Bragantino'], ['Athletico-PR', '3x1', 'Coritiba'], ['Chapecoense', '0x0', 'Mirassol'], ['Remo', '1x2', 'Internacional']
    ],
    'Rodada 2': [
        ['São Paulo', '1x2', 'Palmeiras'], ['Atlético-MG', '2x2', 'Fluminense'], ['Vasco', '1x0', 'Santos'],
        ['Vitória', '1x0', 'Grêmio'], ['Internacional', '0x2', 'Flamengo'], ['Botafogo', '3x1', 'RB Bragantino'],
        ['Athletico-PR', '2x0', 'Coritiba'], ['Chapecoense', '1x1', 'Mirassol'], ['Remo', '0x1', 'Bahia'], ['Cruzeiro', '2x0', 'Corinthians']
    ],
    'Rodada 3': [
        ['Internacional', '0x1', 'Flamengo'], ['Botafogo', '3x2', 'RB Bragantino'], ['Athletico-PR', '2x1', 'Coritiba'],
        ['Palmeiras', '2x0', 'Chapecoense'], ['Bahia', '2x0', 'Remo'], ['São Paulo', '0x0', 'Corinthians'],
        ['Grêmio', '1x2', 'Fluminense'], ['Cruzeiro', '1x1', 'Vasco'], ['Santos', '3x0', 'Mirassol'], ['Atlético-MG', '0x0', 'Vitória']
    ],
    'Rodada 4': [
        ['Palmeiras', '4x1', 'Chapecoense'], ['Bahia', '2x0', 'Remo'], ['São Paulo', '0x0', 'Corinthians'],
        ['Grêmio', '1x2', 'Fluminense'], ['Cruzeiro', '1x1', 'Vasco'], ['Santos', '3x0', 'Mirassol'],
        ['Atlético-MG', '2x1', 'Vitória'], ['Flamengo', '2x0', 'Athletico-PR'], ['RB Bragantino', '1x1', 'Internacional'], ['Coritiba', '2x2', 'Botafogo']
    ],
    'Rodada 5': [
        ['Grêmio', '1x2', 'Fluminense'], ['Cruzeiro', '1x1', 'Vasco'], ['Santos', '3x0', 'Mirassol'],
        ['Atlético-MG', '2x1', 'Vitória'], ['Flamengo', '2x0', 'Athletico-PR'], ['RB Bragantino', '1x1', 'Internacional'],
        ['Coritiba', '2x2', 'Botafogo'], ['Palmeiras', '3x0', 'Bahia'], ['Vasco', '1x0', 'Chapecoense'], ['Corinthians', '0x1', 'Remo']
    ],
    'Rodada 6': [
        ['Flamengo', '1x1', 'Palmeiras'], ['Atlético-MG', '0x1', 'Cruzeiro'], ['Fluminense', '2x1', 'Corinthians'],
        ['Internacional', '3x0', 'Santos'], ['Botafogo', '2x0', 'Vasco'], ['Athletico-PR', '1x1', 'Bahia'],
        ['RB Bragantino', '3x0', 'Vitória'], ['Coritiba', '2x1', 'São Paulo'], ['Chapecoense', '0x0', 'Remo'], ['Mirassol', '1x2', 'Grêmio']
    ],
    'Rodada 7': [
        ['Fluminense', '2x0', 'Botafogo'], ['Corinthians', '0x2', 'Bahia'], ['Vasco', '3x1', 'Remo'],
        ['Santos', '1x1', 'Atlético-MG'], ['Grêmio', '0x0', 'Athletico-PR'], ['Vitória', '1x2', 'Palmeiras'],
        ['Cruzeiro', '3x1', 'Internacional'], ['São Paulo', '2x0', 'Chapecoense'], ['RB Bragantino', '1x1', 'Mirassol'], ['Coritiba', '0x2', 'Flamengo']
    ],
    'Rodada 8': [
        ['Palmeiras', '2x1', 'Santos'], ['Grêmio', '1x0', 'Internacional'], ['RB Bragantino', '2x2', 'São Paulo'],
        ['Bahia', '3x1', 'Atlético-MG'], ['Athletico-PR', '1x0', 'Vasco'], ['Botafogo', '2x1', 'Vitória'],
        ['Fluminense', '3x2', 'Cruzeiro'], ['Corinthians', '1x1', 'Coritiba'], ['Chapecoense', '0x2', 'Flamengo'], ['Remo', '1x0', 'Mirassol']
    ],
    'Rodada 9': [
        ['Athletico-PR', '0x0', 'Flamengo'], ['Coritiba', '1x0', 'Vitória'], ['Chapecoense', '1x1', 'Mirassol'],
        ['Atlético-MG', '1x2', 'Palmeiras'], ['Vasco', '2x2', 'RB Bragantino'], ['Santos', '1x0', 'Grêmio'],
        ['Internacional', '1x1', 'Fluminense'], ['Botafogo', '0x1', 'Corinthians'], ['Remo', '1x2', 'São Paulo'], ['Bahia', '0x2', 'Cruzeiro']
    ],
    'Rodada 10': [
        ['São Paulo', '2x1', 'Atlético-MG'], ['Botafogo', '4x4', 'Santos'], ['Cruzeiro', '0x2', 'Palmeiras'],
        ['Flamengo', '3x1', 'Corinthians'], ['RB Bragantino', '2x0', 'Grêmio'], ['Vitória', '1x0', 'Internacional'],
        ['Fluminense', '1x1', 'Athletico-PR'], ['Coritiba', '2x0', 'Chapecoense'], ['Mirassol', '1x1', 'Vasco'], ['Remo', '0x2', 'Bahia']
    ],
    'Rodada 11': [
        ['Vitória', '2x0', 'São Paulo'], ['Remo', '1x1', 'Vasco'], ['Mirassol', '1x2', 'Bahia'],
        ['Santos', '1x0', 'Atlético-MG'], ['Internacional', '0x0', 'Grêmio'], ['Athletico-PR', '2x0', 'Chapecoense'],
        ['Botafogo', '2x2', 'Coritiba'], ['Fluminense', '1x2', 'Flamengo'], ['Cruzeiro', '2x1', 'RB Bragantino'], ['Corinthians', '0x0', 'Palmeiras']
    ],
    'Rodada 12': [
        ['Vasco', '2x1', 'São Paulo'], ['Chapecoense', '1x4', 'Botafogo'], ['Vitória', '0x0', 'Corinthians'],
        ['Cruzeiro', '2x0', 'Grêmio'], ['Internacional', '1x2', 'Mirassol'], ['Coritiba', '2x0', 'Atlético-MG'],
        ['Santos', '2x3', 'Fluminense'], ['Palmeiras', '1x0', 'Athletico-PR'], ['RB Bragantino', '4x2', 'Remo'], ['Flamengo', '2x0', 'Bahia']
    ]
};

// Próximos jogos
const upcomingGames = [
    { home: 'Botafogo', away: 'Internacional', stadium: 'Nilton Santos' },
    { home: 'Remo', away: 'Cruzeiro', stadium: 'Baenão' },
    { home: 'Bahia', away: 'Santos', stadium: 'Fonte Nova' },
    { home: 'São Paulo', away: 'Mirassol', stadium: 'MorumBIS' },
    { home: 'Grêmio', away: 'Coritiba', stadium: 'Arena do Grêmio' },
    { home: 'Corinthians', away: 'Vasco', stadium: 'Neo Química Arena' },
    { home: 'RB Bragantino', away: 'Palmeiras', stadium: 'Bragança Paulista' },
    { home: 'Athletico-PR', away: 'Vitória', stadium: 'Ligga Arena' },
    { home: 'Atlético-MG', away: 'Flamengo', stadium: 'Arena MRV' },
    { home: 'Fluminense', away: 'Chapecoense', stadium: 'Maracanã' }
];

// Navegação
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const page = this.dataset.page;
        document.getElementById(page + '-page').classList.add('active');
        const titles = {
            'home': 'Brasileirão 2026',
            'stats': 'Classificação',
            'results': 'Resultados',
            'next': 'Próximos Jogos',
            'lab': 'Laboratório do Torcedor'
        };
        document.getElementById('page-title').textContent = titles[page];
    });
});

// Renderizar últimos resultados (Rodada 12)
function renderLastResults() {
    const container = document.getElementById('lastResults');
    const lastRound = allResults['Rodada 12'];
    container.innerHTML = lastRound.map(([home, score, away]) => 
        `<div class="result-card"><span class="team-name">${home}</span><span class="score">${score}</span><span class="team-name">${away}</span></div>`
    ).join('');
}

// Renderizar classificação
function renderStandings() {
    const teams = {};
    Object.values(allResults).forEach(round => {
        round.forEach(([home, score, away]) => {
            if (!teams[home]) teams[home] = { p: 0, j: 0, v: 0, e: 0, d: 0, sg: 0 };
            if (!teams[away]) teams[away] = { p: 0, j: 0, v: 0, e: 0, d: 0, sg: 0 };
            
            const [gh, ga] = score.split('x').map(Number);
            teams[home].j++; teams[away].j++;
            teams[home].sg += gh - ga; teams[away].sg += ga - gh;
            
            if (gh > ga) { teams[home].v++; teams[home].p += 3; teams[away].d++; }
            else if (gh < ga) { teams[away].v++; teams[away].p += 3; teams[home].d++; }
            else { teams[home].e++; teams[away].e++; teams[home].p++; teams[away].p++; }
        });
    });
    
    const sorted = Object.entries(teams).sort((a, b) => b[1].p - a[1].p || b[1].sg - a[1].sg);
    const tbody = document.querySelector('#standingsTable tbody');
    tbody.innerHTML = sorted.map(([name, s], i) => 
        `<tr><td class="pos">${i + 1}</td><td>${name}</td><td>${s.p}</td><td>${s.j}</td><td>${s.v}</td><td>${s.e}</td><td>${s.d}</td><td>${s.sg > 0 ? '+' : ''}${s.sg}</td></tr>`
    ).join('');
}

// Renderizar todas as rodadas
function renderRounds() {
    const container = document.getElementById('roundsContainer');
    container.innerHTML = Object.entries(allResults).map(([round, matches]) => `
        <div class="round-section">
            <h3 class="round-title">${round}</h3>
            <div class="round-matches">
                ${matches.map(([home, score, away]) => `<div class="match-row"><span>${home}</span><span class="score">${score}</span><span>${away}</span></div>`).join('')}
            </div>
        </div>
    `).join('');
}

// Renderizar próximos jogos
function renderUpcoming() {
    const container = document.getElementById('upcomingContainer');
    container.innerHTML = upcomingGames.map(game => `
        <div class="upcoming-card">
            <div class="team-name">${game.home}</div>
            <div class="vs">VS</div>
            <div class="team-name">${game.away}</div>
            <div class="stadium"><i class="fas fa-map-marker-alt"></i> ${game.stadium}</div>
        </div>
    `).join('');
}

// Medidor
let gaugeValue = 0;
setInterval(() => {
    gaugeValue = gaugeValue >= 100 ? 0 : gaugeValue + Math.random() * 10;
    document.getElementById('gaugeFill').style.height = gaugeValue + '%';
    document.getElementById('gaugeValue').textContent = Math.round(gaugeValue) + '%';
}, 2000);

// Criador de cards
document.getElementById('creatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('playerName').value;
    const team = document.getElementById('playerTeam').value;
    const goals = document.getElementById('playerGoals').value || 0;
    const assists = document.getElementById('playerAssists').value || 0;
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `<h3>${name}</h3><p style="color:#00d4ff">${team}</p><div class="player-stats"><span>${goals} Gols</span><span>${assists} Assist.</span></div>`;
    document.getElementById('customCards').prepend(card);
    this.reset();
});

// Inicializar
renderLastResults();
renderStandings();
renderRounds();
renderUpcoming();
