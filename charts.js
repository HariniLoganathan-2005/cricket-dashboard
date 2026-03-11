// ===== CHART.JS WRAPPER — CRICKET DASHBOARD =====

const ChartFactory = {
  instances: {},
  colors: {
    cyan:   '#00f0ff',
    green:  '#00ff88',
    amber:  '#ffaa00',
    red:    '#ff4466',
    purple: '#a855f7',
    pink:   '#ff66b2',
    cyanAlpha:  'rgba(0,240,255,0.15)',
    greenAlpha: 'rgba(0,255,136,0.15)',
    amberAlpha: 'rgba(255,170,0,0.15)',
    redAlpha:   'rgba(255,68,102,0.15)',
    gridLine:   'rgba(255,255,255,0.04)',
    gridText:   'rgba(136,146,176,0.6)',
  },

  baseOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: this.colors.gridText,
            font: { family: "'Inter', sans-serif", size: 11 },
            boxWidth: 12, boxHeight: 12, borderRadius: 3,
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: 'rgba(10,14,39,0.92)',
          titleColor: '#f0f4ff',
          bodyColor: '#8892b0',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", weight: '600' },
          bodyFont: { family: "'Inter', sans-serif" },
          displayColors: true,
          boxPadding: 4
        }
      },
      scales: {
        x: {
          grid: { color: this.colors.gridLine, drawBorder: false },
          ticks: { color: this.colors.gridText, font: { size: 10 } },
          border: { display: false }
        },
        y: {
          grid: { color: this.colors.gridLine, drawBorder: false },
          ticks: { color: this.colors.gridText, font: { size: 10 } },
          border: { display: false }
        }
      },
      animation: { duration: 800, easing: 'easeOutQuart' }
    };
  },

  // Destroy existing chart instance
  destroy(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  // ── Over-by-Over Progression (dual line) ──
  createOverProgression(canvasId, innings1Data, innings2Data, team1Name, team2Name) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const prog1 = CricketAnalytics.getOverProgression(innings1Data);
    const prog2 = innings2Data ? CricketAnalytics.getOverProgression(innings2Data) : null;

    const maxOvers = Math.max(prog1.length, prog2 ? prog2.length : 0);
    const labels = Array.from({ length: maxOvers }, (_, i) => i + 1);

    const datasets = [
      {
        label: team1Name,
        data: prog1.map(p => p.cumulative),
        borderColor: this.colors.cyan,
        backgroundColor: this.colors.cyanAlpha,
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: this.colors.cyan
      }
    ];

    if (prog2) {
      datasets.push({
        label: team2Name,
        data: prog2.map(p => p.cumulative),
        borderColor: this.colors.amber,
        backgroundColor: this.colors.amberAlpha,
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: this.colors.amber
      });
    }

    const opts = this.baseOptions();
    opts.plugins.legend.display = true;
    opts.scales.x.title = { display: true, text: 'Overs', color: this.colors.gridText, font: { size: 10 } };
    opts.scales.y.title = { display: true, text: 'Runs', color: this.colors.gridText, font: { size: 10 } };

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: opts
    });
    return this.instances[canvasId];
  },

  // ── Manhattan Chart (runs per over bars) ──
  createManhattan(canvasId, oversData, teamName) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const manhattan = CricketAnalytics.getManhattanData(oversData);
    const labels = manhattan.map(m => m.over);

    const opts = this.baseOptions();
    opts.plugins.legend.display = false;
    opts.scales.x.title = { display: true, text: 'Overs', color: this.colors.gridText, font: { size: 10 } };
    opts.scales.y.title = { display: true, text: 'Runs', color: this.colors.gridText, font: { size: 10 } };
    opts.scales.y.beginAtZero = true;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: teamName + ' Runs',
          data: manhattan.map(m => m.runs),
          backgroundColor: manhattan.map(m =>
            m.hasWicket ? this.colors.redAlpha : this.colors.cyanAlpha
          ),
          borderColor: manhattan.map(m =>
            m.hasWicket ? this.colors.red : this.colors.cyan
          ),
          borderWidth: 1.5,
          borderRadius: 4,
          barPercentage: 0.7
        }]
      },
      options: opts
    });
    return this.instances[canvasId];
  },

  // ── Win Probability Trend ──
  createWinProbTrend(canvasId, oversData, target, totalOvers, team1Name, team2Name) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const trend = CricketAnalytics.getWinProbabilityTrend(oversData, target, totalOvers);
    const labels = trend.map(t => t.over);

    const opts = this.baseOptions();
    opts.scales.y.min = 0;
    opts.scales.y.max = 100;
    opts.scales.y.ticks.callback = v => v + '%';
    opts.scales.x.title = { display: true, text: 'Overs', color: this.colors.gridText, font: { size: 10 } };
    opts.plugins.legend.display = true;

    // Create gradient
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(0,255,136,0.2)');
    gradient.addColorStop(1, 'rgba(0,255,136,0)');

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: team1Name + ' Win %',
            data: trend.map(t => t.probability),
            borderColor: this.colors.green,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: this.colors.green
          },
          {
            label: team2Name + ' Win %',
            data: trend.map(t => 100 - t.probability),
            borderColor: this.colors.purple,
            backgroundColor: 'rgba(168,85,247,0.08)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: this.colors.purple
          }
        ]
      },
      options: opts
    });
    return this.instances[canvasId];
  },

  // ── Phase Performance Bar Chart ──
  createPhaseChart(canvasId, phaseStats1, phaseStats2, team1Name, team2Name) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = ['Powerplay', 'Middle', 'Death'];
    const keys = ['powerplay', 'middle', 'death'];

    const datasets = [
      {
        label: team1Name,
        data: keys.map(k => phaseStats1[k].runs),
        backgroundColor: this.colors.cyanAlpha,
        borderColor: this.colors.cyan,
        borderWidth: 1.5,
        borderRadius: 6,
        barPercentage: 0.6
      }
    ];

    if (phaseStats2) {
      datasets.push({
        label: team2Name,
        data: keys.map(k => phaseStats2[k].runs),
        backgroundColor: this.colors.amberAlpha,
        borderColor: this.colors.amber,
        borderWidth: 1.5,
        borderRadius: 6,
        barPercentage: 0.6
      });
    }

    const opts = this.baseOptions();
    opts.scales.y.beginAtZero = true;
    opts.scales.y.title = { display: true, text: 'Runs', color: this.colors.gridText, font: { size: 10 } };

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: opts
    });
    return this.instances[canvasId];
  },

  // ── Scoring Zones / Wagon Wheel (simplified doughnut) ──
  createScoringBreakdown(canvasId, oversData) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    let dots = 0, singles = 0, doubles = 0, threes = 0, fours = 0, sixes = 0;
    oversData.forEach(o => {
      if (o.balls) {
        o.balls.forEach(b => {
          if (typeof b === 'number') {
            if (b === 0) dots++;
            else if (b === 1) singles++;
            else if (b === 2) doubles++;
            else if (b === 3) threes++;
            else if (b === 4) fours++;
            else if (b >= 6) sixes++;
          }
        });
      }
    });

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Dots', 'Singles', 'Doubles', 'Threes', 'Fours', 'Sixes'],
        datasets: [{
          data: [dots, singles, doubles, threes, fours, sixes],
          backgroundColor: [
            'rgba(74,84,120,0.5)',
            'rgba(136,146,176,0.5)',
            this.colors.cyanAlpha,
            this.colors.greenAlpha,
            this.colors.amberAlpha,
            this.colors.redAlpha
          ],
          borderColor: [
            'rgba(74,84,120,0.8)',
            'rgba(136,146,176,0.8)',
            this.colors.cyan,
            this.colors.green,
            this.colors.amber,
            this.colors.red
          ],
          borderWidth: 1.5,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: this.colors.gridText,
              font: { family: "'Inter', sans-serif", size: 11 },
              boxWidth: 12, padding: 10
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
        animation: { animateRotate: true, duration: 1000 }
      }
    });
    return this.instances[canvasId];
  },

  // Destroy all chart instances
  destroyAll() {
    Object.keys(this.instances).forEach(id => this.destroy(id));
  }
};
