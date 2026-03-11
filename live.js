// ===== LIVE MATCH SIMULATION ENGINE (ENHANCED) =====

const LiveMatch = {
  isRunning: false,
  currentMatch: null,
  currentInnings: 0,
  currentOver: 0,
  currentBall: 0,
  intervalId: null,
  speed: 2000,
  onUpdate: null,
  liveCommentary: [],

  start(match, onUpdate) {
    this.stop();
    this.currentMatch = JSON.parse(JSON.stringify(match));
    this.currentInnings = 0;
    this.currentOver = 0;
    this.currentBall = 0;
    this.isRunning = true;
    this.onUpdate = onUpdate;
    this.liveCommentary = [];

    this.deliverNextOver();
    this.intervalId = setInterval(() => this.deliverNextOver(), this.speed);
  },

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  setSpeed(ms) {
    this.speed = ms;
    if (this.isRunning) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => this.deliverNextOver(), this.speed);
    }
  },

  deliverNextOver() {
    if (!this.currentMatch || !this.isRunning) return;

    const innings = this.currentMatch.innings[this.currentInnings];
    if (!innings) {
      this.stop();
      if (this.onUpdate) this.onUpdate(this.getState(), true);
      return;
    }

    this.currentOver++;
    const totalOversAvailable = innings.overs.length;

    if (this.currentOver > totalOversAvailable) {
      this.currentInnings++;
      this.currentOver = 0;
      if (this.currentInnings >= this.currentMatch.innings.length) {
        this.stop();
        Effects.triggerCelebration();
        if (this.onUpdate) this.onUpdate(this.getState(), true);
        return;
      }
      this.deliverNextOver();
      return;
    }

    // Trigger effects for this over's balls
    const overData = innings.overs[this.currentOver - 1];
    if (overData && overData.balls) {
      overData.balls.forEach((ball, i) => {
        setTimeout(() => {
          if (ball === 4) Effects.triggerFour();
          else if (typeof ball === 'number' && ball >= 6) Effects.triggerSix();
          else if (ball === 'W') Effects.triggerWicket();
        }, i * 200);
      });

      // Generate commentary
      const batsmen = innings.batsmen || [];
      const bowlers = innings.bowlers || [];
      const currentBatIdx = this.getWicketsUpTo(innings, this.currentOver);
      const batter = batsmen[Math.min(currentBatIdx, batsmen.length - 1)]?.name || 'Batsman';
      const bowler = bowlers[(this.currentOver - 1) % bowlers.length]?.name || 'Bowler';

      overData.balls.forEach((ball, bi) => {
        if (ball === 'W' || ball === 4 || (typeof ball === 'number' && ball >= 6)) {
          const comm = Commentary.generateBallCommentary(ball, this.currentOver, bi, batter, bowler);
          this.liveCommentary.unshift({
            over: this.currentOver + '.' + (bi + 1),
            text: comm,
            type: ball === 'W' ? 'wicket' : 'boundary'
          });
        }
      });

      // Over summary
      const totalRuns = innings.overs.slice(0, this.currentOver).reduce((s, o) => s + o.runs, 0);
      const totalWickets = innings.overs.slice(0, this.currentOver).reduce((s, o) => s + o.wickets, 0);
      this.liveCommentary.unshift({
        over: this.currentOver + '.6',
        text: Commentary.generateOverSummary(this.currentOver, overData.runs, totalRuns, totalWickets),
        type: 'highlight'
      });

      // Keep only last 20
      if (this.liveCommentary.length > 20) this.liveCommentary.length = 20;
    }

    if (this.onUpdate) {
      this.onUpdate(this.getState(), false);
    }
  },

  getWicketsUpTo(innings, overNum) {
    return innings.overs.slice(0, overNum).reduce((s, o) => s + o.wickets, 0);
  },

  getState() {
    if (!this.currentMatch) return null;
    const match = this.currentMatch;
    const inningsIdx = this.currentInnings;
    const innings = match.innings[inningsIdx];
    if (!innings) return null;

    const deliveredOvers = innings.overs.slice(0, this.currentOver);
    const totalRuns = deliveredOvers.reduce((s, o) => s + o.runs, 0);
    const totalWickets = deliveredOvers.reduce((s, o) => s + o.wickets, 0);

    let totalOversInFormat;
    if (match.format === 'T20') totalOversInFormat = 20;
    else if (match.format === 'ODI') totalOversInFormat = 50;
    else totalOversInFormat = 90;

    const oversLeft = totalOversInFormat - this.currentOver;
    const crr = CricketAnalytics.calcRunRate(totalRuns, this.currentOver);

    let rrr = 0, target = null, winProb = 50;

    if (inningsIdx === 1) {
      target = match.innings[0].totalRuns + 1;
      rrr = CricketAnalytics.calcRequiredRunRate(target, totalRuns, oversLeft);
      winProb = CricketAnalytics.calcWinProbability(totalRuns, target, totalWickets, oversLeft, totalOversInFormat);
    }

    const phaseStats = CricketAnalytics.getPhaseStats(deliveredOvers, match.format);
    const pressure = inningsIdx === 1
      ? CricketAnalytics.calcPressureIndex(deliveredOvers, target || 200, totalWickets, this.currentOver, totalOversInFormat)
      : Math.round(Math.min(100, totalWickets * 8 + (crr < 5 ? 15 : 0)));

    return {
      match, inningsIndex: inningsIdx, innings, deliveredOvers,
      currentOver: this.currentOver, totalRuns, totalWickets,
      crr, rrr, target, winProb, oversLeft, totalOversInFormat,
      phaseStats, pressure,
      isComplete: false,
      battingTeam: innings.batting,
      bowlingTeam: innings.bowling,
      commentary: this.liveCommentary
    };
  },

  getRandomMatch() {
    const idx = Math.floor(Math.random() * HISTORICAL_MATCHES.length);
    return HISTORICAL_MATCHES[idx];
  }
};
