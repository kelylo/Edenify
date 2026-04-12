/**
 * Alarm Playback Service
 * Handles playing alarm sounds for task/Bible reminders
 * Works on browser (Web Audio API) and mobile (Capacitor)
 */

// Built-in alarm sounds (sine wave tones at different frequencies)
const ALARM_TONES = {
  'bell': { frequencies: [1048, 1318, 1568], pattern: [200, 100] },  // High bell-like tone
  'alarm': { frequencies: [800, 1000], pattern: [150, 150] },         // Classic alarm
  'chime': { frequencies: [523, 659, 784], pattern: [300, 200] },    // Melodic chime
  'pulse': { frequencies: [1200], pattern: [100, 100] },              // Pulse tone
};

interface AlarmConfig {
  name: string;
  duration?: number; // ms to play
  volume?: number;   // 0-1
  repeat?: boolean;  // Whether to loop
}

class AlarmManager {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  async playAlarm(config: AlarmConfig): Promise<void> {
    // Try mobile first (Capacitor)
    if (this.tryPlayMobileAlarm(config)) {
      return;
    }

    // Fall back to Web Audio API
    await this.playWebAlarm(config);
  }

  private tryPlayMobileAlarm(config: AlarmConfig): boolean {
    // Check if running in mobile context (Capacitor available)
    if (!('Capacitor' in window)) {
      return false;
    }

    try {
      // Capacitor would handle native alarm notification
      // This is a hook for future mobile implementation
      console.log('[Alarm] Mobile alarm would play:', config.name);
      return false; // For now, fall back to Web Audio
    } catch (error) {
      console.warn('[Alarm] Mobile alarm failed:', error);
      return false;
    }
  }

  private async playWebAlarm(config: AlarmConfig): Promise<void> {
    if (this.isPlaying) {
      console.warn('[Alarm] Already playing');
      return;
    }

    try {
      // Initialize AudioContext if needed
      if (!this.audioContext) {
        const audioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!audioContextClass) {
          console.error('[Alarm] Web Audio API not supported');
          return;
        }
        this.audioContext = new audioContextClass();
      }

      // Resume context if suspended (required on some browsers after user interaction)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isPlaying = true;
      const duration = config.duration || 5000; // 5s default
      const volume = config.volume ?? 0.3;
      const startTime = this.audioContext.currentTime;
      const endTime = startTime + (duration / 1000);

      // Create master gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.setValueAtTime(volume, startTime);

      const tone = ALARM_TONES[config.name as keyof typeof ALARM_TONES] || ALARM_TONES.alarm;

      // Create oscillators for the tone
      for (const frequency of tone.frequencies) {
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);
        osc.connect(this.gainNode);
        osc.start(startTime);
        osc.stop(endTime);
        this.oscillators.push(osc);
      }

      // Fade out at the end
      this.gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

      // Cleanup after playing
      setTimeout(() => {
        this.stopAlarm();
      }, duration + 100);
    } catch (error) {
      console.error('[Alarm] Web Audio playback failed:', error);
      this.isPlaying = false;
    }
  }

  stopAlarm(): void {
    if (!this.isPlaying) return;

    try {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      this.oscillators = [];

      if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(0, this.audioContext?.currentTime || 0);
      }
    } catch (error) {
      console.warn('[Alarm] Stop failed:', error);
    }

    this.isPlaying = false;
  }

  async playCustomAlarm(dataUrl: string, duration = 5000): Promise<void> {
    if (!dataUrl) return;

    try {
      if (!this.audioContext) {
        const audioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!audioContextClass) return;
        this.audioContext = new audioContextClass();
      }

      const response = await fetch(dataUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.isPlaying = true;
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Route through gain for volume control
      if (!this.gainNode) {
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
      }

      source.connect(this.gainNode);
      source.start(0);

      setTimeout(() => {
        source.stop();
        this.isPlaying = false;
      }, Math.min(duration, audioBuffer.duration * 1000));
    } catch (error) {
      console.warn('[Alarm] Custom audio playback failed:', error);
      this.isPlaying = false;
    }
  }
}

// Global alarm instance
let alarmManager: AlarmManager | null = null;

export function getAlarmManager(): AlarmManager {
  if (!alarmManager) {
    alarmManager = new AlarmManager();
  }
  return alarmManager;
}

export async function playTaskAlarm(taskName: string, customAudioUrl?: string): Promise<void> {
  const manager = getAlarmManager();

  if (customAudioUrl) {
    // Play custom uploaded audio
    await manager.playCustomAlarm(customAudioUrl, 8000);
  } else {
    // Play builtin tone
    await manager.playAlarm({
      name: 'alarm',
      duration: 8000,
      volume: 0.4,
    });
  }

  console.log(`[Alarm] Playing alarm for task: ${taskName}`);
}

export async function playBibleReminderAlarm(): Promise<void> {
  const manager = getAlarmManager();
  await manager.playAlarm({
    name: 'chime',
    duration: 6000,
    volume: 0.35,
  });

  console.log('[Alarm] Playing Bible reminder chime');
}

export function stopAlarm(): void {
  const manager = getAlarmManager();
  manager.stopAlarm();
  console.log('[Alarm] Stopped');
}
