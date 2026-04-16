package com.edenify.app.alarm;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.content.ContextCompat;

public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String alarmId = intent != null ? intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_ID) : null;
        if (alarmId == null || alarmId.trim().isEmpty()) {
            return;
        }

        Intent serviceIntent = new Intent(context, AlarmPlaybackService.class);
        serviceIntent.setAction(AlarmScheduler.ACTION_PLAY_ALARM);
        serviceIntent.putExtra(AlarmScheduler.EXTRA_ALARM_ID, alarmId);
        ContextCompat.startForegroundService(context, serviceIntent);
    }
}
