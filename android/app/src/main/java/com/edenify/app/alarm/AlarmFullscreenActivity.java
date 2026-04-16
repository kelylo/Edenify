package com.edenify.app.alarm;

import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.Map;
import com.edenify.app.MainActivity;

public class AlarmFullscreenActivity extends AppCompatActivity {
    private static final int SNOOZE_MINUTES = 10;

    private String alarmId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                    | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            );
        }

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        alarmId = getIntent().getStringExtra(AlarmScheduler.EXTRA_ALARM_ID);
        String title = getIntent().getStringExtra("alarmTitle");
        String body = getIntent().getStringExtra("alarmBody");

        if (title == null || title.trim().isEmpty()) title = "Edenify Alarm";
        if (body == null || body.trim().isEmpty()) body = "Your task is due now.";

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setPadding(56, 72, 56, 72);
        root.setBackgroundColor(Color.parseColor("#120A0A"));

        TextView titleView = new TextView(this);
        titleView.setText(title);
        titleView.setTextSize(30f);
        titleView.setTextColor(Color.WHITE);
        titleView.setGravity(Gravity.CENTER);

        TextView bodyView = new TextView(this);
        bodyView.setText(body);
        bodyView.setTextSize(18f);
        bodyView.setTextColor(Color.parseColor("#F1E7E7"));
        bodyView.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams bodyParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        bodyParams.topMargin = 24;
        bodyParams.bottomMargin = 42;
        bodyView.setLayoutParams(bodyParams);

        Button snoozeButton = new Button(this);
        snoozeButton.setText("Postpone 10 min");
        snoozeButton.setAllCaps(false);
        snoozeButton.setTextSize(16f);
        snoozeButton.setOnClickListener((view) -> snoozeAlarm());

        Button openAppButton = new Button(this);
        openAppButton.setText("Enter Edenify");
        openAppButton.setAllCaps(false);
        openAppButton.setTextSize(16f);
        LinearLayout.LayoutParams appParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        appParams.topMargin = 16;
        openAppButton.setLayoutParams(appParams);
        openAppButton.setOnClickListener((view) -> {
            openAppAndDismiss();
        });

        Button skipButton = new Button(this);
        skipButton.setText("Skip");
        skipButton.setAllCaps(false);
        skipButton.setTextSize(16f);
        LinearLayout.LayoutParams skipParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        skipParams.topMargin = 16;
        skipButton.setLayoutParams(skipParams);
        skipButton.setOnClickListener((view) -> dismissAlarm());

        root.addView(titleView, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        root.addView(bodyView);
        root.addView(snoozeButton, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        root.addView(openAppButton, appParams);
        root.addView(skipButton, skipParams);
        root.addView(createSpacer());

        setContentView(root);
    }

    private TextView createSpacer() {
        TextView spacer = new TextView(this);
        spacer.setText("");
        spacer.setMinHeight(8);
        return spacer;
    }

    private void dismissAlarm() {
        stopPlaybackService();
        finishAndRemoveTask();
    }

    private void openAppAndDismiss() {
        stopPlaybackService();
        Intent openIntent = new Intent(this, MainActivity.class);
        openIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if (alarmId != null) {
            openIntent.putExtra(AlarmScheduler.EXTRA_ALARM_ID, alarmId);
        }
        startActivity(openIntent);
        finishAndRemoveTask();
    }

    private void snoozeAlarm() {
        if (alarmId == null || alarmId.trim().isEmpty()) {
            dismissAlarm();
            return;
        }

        AlarmStorage storage = new AlarmStorage(this);
        AlarmRecord record = storage.get(alarmId);
        if (record == null) {
            dismissAlarm();
            return;
        }

        long snoozedAt = System.currentTimeMillis() + (SNOOZE_MINUTES * 60_000L);
        AlarmRecord updated = new AlarmRecord(record.id, record.title, record.body, snoozedAt, record.audioFileName);
        Map<String, AlarmRecord> records = storage.readAll();
        records.put(alarmId, updated);
        storage.writeAll(records);

        AlarmScheduler.cancel(this, alarmId);
        AlarmScheduler.schedule(this, updated);
        dismissAlarm();
    }

    private void stopPlaybackService() {
        Intent stopIntent = new Intent(this, AlarmPlaybackService.class);
        stopIntent.setAction(AlarmScheduler.ACTION_STOP_ALARM);
        stopIntent.putExtra(AlarmScheduler.EXTRA_ALARM_ID, alarmId);
        androidx.core.content.ContextCompat.startForegroundService(this, stopIntent);
    }

    @Override
    public void onBackPressed() {
        // Keep alarm screen visible until the user explicitly chooses an action.
    }
}