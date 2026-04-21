const standings = [
    { pos: 1, team: 'Flamengo', points: 28 },
    { pos: 2, team: 'Palmeiras', points: 26 },
    { pos: 3, team: 'Botafogo', points: 24 },
    { pos: 4, team: 'São Paulo', points: 22 },
    { pos: 5, team: 'Bahia', points: 21 },
    { pos: 6, team: 'Cruzeiro', points: 20 },
    { pos: 7, team: 'Athletico-PR', points: 19 },
    { pos: 8, team: 'Bragantino', points: 18 }
];

const matches = [
    { competition: 'COPA DO BRASIL', time: '19:30', home: 'Grêmio', away: 'Confiança' },
    { competition: 'COPA DO BRASIL', time: '21:30', home: 'Barra', away: 'Corinthians' },
    { competition: 'COPA DO BRASIL', time: '21:30', home: 'Paysandu', away: 'Vasco' }
];

function renderStandings() {
    const body = document.getElementById('standingsBody');
    if (!body) return;
    
    body.innerHTML = standings.map(s => `
        <tr>
            <td><span style="color: #999; margin-right: 12px; font-weight: 800;">${s.pos}</span> <span class="team-name">${s.team}</span></td>
            <td class="points">${s.points}</td>
        </tr>
    `).join('');
}

function renderMatches() {
    const container = document.getElementById('todayMatches');
    if (!container) return;

    container.innerHTML = matches.map(m => `
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

document.addEventListener('DOMContentLoaded', () => {
    renderStandings();
    renderMatches();
});
