// ===== MATCH REPLAY MODE =====

const MatchReplay = {
  currentMatch: null,
  selectedInnings: 0,

  // Load a match by ID
  loadMatch(matchId) {
    this.currentMatch = HISTORICAL_MATCHES.find(m => m.id === matchId) || null;
    this.selectedInnings = 0;
    return this.currentMatch;
  },

  // Get available matches for dropdown
  getMatchList() {
    return HISTORICAL_MATCHES.map(m => ({
      id: m.id,
      title: m.title,
      subtitle: m.subtitle,
      format: m.format,
      date: m.date,
      result: m.result
    }));
  },

  // Select innings (0 or 1)
  selectInnings(idx) {
    this.selectedInnings = idx;
  },

  // Get full analysis for current match/innings
  getAnalysis() {
    if (!this.currentMatch) return null;
    const match = this.currentMatch;
    const inn = match.innings[this.selectedInnings];
    if (!inn) return null;

    let totalOvers;
    if (match.format === 'T20') totalOvers = 20;
    else if (match.format === 'ODI') totalOvers = 50;
    else totalOvers = 90;

    const progression = CricketAnalytics.getOverProgression(inn.overs);
    const phaseStats = CricketAnalytics.getPhaseStats(inn.overs, match.format);
    const wicketTimeline = CricketAnalytics.getWicketTimeline(inn.overs);
    const playerStats = CricketAnalytics.getPlayerStats(inn);
    const pressureMoments = CricketAnalytics.getPressureMoments(inn.overs);
    const manhattan = CricketAnalytics.getManhattanData(inn.overs);

    // Win probability trend for 2nd innings
    let winProbTrend = null;
    if (this.selectedInnings === 1 || match.innings.length === 2) {
      const secondInn = match.innings[1];
      const target = match.innings[0].totalRuns + 1;
      if (secondInn) {
        winProbTrend = CricketAnalytics.getWinProbabilityTrend(secondInn.overs, target, totalOvers);
      }
    }

    // Current run rate
    const crr = CricketAnalytics.calcRunRate(inn.totalRuns, inn.overs.length);

    // Pressure index at end of innings
    const target = this.selectedInnings === 1 ? match.innings[0].totalRuns + 1 : 200;
    const pressure = CricketAnalytics.calcPressureIndex(
      inn.overs, target, inn.totalWickets, inn.overs.length, totalOvers
    );

    return {
      match,
      innings: inn,
      inningsIndex: this.selectedInnings,
      progression,
      phaseStats,
      wicketTimeline,
      playerStats,
      pressureMoments,
      manhattan,
      winProbTrend,
      crr,
      pressure,
      totalOvers,
      target: this.selectedInnings === 1 ? match.innings[0].totalRuns + 1 : null
    };
  },

  // Get both innings for comparison charts
  getComparisonData() {
    if (!this.currentMatch || this.currentMatch.innings.length < 2) return null;
    const match = this.currentMatch;
    const inn1 = match.innings[0];
    const inn2 = match.innings[1];

    let totalOvers;
    if (match.format === 'T20') totalOvers = 20;
    else if (match.format === 'ODI') totalOvers = 50;
    else totalOvers = 90;

    return {
      innings1: {
        team: inn1.batting,
        overs: inn1.overs,
        totalRuns: inn1.totalRuns,
        totalWickets: inn1.totalWickets,
        crr: CricketAnalytics.calcRunRate(inn1.totalRuns, inn1.overs.length),
        phaseStats: CricketAnalytics.getPhaseStats(inn1.overs, match.format)
      },
      innings2: {
        team: inn2.batting,
        overs: inn2.overs,
        totalRuns: inn2.totalRuns,
        totalWickets: inn2.totalWickets,
        crr: CricketAnalytics.calcRunRate(inn2.totalRuns, inn2.overs.length),
        phaseStats: CricketAnalytics.getPhaseStats(inn2.overs, match.format)
      },
      target: inn1.totalRuns + 1,
      totalOvers,
      format: match.format
    };
  }
};
