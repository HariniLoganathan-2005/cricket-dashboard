// ===== MAIN APPLICATION — ENHANCED CRICKET DASHBOARD =====

const App = {
  mode: 'replay',
  liveState: null,

  init() {
    this.bindModeToggle();
    this.populateMatchSelector();
    this.populateComparisonSelectors();
    this.populateH2HSelectors();
    Interactions.initAll();
    this.switchMode('replay');

    const firstMatch = HISTORICAL_MATCHES[0];
    if (firstMatch) {
      document.getElementById('matchSelect').value = firstMatch.id;
      this.loadReplayMatch(firstMatch.id);
    }
  },

  // ── Mode Toggle ──
  bindModeToggle() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
    });
  },

  switchMode(mode) {
    this.mode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    document.getElementById('liveSection').classList.toggle('hidden', mode !== 'live');
    document.getElementById('replaySection').classList.toggle('hidden', mode !== 'replay');

    if (mode !== 'live') {
      LiveMatch.stop();
      this.updateLiveBadge(false);
    }

    if (mode === 'live') {
      this.startLiveMode();
    } else {
      const sel = document.getElementById('matchSelect');
      if (sel && sel.value) this.loadReplayMatch(sel.value);
    }
  },

  // ── LIVE MODE ──
  startLiveMode() {
    this.updateLiveBadge(true);
    const match = LiveMatch.getRandomMatch();
    this.updateMatchInfo(match, true);

    LiveMatch.start(match, (state, isComplete) => {
      if (!state) return;
      this.renderLiveState(state, isComplete);
    });
  },

  renderLiveState(state, isComplete) {
    if (!state) return;
    const match = state.match;
    const inn1 = match.innings[0];

    // Scoreboard
    const teamAName = document.getElementById('liveTeamAName');
    const teamBName = document.getElementById('liveTeamBName');
    const teamAScore = document.getElementById('liveTeamAScore');
    const teamBScore = document.getElementById('liveTeamBScore');
    const teamAOvers = document.getElementById('liveTeamAOvers');
    const teamBOvers = document.getElementById('liveTeamBOvers');
    const statusText = document.getElementById('liveStatusText');

    if (state.inningsIndex === 0) {
      teamAName.textContent = state.battingTeam;
      teamAScore.textContent = state.totalRuns + '/' + state.totalWickets;
      teamAScore.classList.add('score-roll');
      setTimeout(() => teamAScore.classList.remove('score-roll'), 400);
      teamAOvers.textContent = '(' + state.currentOver + ' ov)';
      teamBName.textContent = state.bowlingTeam;
      teamBScore.textContent = '—';
      teamBOvers.textContent = '';
      statusText.textContent = state.battingTeam + ' batting';
    } else {
      teamAName.textContent = inn1.batting;
      teamAScore.textContent = inn1.totalRuns + '/' + inn1.totalWickets;
      teamAOvers.textContent = '(' + inn1.overs.length + ' ov)';
      teamBName.textContent = state.battingTeam;
      teamBScore.textContent = state.totalRuns + '/' + state.totalWickets;
      teamBScore.classList.add('score-roll');
      setTimeout(() => teamBScore.classList.remove('score-roll'), 400);
      teamBOvers.textContent = '(' + state.currentOver + ' ov)';
      statusText.textContent = state.battingTeam + ' need ' + Math.max(0, state.target - state.totalRuns) + ' off ' + (state.oversLeft * 6) + ' balls';
    }

    // Stats cards
    document.getElementById('liveCRR').textContent = state.crr.toFixed(2);
    document.getElementById('liveRRR').textContent = state.inningsIndex === 1 ? state.rrr.toFixed(2) : '—';
    document.getElementById('liveTarget').textContent = state.target ? state.target : '—';

    // Win probability bar
    if (state.inningsIndex === 1) {
      document.getElementById('liveWinProbWrap').classList.remove('hidden');
      const probA = 100 - state.winProb;
      const probB = state.winProb;
      document.getElementById('liveWinFillA').style.width = probA + '%';
      document.getElementById('liveWinFillA').textContent = probA + '%';
      document.getElementById('liveWinFillB').style.width = probB + '%';
      document.getElementById('liveWinFillB').textContent = probB + '%';
      document.getElementById('liveWinLabelA').textContent = inn1.batting;
      document.getElementById('liveWinLabelB').textContent = state.battingTeam;
    } else {
      document.getElementById('liveWinProbWrap').classList.add('hidden');
    }

    // Pressure 
    document.getElementById('livePressureFill').style.width = state.pressure + '%';
    document.getElementById('livePressureVal').textContent = state.pressure;

    // Over progression chart
    if (state.inningsIndex === 0) {
      ChartFactory.createManhattan('liveOverChart', state.deliveredOvers, state.battingTeam);
    } else {
      ChartFactory.createOverProgression('liveOverChart', inn1.overs, state.deliveredOvers, inn1.batting, state.battingTeam);
    }

    // Phase stats
    this.renderPhaseCards('livePhaseGrid', state.phaseStats);

    // Live commentary
    Commentary.renderCommentary('liveCommentaryFeed', state.commentary || []);

    // Momentum
    Interactions.renderMomentum('liveMomentum', state.deliveredOvers, state.battingTeam);

    if (isComplete) {
      statusText.textContent = match.result;
      statusText.style.color = 'var(--green)';
      this.updateLiveBadge(false);
    }
  },

  updateLiveBadge(show) {
    const badge = document.getElementById('liveBadge');
    if (badge) badge.classList.toggle('hidden', !show);
  },

  // ── REPLAY MODE ──
  populateMatchSelector() {
    const select = document.getElementById('matchSelect');
    if (!select) return;
    select.innerHTML = '';
    HISTORICAL_MATCHES.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.title + ' — ' + m.subtitle + ' [' + m.format + ']';
      select.appendChild(opt);
    });
    select.addEventListener('change', () => this.loadReplayMatch(select.value));
  },

  loadReplayMatch(matchId) {
    const match = MatchReplay.loadMatch(matchId);
    if (!match) return;
    this.updateMatchInfo(match, false);
    this.buildInningsTabs(match);
    this.renderReplayInnings(0);
  },

  buildInningsTabs(match) {
    const container = document.getElementById('inningsTabs');
    if (!container) return;
    container.innerHTML = '';
    match.innings.forEach((inn, idx) => {
      const btn = document.createElement('button');
      btn.className = 'innings-tab' + (idx === 0 ? ' active' : '');
      btn.textContent = inn.batting + ' Innings';
      btn.addEventListener('click', () => {
        container.querySelectorAll('.innings-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        MatchReplay.selectInnings(idx);
        this.renderReplayInnings(idx);
      });
      container.appendChild(btn);
    });
  },

  renderReplayInnings(inningsIdx) {
    MatchReplay.selectInnings(inningsIdx);
    const analysis = MatchReplay.getAnalysis();
    const comparison = MatchReplay.getComparisonData();
    if (!analysis) return;

    const match = analysis.match;
    const inn = analysis.innings;

    // Scoreboard
    if (match.innings.length >= 2) {
      const inn1 = match.innings[0];
      const inn2 = match.innings[1];
      document.getElementById('replayTeamAName').textContent = inn1.batting;
      document.getElementById('replayTeamAScore').textContent = inn1.totalRuns + '/' + inn1.totalWickets;
      document.getElementById('replayTeamAOvers').textContent = '(' + inn1.overs.length + ' ov)';
      document.getElementById('replayTeamBName').textContent = inn2.batting;
      document.getElementById('replayTeamBScore').textContent = inn2.totalRuns + '/' + inn2.totalWickets;
      document.getElementById('replayTeamBOvers').textContent = '(' + inn2.overs.length + ' ov)';
    }
    document.getElementById('replayStatusText').textContent = match.result;

    // Stats
    document.getElementById('replayCRR').textContent = analysis.crr.toFixed(2);

    if (comparison) {
      const winner = match.tpiWinner;
      const teamAIsWinner = (winner === match.teams.a || winner === match.innings[0].batting);
      document.getElementById('replayWinProb').textContent = teamAIsWinner ? match.innings[0].batting : match.innings[1].batting;
      document.getElementById('replayWinFillA').style.width = (teamAIsWinner ? 100 : 0) + '%';
      document.getElementById('replayWinFillA').textContent = teamAIsWinner ? 'WON' : '';
      document.getElementById('replayWinFillB').style.width = (teamAIsWinner ? 0 : 100) + '%';
      document.getElementById('replayWinFillB').textContent = teamAIsWinner ? '' : 'WON';
      document.getElementById('replayWinLabelA').textContent = match.innings[0].batting;
      document.getElementById('replayWinLabelB').textContent = match.innings[1].batting;
    }

    // Charts
    if (comparison) {
      ChartFactory.createOverProgression('replayOverChart', comparison.innings1.overs, comparison.innings2.overs, comparison.innings1.team, comparison.innings2.team);
      if (analysis.winProbTrend) {
        ChartFactory.createWinProbTrend('replayWinProbChart', match.innings[1].overs, comparison.target, comparison.totalOvers, match.innings[1].batting, match.innings[0].batting);
      }
      ChartFactory.createPhaseChart('replayPhaseChart', comparison.innings1.phaseStats, comparison.innings2.phaseStats, comparison.innings1.team, comparison.innings2.team);
    }

    ChartFactory.createManhattan('replayManhattanChart', inn.overs, inn.batting);
    ChartFactory.createScoringBreakdown('replayScoringChart', inn.overs);

    // Phase cards
    this.renderPhaseCards('replayPhaseGrid', analysis.phaseStats);

    // Wicket timeline
    this.renderWicketTimeline('replayWicketTimeline', inn.overs);

    // Pressure
    document.getElementById('replayPressureFill').style.width = analysis.pressure + '%';
    document.getElementById('replayPressureVal').textContent = analysis.pressure;

    // Player stats
    this.renderBattingTable('replayBatTable', analysis.playerStats.batsmen);
    this.renderBowlingTable('replayBowlTable', analysis.playerStats.bowlers);
    this.renderPressureMoments('replayPressureMoments', analysis.pressureMoments);

    // ── ENHANCED FEATURES ──

    // Commentary
    const comments = Commentary.generateMatchCommentary(inn, match);
    Commentary.renderCommentary('replayCommentaryFeed', comments);

    // Wagon Wheel
    Interactions.renderWagonWheel('replayWagonWheel', inn.overs);

    // Momentum
    Interactions.renderMomentum('replayMomentum', inn.overs, inn.batting);

    // Partnership Tracker
    Interactions.renderPartnerships('replayPartnerships', inn);

    // Replay Slider
    Interactions.setSliderMax(inn.overs.length);



    // What-If
    Interactions.updateWhatIf();
  },



  // ── Match Comparison ──
  populateComparisonSelectors() {
    const sel1 = document.getElementById('compMatch1');
    const sel2 = document.getElementById('compMatch2');
    if (!sel1 || !sel2) return;

    HISTORICAL_MATCHES.forEach((m, i) => {
      sel1.innerHTML += `<option value="${i}" ${i === 0 ? 'selected' : ''}>${m.title} (${m.format})</option>`;
      sel2.innerHTML += `<option value="${i}" ${i === 1 ? 'selected' : ''}>${m.title} (${m.format})</option>`;
    });

    const render = () => {
      const m1 = HISTORICAL_MATCHES[parseInt(sel1.value)];
      const m2 = HISTORICAL_MATCHES[parseInt(sel2.value)];
      Interactions.renderMatchComparison('compColumn1', 'compColumn2', m1, m2);
    };

    sel1.onchange = render;
    sel2.onchange = render;
    render();
  },

  // ── Common Renderers ──
  updateMatchInfo(match, isLive) {
    const section = isLive ? 'live' : 'replay';
    const titleEl = document.getElementById(section + 'MatchTitle');
    const metaEl = document.getElementById(section + 'MatchMeta');
    const badgeEl = document.getElementById(section + 'FormatBadge');
    if (titleEl) titleEl.textContent = match.title;
    if (metaEl) metaEl.textContent = match.venue + ' • ' + match.date;
    if (badgeEl) {
      badgeEl.textContent = match.format;
      badgeEl.className = 'match-format-badge format-' + match.format.toLowerCase();
    }
  },

  renderPhaseCards(containerId, phases) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    const phaseData = [
      { key: 'powerplay', name: 'Powerplay', cls: 'pp', icon: '⚡' },
      { key: 'middle', name: 'Middle', cls: 'mid', icon: '🎯' },
      { key: 'death', name: 'Death', cls: 'death', icon: '🔥' }
    ];
    grid.innerHTML = phaseData.map(p => {
      const d = phases[p.key];
      return `<div class="phase-card">
        <div class="phase-name ${p.cls}">${p.icon} ${p.name}</div>
        <div class="phase-runs">${d.runs}/${d.wickets}</div>
        <div class="phase-detail">RR: ${d.runRate} • ${d.boundaries} boundaries</div>
      </div>`;
    }).join('');
  },

  renderWicketTimeline(containerId, oversData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const maxRuns = Math.max(...oversData.map(o => o.runs), 1);
    container.innerHTML = oversData.map(o => {
      const height = Math.max(4, (o.runs / maxRuns) * 100);
      const hasWicket = o.wickets > 0;
      const color = hasWicket ? 'var(--red)' : (o.runs >= 10 ? 'var(--green)' : (o.runs >= 6 ? 'var(--cyan)' : 'rgba(0,240,255,0.3)'));
      return `<div class="over-bar ${hasWicket ? 'wicket' : ''}" style="height:${height}%;background:${color}" title="Over ${o.over}: ${o.runs} runs${hasWicket ? ', ' + o.wickets + ' wkt' : ''}"></div>`;
    }).join('');
  },

  renderBattingTable(tableId, batsmen) {
    const tbody = document.querySelector('#' + tableId + ' tbody');
    if (!tbody) return;
    tbody.innerHTML = batsmen.map(b => `<tr>
      <td class="player-name">${b.name}</td><td>${b.runs}</td><td>${b.balls}</td>
      <td>${b.fours}</td><td>${b.sixes}</td>
      <td class="${b.strikeRate >= 150 ? 'highlight' : ''}">${b.strikeRate}</td>
    </tr>`).join('');
  },

  renderBowlingTable(tableId, bowlers) {
    const tbody = document.querySelector('#' + tableId + ' tbody');
    if (!tbody) return;
    tbody.innerHTML = bowlers.map(b => `<tr>
      <td class="player-name">${b.name}</td><td>${b.overs}</td><td>${b.runs}</td>
      <td>${b.wickets}</td>
      <td class="${b.economy <= 6 ? 'highlight' : ''}">${b.economy}</td>
    </tr>`).join('');
  },

  renderPressureMoments(containerId, moments) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (moments.length === 0) {
      container.innerHTML = '<p style="color:var(--text-dim);font-size:0.82rem;">No major pressure moments detected.</p>';
      return;
    }
    container.innerHTML = moments.slice(0, 6).map(m => {
      let icon, text;
      switch (m.type) {
        case 'dot_pressure': icon = '🔴'; text = `${m.dots} consecutive dots (Over ${m.over})`; break;
        case 'double_strike': icon = '💀'; text = `Double strike in Over ${m.over}`; break;
        case 'wicket_maiden': icon = '🎯'; text = `Wicket maiden — Over ${m.over}`; break;
        default: icon = '⚡'; text = `Pressure in Over ${m.over}`;
      }
      return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:0.82rem;color:var(--text-secondary);">
        <span>${icon}</span><span>${text}</span></div>`;
    }).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
