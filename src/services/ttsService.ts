import { AudioSettings } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Convert base64 PCM (24000Hz 16-bit PCM little-endian) to AudioBuffer
function pcmToAudioBuffer(base64Data: string, sampleRate = 24000): AudioBuffer {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert 16-bit PCM (2 bytes per sample) to Float32Array (-1.0 to 1.0)
  const int16Array = new Int16Array(bytes.buffer);
  const numSamples = int16Array.length;

  const ctx = getAudioContext();
  const audioBuffer = ctx.createBuffer(1, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    channelData[i] = int16Array[i] / 32768.0;
  }

  return audioBuffer;
}

let currentAudioSource: AudioBufferSourceNode | null = null;

export function stopAllAudio(): void {
  if (currentAudioSource) {
    try {
      currentAudioSource.stop();
      currentAudioSource.disconnect();
    } catch (e) {}
    currentAudioSource = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

// Play AudioBuffer
function playAudioBuffer(buffer: AudioBuffer, rate = 1.0): Promise<void> {
  return new Promise((resolve) => {
    try {
      stopAllAudio();
      const ctx = getAudioContext();
      const source = ctx.createBufferSource();
      currentAudioSource = source;
      source.buffer = buffer;
      source.playbackRate.value = rate;
      source.connect(ctx.destination);
      source.onended = () => {
        if (currentAudioSource === source) {
          currentAudioSource = null;
        }
        resolve();
      };
      source.start(0);
    } catch (e) {
      console.error('Failed to play PCM audio buffer', e);
      resolve();
    }
  });
}

// Speak using browser SpeechSynthesis with PRESERVED Tashkeel (Arabic diacritics)
function speakNative(text: string, settings: AudioSettings): Promise<void> {
  return new Promise((resolve) => {
    stopAllAudio();
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    // Preserve Tashkeel so Arabic vowels are spoken correctly
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'ar-SA';
    utterance.rate = settings.rate || 0.82;
    utterance.pitch = settings.voiceGender === 'female' ? 1.15 : 0.95;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const arVoice =
      voices.find((v) => v.lang === 'ar-SA') ||
      voices.find((v) => v.lang === 'ar-EG') ||
      voices.find((v) => v.lang && v.lang.startsWith('ar')) ||
      null;

    if (arVoice) {
      utterance.voice = arVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn('Native speech error:', e);
      resolve();
    };

    // Fix for Android/Safari silent speech issue
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 60);
  });
}

// Main high-precision speak function combining Gemini TTS + Native Fallback
export async function speakText(
  text: string,
  settings: AudioSettings,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  stopAllAudio();
  onStart?.();

  // 1. Try Gemini AI Voice if engine is 'auto' or 'gemini'
  if (settings.engine === 'gemini' || settings.engine === 'auto') {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: settings.voiceGender === 'female' ? 'Kore' : 'Zephyr',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio) {
          const sampleRate = data.mimeType?.includes('24000') ? 24000 : 24000;
          const buffer = pcmToAudioBuffer(data.audio, sampleRate);
          await playAudioBuffer(buffer, settings.rate >= 1 ? 1 : 0.9);
          onEnd?.();
          return;
        }
      }
    } catch (err) {
      console.warn('Gemini TTS endpoint unavailable, falling back to Native SpeechSynthesis:', err);
    }
  }

  // 2. Fallback to Native SpeechSynthesis with Tashkeel
  await speakNative(text, settings);
  onEnd?.();
}

// Play celebratory magic chime sound effects using Web Audio API
export function playMagicChime(): void {
  triggerHapticFeedback([50, 50, 80, 50, 120]);
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1318.5];
    const delays = [0, 0.1, 0.2, 0.3, 0.4, 0.52, 0.65];

    notes.forEach((freq, i) => {
      const t = ctx.currentTime + delays[i];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch (e) {
    console.error('Chime error', e);
  }
}

// Trigger haptic feedback (vibration) on mobile devices
export function triggerHapticFeedback(pattern: number | number[] = 40): void {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore error if vibration fails or permissions restricted
    }
  }
}

export function playButtonSound(): void {
  triggerHapticFeedback(35);
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {
    // Ignore audio context lock
  }
}
