// ===== AI-STYLE COMMENTARY GENERATOR =====

const Commentary = {
  templates: {
    boundary4: [
      "{batter} smashes it through the covers for FOUR! 💥",
      "Cracking drive! {batter} finds the gap — 4 runs!",
      "FOUR! {batter} punches it past mid-off brilliantly!",
      "Exquisite timing! {batter} caresses it for a boundary!",
      "That's racing to the fence! {batter} with a glorious shot!",
      "BANG! {batter} pulls it powerfully for four!"
    ],
    boundary6: [
      "{batter} launches it into the stands! SIX! 🚀",
      "MASSIVE! {batter} sends it out of the park! 6️⃣",
      "That's HUGE! {batter} clears the rope with ease!",
      "SIX! {batter} goes downtown — what a hit!",
      "Up, up and away! {batter} with a monster six! 💥",
      "The crowd erupts! {batter} hammers a maximum!"
    ],
    wicket: [
      "WICKET! 💀 {bowler} strikes! {batter} has to walk!",
      "GOT HIM! {bowler} breaks through! Big wicket!",
      "OUT! {batter} departs — {bowler} is pumped! 🔥",
      "That's the end of {batter}! {bowler} with a crucial breakthrough!",
      "TIMBER! {bowler} rattles the stumps! What a delivery!",
      "Caught! {batter} edges one to the keeper — {bowler} celebrates!"
    ],
    dot: [
      "Dot ball. Good tight bowling from {bowler}.",
      "Nothing doing. {bowler} keeps it tight.",
      "Defended back. Building pressure here.",
      "No run. {bowler} is in a miserly spell.",
    ],
    single: [
      "{batter} rotates the strike with a single.",
      "Quick single taken. Smart cricket here.",
      "Pushed into the gap for one. {batter} keeps the board ticking.",
    ],
    milestone: [
      "🎉 {batter} reaches {milestone} — what an innings!",
      "FIFTY UP for {batter}! The crowd rises! 🏏",
      "💯 CENTURY for {batter}! Absolutely magnificent!",
    ],
    overSummary: [
      "End of Over {over}: {runs} runs | Score: {total}/{wickets}",
    ],
    pressure: [
      "🔴 Pressure building! {dots} consecutive dot balls!",
      "⚡ The momentum has shifted! {team} feeling the heat!",
      "🔥 This is getting tense! {team} need {needed} off {balls} balls!",
    ],
    phaseChange: [
      "Powerplay is done! {team} are {runs}/{wickets} after 6 overs.",
      "Middle overs begin. Time to consolidate.",
      "⚡ Death overs time! Every ball counts now!",
    ],
    matchEnd: [
      "🏆 {winner} WIN! What a match! {result}",
      "It's all over! {winner} take it! {result} 🎊",
    ]
  },

  // Generate commentary for a ball
  generateBallCommentary(ball, over, ballNum, batter, bowler) {
    let type;
    if (ball === 'W') type = 'wicket';
    else if (ball === 4) type = 'boundary4';
    else if (ball >= 6 && typeof ball === 'number') type = 'boundary6';
    else if (ball === 0) type = 'dot';
    else type = 'single';

    const templates = this.templates[type];
    const template = templates[Math.floor(Math.random() * templates.length)];

    return template
      .replace(/\{batter\}/g, batter || 'Batsman')
      .replace(/\{bowler\}/g, bowler || 'Bowler');
  },

  // Generate over summary
  generateOverSummary(overNum, overRuns, totalRuns, totalWickets) {
    return `📋 End of Over ${overNum}: ${overRuns} runs scored | Score: ${totalRuns}/${totalWickets}`;
  },

  // Generate milestone commentary
  generateMilestone(batter, runs) {
    if (runs >= 100) return `💯 CENTURY for ${batter}! Absolutely magnificent innings! The crowd is on its feet!`;
    if (runs >= 50) return `🎉 FIFTY UP for ${batter}! Brilliant knock so far! 👏`;
    return null;
  },

  // Generate pressure commentary
  generatePressure(team, needed, balls) {
    return `🔥 Crunch time! ${team} need ${needed} runs off ${balls} balls — pressure is ON!`;
  },

  // Generate phase change commentary
  generatePhaseChange(phase, team, runs, wickets) {
    switch (phase) {
      case 'middle':
        return `📊 Powerplay done! ${team} are ${runs}/${wickets} after 6 overs.`;
      case 'death':
        return `⚡ Death overs are HERE! ${team} at ${runs}/${wickets} — time to accelerate!`;
      default:
        return null;
    }
  },

  // Generate full match commentary from ball-by-ball
  generateMatchCommentary(innings, match) {
    const comments = [];
    let totalRuns = 0;
    let totalWickets = 0;
    const batsmen = innings.batsmen || [];
    const bowlers = innings.bowlers || [];

    innings.overs.forEach((over, oi) => {
      const overRuns = over.runs;
      const overWickets = over.wickets;

      // Key ball commentary (not every ball)
      if (over.balls) {
        over.balls.forEach((ball, bi) => {
          // Only comment on interesting deliveries
          if (ball === 'W' || ball === 4 || (typeof ball === 'number' && ball >= 6)) {
            const batter = batsmen[Math.min(totalWickets, batsmen.length - 1)]?.name || 'Batsman';
            const bowler = bowlers[oi % bowlers.length]?.name || 'Bowler';
            const comm = this.generateBallCommentary(ball, over.over, bi, batter, bowler);
            comments.push({
              over: over.over + '.' + (bi + 1),
              text: comm,
              type: ball === 'W' ? 'wicket' : (ball >= 4 ? 'boundary' : 'normal')
            });

            if (ball === 'W') totalWickets++;
          }
        });
      }

      totalRuns += overRuns;

      // Over summary for every 3rd over or important overs
      if (over.over % 3 === 0 || over.over === 6 || overWickets > 0 || overRuns >= 12) {
        comments.push({
          over: over.over + '.6',
          text: this.generateOverSummary(over.over, overRuns, totalRuns, totalWickets),
          type: 'highlight'
        });
      }

      // Phase change
      if (over.over === 6) {
        const pc = this.generatePhaseChange('middle', innings.batting, totalRuns, totalWickets);
        if (pc) comments.push({ over: over.over + '.6', text: pc, type: 'highlight' });
      }
      if (over.over === 15 && match.format === 'T20') {
        const pc = this.generatePhaseChange('death', innings.batting, totalRuns, totalWickets);
        if (pc) comments.push({ over: over.over + '.6', text: pc, type: 'highlight' });
      }
    });

    return comments;
  },

  // Render commentary into DOM
  renderCommentary(containerId, comments) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = comments.slice().reverse().map(c => `
      <div class="commentary-item ${c.type}">
        <span class="commentary-over">${c.over}</span>
        <span class="commentary-text">${c.text}</span>
      </div>
    `).join('');
  }
};
