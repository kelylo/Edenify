package com.edenify.app.alarm;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.provider.Settings;
import androidx.core.app.NotificationCompat;
import com.edenify.app.MainActivity;
import com.edenify.app.R;
import java.io.IOException;

public class AlarmPlaybackService extends Service {
    private static final String CHANNEL_ID = "edenify_alarm_channel";
    private static final int NOTIFICATION_ID = 8071;

    private MediaPlayer mediaPlayer;
    private String activeAlarmId;

    @Override
    public void onCreate() {
        super.onCreate();
        createChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && AlarmScheduler.ACTION_STOP_ALARM.equals(intent.getAction())) {
            stopPlayback();
            stopSelf();
            return START_NOT_STICKY;
        }

        String alarmId = intent != null ? intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_ID) : null;
        if (alarmId == null || alarmId.trim().isEmpty()) {
            stopSelf();
            return START_NOT_STICKY;
        }

        AlarmStorage storage = new AlarmStorage(this);
        AlarmRecord record = storage.get(alarmId);
        if (record == null) {
            stopSelf();
            return START_NOT_STICKY;
        }

        activeAlarmId = record.id;
        startForeground(NOTIFICATION_ID, buildNotification(record));
        startPlayback(storage, record);
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        stopPlayback();
        super.onDestroy();
    }

    private void startPlayback(AlarmStorage storage, AlarmRecord record) {
        stopPlayback();

        try {
            mediaPlayer = new MediaPlayer();
            mediaPlayer.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
            mediaPlayer.setAudioAttributes(
                new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            );
            mediaPlayer.setOnCompletionListener(player -> stopSelf());
            mediaPlayer.setOnErrorListener((player, what, extra) -> {
                stopSelf();
                return true;
            });

            Uri source = storage.resolveAudioUri(record);
            if (source != null) {
                mediaPlayer.setDataSource(this, source);
            } else {
                mediaPlayer.setDataSource(this, Settings.System.DEFAULT_ALARM_ALERT_URI);
            }

            mediaPlayer.setLooping(false);
            mediaPlayer.prepare();
            mediaPlayer.start();
        } catch (IOException | IllegalStateException error) {
            stopSelf();
        }
    }

    private Notification buildNotification(AlarmRecord record) {
        Intent launchIntent = new Intent(this, MainActivity.class);
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if (record.id != null) {
            launchIntent.putExtra(AlarmScheduler.EXTRA_ALARM_ID, record.id);
        }

        PendingIntent contentIntent = PendingIntent.getActivity(
            this,
            record.id.hashCode(),
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        PendingIntent stopIntent = AlarmScheduler.createStopIntent(this, record.id);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(record.title)
            .setContentText(record.body)
            .setContentIntent(contentIntent)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(false)
            .setSilent(true)
            .addAction(android.R.drawable.ic_media_pause, "Stop", stopIntent)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(record.body));

        return builder.build();
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }

        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager == null) return;

        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Edenify Alarms",
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Foreground alarm playback for Edenify");
        channel.enableVibration(true);
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        manager.createNotificationChannel(channel);
    }

    private void stopPlayback() {
        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
            } catch (IllegalStateException ignored) {
                // Ignore invalid state while stopping.
            }
            mediaPlayer.reset();
            mediaPlayer.release();
            mediaPlayer = null;
        }
        activeAlarmId = null;
    }
}
