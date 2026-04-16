/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface EdenNativeBridge {
	platform: 'electron';
	syncAlarms: (payload: { alarms: Array<{ id: string; title: string; body: string; dueAt: string }> }) => Promise<{ scheduled?: number }>;
	stopAlarm: (alarmId: string) => Promise<{ ok: boolean }>;
}

interface Window {
	edenNative?: EdenNativeBridge;
}
