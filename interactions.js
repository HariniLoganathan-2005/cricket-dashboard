// ===== INTERACTIONS: Replay Slider, What-If, Keyboard, Export, Theme, Comparison =====

const Interactions = {

  // ═══ REPLAY SLIDER ═══
  sliderAnimating: false,
  sliderInterval: null,

  initReplaySlider() {
    const slider = document.getElementById('replaySlider');
    if (!slider) return;

    slider.addEventListener('input', () => {
      const overNum = parseInt(slider.value);
      document.getElementById('sliderOverDisplay').textContent = 'Over ' + overNum;
      this.renderAtOver(overNum);
    });

    const playBtn = document.getElementById('sliderPlayBtn');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.toggleSliderPlay());
    }
  },

  setSliderMax(totalOvers) {
    const slider = document.getElementById('replaySlider');
    if (slider) {
      slider.max = totalOvers;
      slider.value = totalOvers;
      document.getElementById('sliderOverDisplay').textContent = 'Over ' + totalOvers;
    }
  },

  renderAtOver(overNum) {
    const analysis = MatchReplay.getAnalysis();
    if (!analysis) return;

    const match = analysis.match;
    const inn = analysis.innings;
    const format = match.format;

    // Slice overs up to the selected over
    const slicedOvers = inn.overs.slice(0, overNum);
    const totalRuns = slicedOvers.reduce((s, o) => s + o.runs, 0);
    const totalWickets = slicedOvers.reduce((s, o) => s + o.wickets, 0);

    let totalOversInFormat = format === 'T20' ? 20 : format === 'ODI' ? 50 : 90;

    // Update scoreboard for the selected innings at this point
    const inningsIdx = analysis.inningsIndex;
    const scoreEl = document.getElementById(inningsIdx === 0 ? 'replayTeamAScore' : 'replayTeamBScore');
    const oversEl = document.getElementById(inningsIdx === 0 ? 'replayTeamAOvers' : 'replayTeamBOvers');
    if (scoreEl) scoreEl.textContent = totalRuns + '/' + totalWickets;
    if (oversEl) oversEl.textContent = '(' + overNum + ' ov)';

    // Update CRR
    const crr = CricketAnalytics.calcRunRate(totalRuns, overNum);
    document.getElementById('replayCRR').textContent = crr.toFixed(2);

    // Update charts with sliced data
    ChartFactory.createManhattan('replayManhattanChart', slicedOvers, inn.batting);

    // Phase stats at this point
    const phaseStats = CricketAnalytics.getPhaseStats(slicedOvers, format);
    App.renderPhaseCards('replayPhaseGrid', phaseStats);

    // Wicket timeline
    App.renderWicketTimeline('replayWicketTimeline', slicedOvers);

    // Heatmap
    this.renderHeatmap('replayHeatmap', slicedOvers);

    // Pressure
    const target = inningsIdx === 1 ? match.innings[0].totalRuns + 1 : 200;
    const pressure = CricketAnalytics.calcPressureIndex(slicedOvers, target, totalWickets, overNum, totalOversInFormat);
    document.getElementById('replayPressureFill').style.width = pressure + '%';
    document.getElementById('replayPressureVal').textContent = pressure;

    Effects.playSound('tick');
  },

  toggleSliderPlay() {
    const playBtn = document.getElementById('sliderPlayBtn');
    if (this.sliderAnimating) {
      clearInterval(this.sliderInterval);
      this.sliderAnimating = false;
      if (playBtn) playBtn.textContent = '▶';
      return;
    }

    const slider = document.getElementById('replaySlider');
    if (!slider) return;

    slider.value = 0;
    this.sliderAnimating = true;
    if (playBtn) playBtn.textContent = '⏸';

    this.sliderInterval = setInterval(() => {
      let val = parseInt(slider.value) + 1;
      if (val > parseInt(slider.max)) {
        clearInterval(this.sliderInterval);
        this.sliderAnimating = false;
        if (playBtn) playBtn.textContent = '▶';
        return;
      }
      slider.value = val;
      document.getElementById('sliderOverDisplay').textContent = 'Over ' + val;
      this.renderAtOver(val);
    }, 600);
  },

  // ═══ WHAT-IF SIMULATOR ═══
  initWhatIf() {
    ['whatifWickets', 'whatifExtras', 'whatifRunRate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updateWhatIf());
      }
    });
  },

  updateWhatIf() {
    const analysis = MatchReplay.getAnalysis();
    if (!analysis || analysis.inningsIndex !== 1) {
      const result = document.getElementById('whatifResult');
      if (result) result.innerHTML = '<p style="color:var(--text-dim);font-size:0.82rem;">Switch to 2nd innings to use What-If simulator.</p>';
      return;
    }

    const match = analysis.match;
    const inn = analysis.innings;
    const format = match.format;
    const totalOvers = format === 'T20' ? 20 : format === 'ODI' ? 50 : 90;
    const target = match.innings[0].totalRuns + 1;

    const wicketDelta = parseInt(document.getElementById('whatifWickets')?.value || 0);
    const extraRuns = parseInt(document.getElementById('whatifExtras')?.value || 0);
    const rrDelta = parseFloat(document.getElementById('whatifRunRate')?.value || 0);

    // Display current values
    const wv = document.getElementById('whatifWicketsVal');
    const ev = document.getElementById('whatifExtrasVal');
    const rv = document.getElementById('whatifRunRateVal');
    if (wv) wv.textContent = (wicketDelta >= 0 ? '+' : '') + wicketDelta + ' wickets';
    if (ev) ev.textContent = '+' + extraRuns + ' runs';
    if (rv) rv.textContent = (rrDelta >= 0 ? '+' : '') + rrDelta.toFixed(1) + ' RR';

    // Calculate modified stats
    const modifiedRuns = inn.totalRuns + extraRuns + Math.round(rrDelta * inn.overs.length);
    const modifiedWickets = Math.max(0, Math.min(10, inn.totalWickets + wicketDelta));

    const newWinProb = CricketAnalytics.calcWinProbability(
      modifiedRuns, target, modifiedWickets, 0, totalOvers
    );

    const actualResult = modifiedRuns >= target;
    const resultEl = document.getElementById('whatifResult');
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="whatif-result-title">🔮 What-If Result</div>
        <div class="whatif-result-prob" style="color:${actualResult ? 'var(--green)' : 'var(--red)'}">
          ${actualResult ? 'WIN' : 'LOSE'} — ${modifiedRuns}/${modifiedWickets}
        </div>
        <div class="whatif-result-detail">
          Modified score: ${modifiedRuns}/${modifiedWickets} vs Target: ${target}<br>
          Original: ${inn.totalRuns}/${inn.totalWickets}
        </div>
      `;
    }
  },

  // ═══ DOT BALL HEATMAP ═══
  renderHeatmap(containerId, oversData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    oversData.forEach(over => {
      html += `<div class="heatmap-over-label">Ov ${over.over}</div>`;
      if (over.balls) {
        over.balls.forEach(ball => {
          let cls, text;
          if (ball === 'W') {
            cls = 'wicket'; text = 'W';
          } else if (typeof ball === 'string' && ball.includes('w')) {
            cls = 'extra'; text = 'Wd';
          } else if (typeof ball === 'string' && ball.includes('nb')) {
            cls = 'extra'; text = 'Nb';
          } else if (ball === 0) {
            cls = 'dot'; text = '•';
          } else if (ball === 1) {
            cls = 'single'; text = '1';
          } else if (ball === 2 || ball === 3) {
            cls = 'two'; text = ball;
          } else if (ball === 4) {
            cls = 'four'; text = '4';
          } else if (typeof ball === 'number' && ball >= 6) {
            cls = 'six'; text = '6';
          } else {
            cls = 'single'; text = ball;
          }
          html += `<div class="heatmap-cell ${cls}" title="Over ${over.over}: ${text}">${text}</div>`;
        });
        // Pad to 6 cells if less
        const ballCount = over.balls.length;
        for (let i = ballCount; i < 6; i++) {
          html += `<div class="heatmap-cell dot" style="opacity:0.2">-</div>`;
        }
      }
    });

    container.innerHTML = html;
  },

  // ═══ WAGON WHEEL (SVG) ═══
  renderWagonWheel(containerId, oversData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const w = 300, h = 300;
    const cx = w / 2, cy = h / 2;
    const r = 130;

    let svg = `<svg class="wagon-wheel-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;

    // Ground circle
    svg += `<circle class="ground" cx="${cx}" cy="${cy}" r="${r}"/>`;
    svg += `<circle class="ring" cx="${cx}" cy="${cy}" r="${r * 0.66}"/>`;
    svg += `<circle class="ring" cx="${cx}" cy="${cy}" r="${r * 0.33}"/>`;

    // Pitch rectangle
    svg += `<rect class="pitch" x="${cx - 4}" y="${cy - 20}" width="8" height="40" rx="2"/>`;

    // Generate run lines from ball data
    let ballIdx = 0;
    oversData.forEach(over => {
      if (over.balls) {
        over.balls.forEach(ball => {
          if (typeof ball === 'number' && ball > 0) {
            // Random direction for each run
            const angle = (ballIdx * 137.5 + Math.random() * 30) * Math.PI / 180;
            let len, cls;
            if (ball === 1) { len = r * 0.3; cls = 'single'; }
            else if (ball === 2 || ball === 3) { len = r * 0.55; cls = 'double'; }
            else if (ball === 4) { len = r * 0.85; cls = 'four'; }
            else { len = r * 1.0; cls = 'six'; }

            const x2 = cx + Math.cos(angle) * len;
            const y2 = cy + Math.sin(angle) * len;

            svg += `<line class="run-line ${cls}" x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
          }
          ballIdx++;
        });
      }
    });

    svg += '</svg>';

    // Legend
    svg += `<div style="display:flex;gap:12px;justify-content:center;margin-top:8px;font-size:0.68rem;">
      <span style="color:rgba(136,146,176,0.6)">● Single</span>
      <span style="color:var(--cyan)">● 2-3</span>
      <span style="color:var(--amber)">● Four</span>
      <span style="color:var(--red)">● Six</span>
    </div>`;

    container.innerHTML = svg;
  },

  // ═══ MOMENTUM METER ═══
  renderMomentum(containerId, oversData, teamName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Calculate momentum from last 3 overs
    const last3 = oversData.slice(-3);
    const prev3 = oversData.slice(-6, -3);
    const recentRR = last3.reduce((s, o) => s + o.runs, 0) / Math.max(1, last3.length);
    const previousRR = prev3.reduce((s, o) => s + o.runs, 0) / Math.max(1, prev3.length);
    const momentum = Math.min(100, Math.max(0, 50 + (recentRR - previousRR) * 8));

    // Gauge SVG
    const angle = (momentum / 100) * 180;
    const needleAngle = 180 + angle;
    const rad = needleAngle * Math.PI / 180;
    const needleLen = 70;
    const cx = 100, cy = 95;

    let svg = `<svg viewBox="0 0 200 110">`;
    // Arc background
    svg += `<path d="M 15 95 A 85 85 0 0 1 185 95" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12" stroke-linecap="round"/>`;
    // Colored arc
    svg += `<path d="M 15 95 A 85 85 0 0 1 185 95" fill="none" 
      stroke="url(#momentumGrad)" stroke-width="12" stroke-linecap="round"
      stroke-dasharray="${85 * Math.PI}" stroke-dashoffset="${85 * Math.PI * (1 - momentum / 100)}"/>`;
    svg += `<defs><linearGradient id="momentumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="var(--red)"/>
      <stop offset="50%" stop-color="var(--amber)"/>
      <stop offset="100%" stop-color="var(--green)"/>
    </linearGradient></defs>`;
    // Needle
    const nx = cx + Math.cos(rad) * needleLen;
    const ny = cy + Math.sin(rad) * needleLen;
    svg += `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" 
      stroke="var(--text-primary)" stroke-width="2.5" stroke-linecap="round"/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="5" fill="var(--text-primary)"/>`;
    svg += `</svg>`;

    container.innerHTML = `
      <div class="momentum-container">
        <div class="momentum-gauge">${svg}</div>
        <div class="momentum-value" style="color:${momentum > 60 ? 'var(--green)' : momentum > 40 ? 'var(--amber)' : 'var(--red)'}">
          ${Math.round(momentum)}
        </div>
        <div class="momentum-labels">
          <span>Low</span>
          <span>${teamName}</span>
          <span>High</span>
        </div>
      </div>
    `;
  },

  // ═══ PARTNERSHIP TRACKER ═══
  renderPartnerships(containerId, innings) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Generate partnerships from wicket data
    const batsmen = innings.batsmen || [];
    const partnerships = [];
    let currentRuns = 0;
    let partnershipStart = 0;
    let wicketCount = 0;

    innings.overs.forEach(over => {
      currentRuns += over.runs;
      if (over.wickets > 0) {
        for (let w = 0; w < over.wickets; w++) {
          const partRuns = currentRuns - partnershipStart;
          const b1 = batsmen[wicketCount] || { name: 'Bat ' + (wicketCount + 1) };
          const b2 = batsmen[wicketCount + 1] || { name: 'Bat ' + (wicketCount + 2) };
          partnerships.push({
            num: wicketCount + 1,
            runs: partRuns,
            bat1: b1.name,
            bat2: b2.name,
            overStart: partnershipStart > 0 ? over.over - 1 : 1,
            overEnd: over.over
          });
          partnershipStart = currentRuns;
          wicketCount++;
        }
      }
    });

    // Last unbroken partnership
    if (currentRuns > partnershipStart) {
      const b1 = batsmen[Math.min(wicketCount, batsmen.length - 1)] || { name: 'Batsman' };
      const b2 = batsmen[Math.min(wicketCount + 1, batsmen.length - 1)] || { name: 'Batsman' };
      partnerships.push({
        num: wicketCount + 1,
        runs: currentRuns - partnershipStart,
        bat1: b1.name,
        bat2: b2.name,
        overEnd: innings.overs.length,
        unbroken: true
      });
    }

    const maxRuns = Math.max(...partnerships.map(p => p.runs), 1);

    container.innerHTML = partnerships.map(p => {
      const pct = (p.runs / maxRuns) * 100;
      const cls = p.unbroken ? 'active' : (p.runs > maxRuns * 0.6 ? 'high' : 'ended');
      return `
        <div class="partnership-item">
          <div class="partnership-number">#${p.num}</div>
          <div class="partnership-bar-wrap">
            <div class="partnership-bar ${cls}" style="width:${pct}%">
              ${p.runs} runs
            </div>
          </div>
          <div class="partnership-info">${p.bat1}${p.unbroken ? '*' : ''}</div>
        </div>
      `;
    }).join('');
  },

  // ═══ HEAD-TO-HEAD RADAR ═══
  renderH2HRadar(canvasId, player1, player2) {
    ChartFactory.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = ['Strike Rate', 'Runs', 'Boundaries', 'Balls Faced', 'Fours', 'Sixes'];
    const maxVals = [200, 150, 15, 100, 12, 8];

    const p1Data = [
      Math.min(100, (player1.strikeRate || 0) / 2),
      Math.min(100, player1.runs / 1.5),
      Math.min(100, ((player1.fours || 0) + (player1.sixes || 0)) * 7),
      Math.min(100, player1.balls),
      Math.min(100, (player1.fours || 0) * 8),
      Math.min(100, (player1.sixes || 0) * 12)
    ];
    const p2Data = [
      Math.min(100, (player2.strikeRate || 0) / 2),
      Math.min(100, player2.runs / 1.5),
      Math.min(100, ((player2.fours || 0) + (player2.sixes || 0)) * 7),
      Math.min(100, player2.balls),
      Math.min(100, (player2.fours || 0) * 8),
      Math.min(100, (player2.sixes || 0) * 12)
    ];

    ChartFactory.instances[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: player1.name,
            data: p1Data,
            borderColor: '#00f0ff',
            backgroundColor: 'rgba(0,240,255,0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#00f0ff'
          },
          {
            label: player2.name,
            data: p2Data,
            borderColor: '#ffaa00',
            backgroundColor: 'rgba(255,170,0,0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#ffaa00'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            angleLines: { color: 'rgba(255,255,255,0.05)' },
            ticks: { display: false },
            pointLabels: {
              color: 'rgba(136,146,176,0.6)',
              font: { size: 10, family: "'Inter', sans-serif" }
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgba(136,146,176,0.6)',
              font: { size: 11, family: "'Inter', sans-serif" },
              boxWidth: 12, padding: 16
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10,14,39,0.92)',
            titleColor: '#f0f4ff',
            bodyColor: '#8892b0',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8
          }
        },
        animation: { duration: 800 }
      }
    });
  },

  // ═══ MATCH COMPARISON ═══
  renderMatchComparison(container1Id, container2Id, match1, match2) {
    const c1 = document.getElementById(container1Id);
    const c2 = document.getElementById(container2Id);
    if (!c1 || !c2 || !match1 || !match2) return;

    [
      { container: c1, match: match1 },
      { container: c2, match: match2 }
    ].forEach(({ container, match }) => {
      const inn1 = match.innings[0];
      const inn2 = match.innings[1];
      const totalOvers = match.format === 'T20' ? 20 : match.format === 'ODI' ? 50 : 90;

      container.innerHTML = `
        <div class="card-title" style="justify-content:center">${match.title}</div>
        <div class="comparison-stat"><span class="label">Format</span><span class="value">${match.format}</span></div>
        <div class="comparison-stat"><span class="label">${inn1.batting}</span><span class="value">${inn1.totalRuns}/${inn1.totalWickets}</span></div>
        <div class="comparison-stat"><span class="label">${inn2.batting}</span><span class="value">${inn2.totalRuns}/${inn2.totalWickets}</span></div>
        <div class="comparison-stat"><span class="label">CRR (Inn 1)</span><span class="value">${CricketAnalytics.calcRunRate(inn1.totalRuns, inn1.overs.length)}</span></div>
        <div class="comparison-stat"><span class="label">CRR (Inn 2)</span><span class="value">${CricketAnalytics.calcRunRate(inn2.totalRuns, inn2.overs.length)}</span></div>
        <div class="comparison-stat"><span class="label">Result</span><span class="value better">${match.result}</span></div>
      `;
    });
  },

  // ═══ THEME TOGGLE ═══
  initTheme() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      btn.textContent = next === 'light' ? '🌙' : '☀️';
    });
  },

  // ═══ KEYBOARD SHORTCUTS ═══
  initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
        case 'Space':
          e.preventDefault();
          if (App.mode === 'live') {
            if (LiveMatch.isRunning) LiveMatch.stop();
            else App.startLiveMode();
          } else {
            this.toggleSliderPlay();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.stepSlider(1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.stepSlider(-1);
          break;
        case 'l':
        case 'L':
          App.switchMode('live');
          break;
        case 'r':
        case 'R':
          App.switchMode('replay');
          break;
        case 'm':
        case 'M':
          Effects.toggleSound();
          break;
        case 't':
        case 'T':
          document.getElementById('themeToggle')?.click();
          break;
        case 'n':
        case 'N':
          if (App.mode === 'live') App.startLiveMode();
          break;
        case 'e':
        case 'E':
          this.exportDashboard();
          break;
      }
    });
  },

  stepSlider(delta) {
    const slider = document.getElementById('replaySlider');
    if (!slider) return;
    let val = parseInt(slider.value) + delta;
    val = Math.max(parseInt(slider.min || 1), Math.min(parseInt(slider.max), val));
    slider.value = val;
    document.getElementById('sliderOverDisplay').textContent = 'Over ' + val;
    this.renderAtOver(val);
  },

  // ═══ EXPORT ═══
  async exportDashboard() {
    try {
      // Use html2canvas if available, otherwise fallback to simple screenshot
      if (typeof html2canvas !== 'undefined') {
        const canvas = await html2canvas(document.querySelector('.container'), {
          backgroundColor: '#060a1a',
          scale: 2
        });
        const link = document.createElement('a');
        link.download = 'cricket-dashboard-' + Date.now() + '.png';
        link.href = canvas.toDataURL();
        link.click();
      } else {
        // Fallback: create a data summary
        this.exportAsJSON();
      }
    } catch (e) {
      this.exportAsJSON();
    }
  },

  exportAsJSON() {
    const analysis = MatchReplay.getAnalysis();
    if (!analysis) return;

    const data = {
      match: analysis.match.title,
      format: analysis.match.format,
      date: analysis.match.date,
      result: analysis.match.result,
      innings: analysis.match.innings.map(inn => ({
        team: inn.batting,
        score: inn.totalRuns + '/' + inn.totalWickets,
        runRate: CricketAnalytics.calcRunRate(inn.totalRuns, inn.overs.length)
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'match-summary-' + Date.now() + '.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  },

  // ═══ INIT ALL ═══
  initAll() {
    this.initTheme();
    this.initReplaySlider();
    this.initWhatIf();
    this.initKeyboard();
    Effects.init();
  }
};
