package com.edenify.app.alarm;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.app.AlarmManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
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

    @PluginMethod
    public void getAlarmCapabilities(PluginCall call) {
        boolean canScheduleExactAlarms = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            AlarmManager alarmManager = (AlarmManager) getContext().getSystemService(android.content.Context.ALARM_SERVICE);
            canScheduleExactAlarms = alarmManager != null && alarmManager.canScheduleExactAlarms();
        }

        JSObject result = new JSObject();
        result.put("canScheduleExactAlarms", canScheduleExactAlarms);
        result.put("platform", "android");
        call.resolve(result);
    }

    @PluginMethod
    public void openAlarmSettings(PluginCall call) {
        Intent intent;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
            intent.setData(Uri.parse("package:" + getContext().getPackageName()));
        } else {
            intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + getContext().getPackageName()));
        }

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            getContext().startActivity(intent);
            JSObject result = new JSObject();
            result.put("ok", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Could not open alarm settings: " + error.getMessage());
        }
    }
}
