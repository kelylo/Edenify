const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('edenNative', {
  platform: 'electron',
  syncAlarms: (payload) => ipcRenderer.invoke('native-alarms:sync', payload),
  stopAlarm: (alarmId) => ipcRenderer.invoke('native-alarms:stop', alarmId),
});
