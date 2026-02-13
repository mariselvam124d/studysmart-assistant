import confetti from 'canvas-confetti';

// Sound effects using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

export function playAchievementSound() {
  if (!audioContext) return;
  // Cheerful ascending arpeggio
  playTone(523.25, 0.15, 'sine', 0.2); // C5
  setTimeout(() => playTone(659.25, 0.15, 'sine', 0.2), 100); // E5
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.2), 200); // G5
  setTimeout(() => playTone(1046.50, 0.3, 'sine', 0.25), 300); // C6
}

export function playLevelUpSound() {
  if (!audioContext) return;
  // More dramatic ascending fanfare
  playTone(392.00, 0.12, 'square', 0.15); // G4
  setTimeout(() => playTone(523.25, 0.12, 'square', 0.15), 100); // C5
  setTimeout(() => playTone(659.25, 0.12, 'square', 0.15), 200); // E5
  setTimeout(() => playTone(783.99, 0.12, 'square', 0.15), 300); // G5
  setTimeout(() => playTone(1046.50, 0.4, 'sine', 0.3), 400); // C6
}

export function playPointsSound() {
  if (!audioContext) return;
  playTone(880, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(1100, 0.15, 'sine', 0.1), 80);
}

export function fireConfetti() {
  // Burst from both sides
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  confetti({ ...defaults, particleCount: 50, origin: { x: 0.2, y: 0.6 } });
  confetti({ ...defaults, particleCount: 50, origin: { x: 0.8, y: 0.6 } });
}

export function fireLevelUpConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#7c3aed', '#a855f7', '#c084fc'],
      zIndex: 9999,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#7c3aed', '#a855f7', '#c084fc'],
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

export function fireAchievementConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff'],
    zIndex: 9999,
  });
}
