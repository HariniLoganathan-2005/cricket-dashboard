// ===== CRICKET ANALYTICS ENGINE =====

const CricketAnalytics = {

  // ── Run Rate ──
  calcRunRate(runs, overs) {
    if (overs <= 0) return 0;
    return +(runs / overs).toFixed(2);
  },

  // ── Required Run Rate ──
  calcRequiredRunRate(target, runsScored, oversRemaining) {
    if (oversRemaining <= 0) return 999;
    const needed = target - runsScored;
    if (needed <= 0) return 0;
    return +(needed / oversRemaining).toFixed(2);
  },

  // ── Win Probability (logistic model) ──
  calcWinProbability(battingTeamRuns, target, wicketsLost, oversLeft, totalOvers) {
    if (battingTeamRuns >= target) return 100;
    if (wicketsLost >= 10 && battingTeamRuns < target) return 0;
    
    const needed = target - battingTeamRuns;
    const rrr = oversLeft > 0 ? needed / oversLeft : 999;
    const wicketsRemaining = 10 - wicketsLost;
    const oversFraction = oversLeft / totalOvers;
    
    // Features for logistic regression
    const rrrFactor = -0.35 * rrr;
    const wicketFactor = 0.4 * wicketsRemaining;
    const progressFactor = battingTeamRuns / target * 2;
    const oversFactor = oversFraction * 0.5;
    
    const z = rrrFactor + wicketFactor + progressFactor + oversFactor - 1;
    const prob = 1 / (1 + Math.exp(-z));
    
    return Math.round(Math.min(99, Math.max(1, prob * 100)));
  },

  // ── Over Progression (cumulative runs per over) ──
  getOverProgression(oversData) {
    let cumulative = 0;
    return oversData.map(o => {
      cumulative += o.runs;
      return { over: o.over, runs: o.runs, cumulative, wickets: o.wickets };
    });
  },

  // ── Phase Stats (Powerplay, Middle, Death) ──
  getPhaseStats(oversData, format) {
    let ppEnd, midEnd;
    if (format === 'T20') { ppEnd = 6; midEnd = 15; }
    else if (format === 'ODI') { ppEnd = 10; midEnd = 40; }
    else { ppEnd = 30; midEnd = 60; } // Test simplification

    const phases = {
      powerplay: { runs: 0, wickets: 0, overs: 0, dots: 0, boundaries: 0 },
      middle:    { runs: 0, wickets: 0, overs: 0, dots: 0, boundaries: 0 },
      death:     { runs: 0, wickets: 0, overs: 0, dots: 0, boundaries: 0 }
    };

    oversData.forEach(o => {
      let phase;
      if (o.over <= ppEnd) phase = 'powerplay';
      else if (o.over <= midEnd) phase = 'middle';
      else phase = 'death';

      phases[phase].runs += o.runs;
      phases[phase].wickets += o.wickets;
      phases[phase].overs++;

      if (o.balls) {
        o.balls.forEach(b => {
          if (typeof b === 'number') {
            if (b === 0) phases[phase].dots++;
            if (b === 4 || b === 6) phases[phase].boundaries++;
          }
        });
      }
    });

    // Calculate run rates for each phase
    Object.keys(phases).forEach(k => {
      phases[k].runRate = phases[k].overs > 0 ? +(phases[k].runs / phases[k].overs).toFixed(2) : 0;
    });

    return phases;
  },

  // ── Pressure Moments ──
  getPressureMoments(oversData) {
    const moments = [];
    let consecutiveDots = 0;

    oversData.forEach(o => {
      if (o.balls) {
        o.balls.forEach(b => {
          if (typeof b === 'number' && b === 0) {
            consecutiveDots++;
            if (consecutiveDots >= 4) {
              moments.push({ over: o.over, type: 'dot_pressure', dots: consecutiveDots });
            }
          } else {
            consecutiveDots = 0;
          }
        });
      }

      if (o.wickets >= 2) {
        moments.push({ over: o.over, type: 'double_strike', wickets: o.wickets });
      }

      // Maiden or near-maiden
      if (o.runs <= 1 && o.wickets > 0) {
        moments.push({ over: o.over, type: 'wicket_maiden' });
      }
    });

    return moments;
  },

  // ── Pressure Index (0-100) ──
  calcPressureIndex(oversData, target, wicketsLost, currentOver, totalOvers) {
    const runsScored = oversData.reduce((s, o) => s + o.runs, 0);
    const rrr = this.calcRequiredRunRate(target, runsScored, totalOvers - currentOver);
    const crr = this.calcRunRate(runsScored, currentOver);

    let pressure = 0;
    // Required rate pressure
    pressure += Math.min(40, rrr * 3);
    // Wickets pressure
    pressure += wicketsLost * 6;
    // Rate diff pressure
    if (rrr > crr) pressure += Math.min(20, (rrr - crr) * 5);
    // Late innings pressure
    const inningsFraction = currentOver / totalOvers;
    if (inningsFraction > 0.7) pressure += 10;

    return Math.round(Math.min(100, Math.max(0, pressure)));
  },

  // ── Player Stats Calculation ──
  getPlayerStats(innings) {
    const batsmen = (innings.batsmen || []).map(b => ({
      ...b,
      strikeRate: b.balls > 0 ? +((b.runs / b.balls) * 100).toFixed(1) : 0,
      dotPercentage: 0
    }));

    const bowlers = (innings.bowlers || []).map(b => ({
      ...b,
      economy: b.overs > 0 ? +(b.runs / b.overs).toFixed(2) : 0,
      strikeRate: b.wickets > 0 ? +((b.overs * 6) / b.wickets).toFixed(1) : '-'
    }));

    return { batsmen, bowlers };
  },

  // ── Wicket Timeline ──
  getWicketTimeline(oversData) {
    const timeline = [];
    let totalRuns = 0;
    let totalWickets = 0;
    oversData.forEach(o => {
      totalRuns += o.runs;
      if (o.wickets > 0) {
        for (let w = 0; w < o.wickets; w++) {
          totalWickets++;
          timeline.push({
            over: o.over,
            wicketNumber: totalWickets,
            runsAtWicket: totalRuns
          });
        }
      }
    });
    return timeline;
  },

  // ── Win Probability Trend ──
  getWinProbabilityTrend(oversData, target, totalOvers) {
    const trend = [{ over: 0, probability: 50 }];
    let runs = 0;
    let wickets = 0;

    oversData.forEach(o => {
      runs += o.runs;
      wickets += o.wickets;
      const oversLeft = totalOvers - o.over;
      const prob = this.calcWinProbability(runs, target, wickets, oversLeft, totalOvers);
      trend.push({ over: o.over, probability: prob });
    });

    return trend;
  },

  // ── Manhattan Data (runs per over) ──
  getManhattanData(oversData) {
    return oversData.map(o => ({
      over: o.over,
      runs: o.runs,
      wickets: o.wickets,
      hasWicket: o.wickets > 0
    }));
  }
};
