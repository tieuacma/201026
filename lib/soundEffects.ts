// Web Audio API Synthesizer - Âm thanh dễ thương, lãng mạn không cần tải file ngoài
// Tự động kích hoạt khi người dùng tương tác, êm dịu và ngọt ngào

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Âm thanh mở con dấu sáp: tiếng "tách" giòn tan kết hợp tiếng chuông ngân vàng
 */
export function playSealPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Tiếng "Pop" nhẹ
  const popOsc = ctx.createOscillator();
  const popGain = ctx.createGain();

  popOsc.type = "sine";
  popOsc.frequency.setValueAtTime(600, now);
  popOsc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

  popGain.gain.setValueAtTime(0.2, now);
  popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  popOsc.connect(popGain);
  popGain.connect(ctx.destination);

  popOsc.start(now);
  popOsc.stop(now + 0.15);

  // 2. Tiếng chuông lấp lánh (Sparkle chime)
  const freqs = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const startTime = now + 0.05 + idx * 0.04;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.45);
  });
}

/**
 * Âm thanh hoa nở (Flower Bloom): Chuỗi hợp âm thụ hưởng thánh thót như đàn Harp thần tiên
 */
export function playFlowerBloomSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Chuỗi nốt ngũ cung thăng hoa: E4, G#4, B4, E5, G#5, B5, E6
  const arpNotes = [329.63, 415.30, 493.88, 659.25, 830.61, 987.77, 1318.51];

  arpNotes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const delayTime = idx * 0.08;
    const startTime = now + delayTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    // Envelope ngân vang mềm mại
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.09, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 1.3);
  });
}

/**
 * Âm thanh rút thư nhẹ nhàng (Paper slide)
 */
export function playPaperSlideSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.linearRampToValueAtTime(800, now + 0.35);

  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}

/**
 * Âm thanh bong bóng / tim nổ dễ thương (Cute bubble pop)
 */
export function playBubblePop(pitch = 1) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(500 * pitch, now);
  osc.frequency.exponentialRampToValueAtTime(900 * pitch, now + 0.08);

  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Âm thanh lấp lánh (Sparkle touch)
 */
export function playSparkleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(1800, now);
  osc.frequency.exponentialRampToValueAtTime(2400, now + 0.15);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}

/**
 * Âm thanh gấp giấy nhẹ nhàng (Paper fold/close)
 */
export function playPaperFoldSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(650, now);
  osc.frequency.linearRampToValueAtTime(320, now + 0.28);

  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.32);
}

/**
 * Âm thanh chuông thần tiên ngắn (Cute chime)
 */
export function playCuteChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [1318.51, 1567.98, 2093.0]; // E6, G6, C7
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.06;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.05, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.4);
  });
}
