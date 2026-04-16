/**
 * Alarm Playback Service
 * Upload-only policy: play user-provided audio only.
 */

class AlarmManager {
  private isPlaying = false;
  private activeMedia: HTMLAudioElement | null = null;

  stopAlarm(): void {
    if (!this.isPlaying) return;

    try {
      if (this.activeMedia) {
        this.activeMedia.pause();
        this.activeMedia.currentTime = 0;
        this.activeMedia = null;
      }
    } catch (error) {
      console.warn('[Alarm] Stop failed:', error);
    }

    this.isPlaying = false;
  }

  async playCustomAlarm(dataUrl: string): Promise<void> {
    if (!dataUrl) return;

    try {
      this.stopAlarm();

      this.isPlaying = true;
      const media = new Audio(dataUrl);
      media.volume = 1;
      media.loop = false;
      media.onended = () => {
        this.isPlaying = false;
        if (this.activeMedia === media) {
          this.activeMedia = null;
        }
      };

      await media.play();
      this.activeMedia = media;
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
  if (!customAudioUrl) {
    console.warn(`[Alarm] Skipped for task "${taskName}" because no uploaded audio is configured.`);
    return;
  }

  const manager = getAlarmManager();
  await manager.playCustomAlarm(customAudioUrl);

  console.log(`[Alarm] Playing alarm for task: ${taskName}`);
}

export async function playBibleReminderAlarm(customAudioUrl?: string): Promise<void> {
  await playTaskAlarm('Daily Scripture', customAudioUrl);
}

export function stopAlarm(): void {
  const manager = getAlarmManager();
  manager.stopAlarm();
  console.log('[Alarm] Stopped');
}
