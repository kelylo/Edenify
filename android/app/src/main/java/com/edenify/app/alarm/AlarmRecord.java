package com.edenify.app.alarm;

import org.json.JSONException;
import org.json.JSONObject;

public final class AlarmRecord {
    public final String id;
    public final String title;
    public final String body;
    public final long dueAtMillis;
    public final String audioFileName;

    public AlarmRecord(String id, String title, String body, long dueAtMillis, String audioFileName) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.dueAtMillis = dueAtMillis;
        this.audioFileName = audioFileName == null ? "" : audioFileName;
    }

    public boolean hasCustomAudio() {
        return audioFileName != null && !audioFileName.trim().isEmpty();
    }

    public JSONObject toJson() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("title", title);
        json.put("body", body);
        json.put("dueAtMillis", dueAtMillis);
        json.put("audioFileName", audioFileName);
        return json;
    }

    public static AlarmRecord fromJson(JSONObject json) {
        String id = String.valueOf(json.optString("id", "")).trim();
        String title = String.valueOf(json.optString("title", "Edenify Alarm")).trim();
        String body = String.valueOf(json.optString("body", "Time for your alarm.")).trim();
        String dueAt = String.valueOf(json.optString("dueAt", "")).trim();
        long dueAtMillis = parseDate(dueAt);
        String audioFileName = String.valueOf(json.optString("audioFileName", "")).trim();
        return new AlarmRecord(id, title, body, dueAtMillis, audioFileName);
    }

    private static long parseDate(String value) {
        try {
            return java.time.Instant.parse(value).toEpochMilli();
        } catch (Exception ignored) {
            return 0L;
        }
    }
}
