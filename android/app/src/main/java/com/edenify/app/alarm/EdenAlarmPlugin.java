package com.edenify.app.alarm;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.json.JSONException;

@CapacitorPlugin(name = "EdenAlarm")
public class EdenAlarmPlugin extends Plugin {
    private AlarmStorage storage;

    @Override
    public void load() {
        storage = new AlarmStorage(getContext());
    }

    @PluginMethod
    public void syncAlarms(PluginCall call) {
        JSArray alarms = call.getArray("alarms");
        if (alarms == null) {
            call.reject("alarms is required.");
            return;
        }

        Map<String, AlarmRecord> incoming = new LinkedHashMap<>();
        for (int index = 0; index < alarms.length(); index += 1) {
            JSObject item;
            try {
                item = JSObject.fromJSONObject(alarms.getJSONObject(index));
            } catch (JSONException error) {
                continue;
            }

            AlarmRecord record = AlarmRecord.fromJson(item);
            if (record.id == null || record.id.trim().isEmpty()) continue;

            String audioDataUrl = item.optString("audioDataUrl", "");
            if (audioDataUrl != null && !audioDataUrl.trim().isEmpty()) {
                try {
                    record = storage.saveAudioFile(record, audioDataUrl);
                } catch (IOException error) {
                    call.reject("Failed to save alarm audio: " + error.getMessage());
                    return;
                }
            }

            incoming.put(record.id, record);
        }

        Map<String, AlarmRecord> existing = storage.readAll();
        for (String existingId : existing.keySet()) {
            if (!incoming.containsKey(existingId)) {
                AlarmScheduler.cancel(getContext(), existingId);
            }
        }

        storage.writeAll(incoming);
        for (AlarmRecord record : incoming.values()) {
            AlarmScheduler.schedule(getContext(), record);
        }

        JSObject result = new JSObject();
        result.put("scheduled", incoming.size());
        call.resolve(result);
    }

    @PluginMethod
    public void stopAlarm(PluginCall call) {
        String alarmId = call.getString("alarmId");
        if (alarmId != null && !alarmId.trim().isEmpty()) {
            AlarmScheduler.cancel(getContext(), alarmId.trim());
        }

        android.content.Intent stopIntent = new android.content.Intent(getContext(), AlarmPlaybackService.class);
        stopIntent.setAction(AlarmScheduler.ACTION_STOP_ALARM);
        androidx.core.content.ContextCompat.startForegroundService(getContext(), stopIntent);

        JSObject result = new JSObject();
        result.put("ok", true);
        call.resolve(result);
    }
}
