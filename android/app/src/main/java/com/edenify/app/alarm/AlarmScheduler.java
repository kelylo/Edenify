package com.edenify.app.alarm;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

public final class AlarmScheduler {
    static final String ACTION_PLAY_ALARM = "com.edenify.app.alarm.ACTION_PLAY_ALARM";
    static final String ACTION_STOP_ALARM = "com.edenify.app.alarm.ACTION_STOP_ALARM";
    static final String EXTRA_ALARM_ID = "alarmId";

    private AlarmScheduler() {}

    public static void sync(Context context, Map<String, AlarmRecord> records) {
        AlarmStorage storage = new AlarmStorage(context);
        Map<String, AlarmRecord> existing = storage.readAll();
        Set<String> incomingIds = new HashSet<>(records.keySet());

        for (String existingId : existing.keySet()) {
            if (!incomingIds.contains(existingId)) {
                cancel(context, existingId);
            }
        }

        storage.writeAll(records);
        for (AlarmRecord record : records.values()) {
            schedule(context, record);
        }
    }

    public static void schedule(Context context, AlarmRecord record) {
        if (record == null || record.id == null || record.id.trim().isEmpty()) {
            return;
        }

        long when = record.dueAtMillis;
        if (when <= 0L) return;

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        PendingIntent trigger = createTriggerIntent(context, record.id, PendingIntent.FLAG_UPDATE_CURRENT);
        if (trigger == null) return;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, when, trigger);
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, when, trigger);
        }
    }

    public static void cancel(Context context, String alarmId) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        PendingIntent trigger = createTriggerIntent(context, alarmId, PendingIntent.FLAG_NO_CREATE);
        if (alarmManager != null && trigger != null) {
            alarmManager.cancel(trigger);
        }
        if (trigger != null) {
            trigger.cancel();
        }
    }

    public static void rescheduleAll(Context context) {
        AlarmStorage storage = new AlarmStorage(context);
        Map<String, AlarmRecord> records = storage.readAll();
        for (AlarmRecord record : records.values()) {
            schedule(context, record);
        }
    }

    static PendingIntent createTriggerIntent(Context context, String alarmId, int flags) {
        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.setAction(ACTION_PLAY_ALARM);
        intent.putExtra(EXTRA_ALARM_ID, alarmId);

        int finalFlags = flags | PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getBroadcast(context, alarmId.hashCode(), intent, finalFlags);
    }

    static PendingIntent createStopIntent(Context context, String alarmId) {
        Intent intent = new Intent(context, AlarmPlaybackService.class);
        intent.setAction(ACTION_STOP_ALARM);
        intent.putExtra(EXTRA_ALARM_ID, alarmId);
        return PendingIntent.getService(context, (alarmId + "-stop").hashCode(), intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
}
