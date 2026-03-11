// ===== PARTICLE EFFECTS & SOUND EFFECTS =====

const Effects = {
  canvas: null,
  ctx: null,
  particles: [],
  animId: null,
  soundEnabled: true,
  audioCtx: null,

  init() {
    // Create particle canvas
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'particleCanvas';
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  },

  // ── Particle System ──
  createParticle(x, y, color, speed, size, life) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = speed * (0.5 + Math.random() * 0.5);
    return {
      x, y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2,
      size: size * (0.5 + Math.random() * 0.5),
      color,
      alpha: 1,
      life,
      maxLife: life,
      gravity: 0.08,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2
    };
  },

  // Boundary Effect (4s)
  triggerFour() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3;
    const colors = ['#00f0ff', '#00ff88', '#4488ff', '#ffffff'];

    for (let i = 0; i < 30; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(this.createParticle(centerX, centerY, color, 6, 4, 60));
    }

    this.playSound('four');
  },

  // Six Effect (6s)
  triggerSix() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3;
    const colors = ['#ff4466', '#ffaa00', '#ff66b2', '#a855f7', '#00f0ff', '#ffffff'];

    // Big burst
    for (let i = 0; i < 60; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(this.createParticle(centerX, centerY, color, 10, 5, 80));
    }

    // Trailing sparks
    for (let i = 0; i < 20; i++) {
      const color = '#ffaa00';
      this.particles.push(this.createParticle(
        centerX + (Math.random() - 0.5) * 200,
        centerY + (Math.random() - 0.5) * 100,
        color, 3, 2, 100
      ));
    }

    this.playSound('six');
  },

  // Wicket Effect
  triggerWicket() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Red flash particles
    for (let i = 0; i < 40; i++) {
      this.particles.push(this.createParticle(centerX, centerY, '#ff4466', 8, 3, 50));
    }

    // Screen flash
    if (this.ctx) {
      this.ctx.fillStyle = 'rgba(255,68,102,0.15)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.playSound('wicket');
  },

  // Win celebration
  triggerCelebration() {
    const colors = ['#00f0ff', '#00ff88', '#ffaa00', '#ff4466', '#a855f7', '#ff66b2', '#ffffff'];
    
    // Multi-point fireworks
    for (let burst = 0; burst < 5; burst++) {
      const x = window.innerWidth * (0.2 + Math.random() * 0.6);
      const y = window.innerHeight * (0.15 + Math.random() * 0.4);
      
      setTimeout(() => {
        for (let i = 0; i < 40; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(this.createParticle(x, y, color, 8, 4, 90));
        }
      }, burst * 300);
    }

    this.playSound('celebration');
  },

  // Animate particles
  animate() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotSpeed;
      p.life--;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0) return false;

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      // Draw particle (mix of shapes)
      if (Math.random() > 0.5) {
        // Circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
      } else {
        // Star/diamond
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }

      // Glow effect
      this.ctx.shadowBlur = p.size * 3;
      this.ctx.shadowColor = p.color;

      this.ctx.restore();
      return true;
    });

    this.animId = requestAnimationFrame(() => this.animate());
  },

  // ── Sound Effects (Web Audio API) ──
  initAudio() {
    if (this.audioCtx) return;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio not available');
    }
  },

  playSound(type) {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    switch (type) {
      case 'four':
        this.playTone(880, 0.15, 'sine', 0.3);
        setTimeout(() => this.playTone(1100, 0.1, 'sine', 0.2), 100);
        break;
      case 'six':
        this.playTone(660, 0.15, 'sine', 0.3);
        setTimeout(() => this.playTone(880, 0.15, 'sine', 0.3), 100);
        setTimeout(() => this.playTone(1320, 0.2, 'sine', 0.4), 200);
        break;
      case 'wicket':
        this.playTone(440, 0.3, 'sawtooth', 0.2);
        setTimeout(() => this.playTone(220, 0.4, 'sawtooth', 0.15), 150);
        break;
      case 'celebration':
        [0, 100, 200, 300, 400].forEach((delay, i) => {
          setTimeout(() => this.playTone(440 + i * 110, 0.2, 'sine', 0.2), delay);
        });
        break;
      case 'tick':
        this.playTone(1200, 0.05, 'sine', 0.1);
        break;
    }
  },

  playTone(freq, duration, type, volume) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // ignore audio errors
    }
  },

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const btn = document.getElementById('soundToggle');
    if (btn) {
      btn.textContent = this.soundEnabled ? '🔊' : '🔇';
      btn.classList.toggle('muted', !this.soundEnabled);
    }
  },

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.particles = [];
  }
};
