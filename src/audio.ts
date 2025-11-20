let audioContext: AudioContext | null = null;

function initAudio(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export function playNatureTone(
  frequency: number = 220,
  duration: number = 0.2
): void {
  const ctx = initAudio();

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Create a filter for more natural sound
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = frequency * 2; // Filter out harsh harmonics
  filter.Q.value = 1;

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.type = "triangle";

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = Math.random() * 10 + 5; // 5-15 Hz modulation
  lfoGain.gain.value = frequency * 0.05; // Small frequency variation

  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);

  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  // More organic volume envelope - like insect or bird chirps
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + duration * 0.1); // Quick attack
  gainNode.gain.exponentialRampToValueAtTime(
    0.04,
    ctx.currentTime + duration * 0.3
  ); // Sustain
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // Natural decay

  lfo.start(ctx.currentTime);
  oscillator.start(ctx.currentTime);

  lfo.stop(ctx.currentTime + duration);
  oscillator.stop(ctx.currentTime + duration);
}
