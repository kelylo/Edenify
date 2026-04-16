package com.edenify.app.alarm;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Base64;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;

public final class AlarmStorage {
    private static final String PREFS_NAME = "edenify_native_alarms";
    private static final String KEY_RECORDS = "records";
    private static final String AUDIO_DIR = "edenify_alarm_audio";

    private final Context context;

    public AlarmStorage(Context context) {
        this.context = context.getApplicationContext();
    }

    public Map<String, AlarmRecord> readAll() {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String raw = prefs.getString(KEY_RECORDS, "{}");
        Map<String, AlarmRecord> records = new LinkedHashMap<>();

        try {
            JSONObject root = new JSONObject(raw == null ? "{}" : raw);
            for (java.util.Iterator<String> iterator = root.keys(); iterator.hasNext(); ) {
                String key = iterator.next();
                JSONObject item = root.optJSONObject(key);
                if (item == null) continue;
                records.put(key, fromStoredJson(item));
            }
        } catch (JSONException ignored) {
            // Return empty store on corruption.
        }

        return records;
    }

    public AlarmRecord get(String alarmId) {
        return readAll().get(alarmId);
    }

    public void writeAll(Map<String, AlarmRecord> records) {
        JSONObject root = new JSONObject();
        for (Map.Entry<String, AlarmRecord> entry : records.entrySet()) {
            try {
                root.put(entry.getKey(), entry.getValue().toJson());
            } catch (JSONException ignored) {
                // Skip malformed item.
            }
        }
        persist(root.toString());
    }

    public void remove(String alarmId) {
        Map<String, AlarmRecord> records = readAll();
        records.remove(alarmId);
        writeAll(records);
    }

    public AlarmRecord saveAudioFile(AlarmRecord record, String dataUrl) throws IOException {
        if (dataUrl == null || dataUrl.trim().isEmpty()) {
            return record;
        }

        String sanitized = sanitizeFileName(record.audioFileName.isEmpty() ? record.id : record.audioFileName);
        if (!sanitized.contains(".")) {
            sanitized = sanitized + ".m4a";
        }

        File dir = new File(context.getFilesDir(), AUDIO_DIR);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("Unable to create alarm audio directory.");
        }

        byte[] bytes = decodeDataUrl(dataUrl);
        File outFile = new File(dir, sanitized);
        try (FileOutputStream stream = new FileOutputStream(outFile, false)) {
            stream.write(bytes);
        }

        return new AlarmRecord(record.id, record.title, record.body, record.dueAtMillis, outFile.getName());
    }

    public Uri resolveAudioUri(AlarmRecord record) {
        if (record == null || !record.hasCustomAudio()) {
            return null;
        }

        File file = new File(new File(context.getFilesDir(), AUDIO_DIR), record.audioFileName);
        if (!file.exists()) return null;
        return Uri.fromFile(file);
    }

    private void persist(String rawJson) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_RECORDS, rawJson).apply();
    }

    private AlarmRecord fromStoredJson(JSONObject json) throws JSONException {
        return new AlarmRecord(
            json.optString("id", ""),
            json.optString("title", "Edenify Alarm"),
            json.optString("body", "Time for your alarm."),
            json.optLong("dueAtMillis", 0L),
            json.optString("audioFileName", "")
        );
    }

    private static byte[] decodeDataUrl(String dataUrl) {
        String payload = dataUrl;
        int commaIndex = dataUrl.indexOf(',');
        if (commaIndex >= 0) {
            payload = dataUrl.substring(commaIndex + 1);
        }
        return Base64.decode(payload.getBytes(StandardCharsets.UTF_8), Base64.DEFAULT);
    }

    private static String sanitizeFileName(String value) {
        return value.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
