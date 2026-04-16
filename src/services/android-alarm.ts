import { registerPlugin } from '@capacitor/core';

export interface AndroidAlarmItem {
  id: string;
  title: string;
  body: string;
  dueAt: string;
  audioDataUrl?: string;
  audioFileName?: string;
}

export interface EdenAlarmPlugin {
  syncAlarms(payload: { alarms: AndroidAlarmItem[] }): Promise<{ scheduled?: number }>;
  stopAlarm(payload: { alarmId?: string }): Promise<{ ok: boolean }>;
  getAlarmCapabilities(): Promise<{ canScheduleExactAlarms: boolean; platform: string }>;
  openAlarmSettings(): Promise<{ ok: boolean }>;
}

export const EdenAlarm = registerPlugin<EdenAlarmPlugin>('EdenAlarm');
