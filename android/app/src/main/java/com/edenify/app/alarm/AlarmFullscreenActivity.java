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
import com.edenify.app.MainActivity;

public class AlarmFullscreenActivity extends AppCompatActivity {
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

        String alarmId = getIntent().getStringExtra(AlarmScheduler.EXTRA_ALARM_ID);
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

        Button stopButton = new Button(this);
        stopButton.setText("Stop Alarm");
        stopButton.setAllCaps(false);
        stopButton.setTextSize(18f);
        stopButton.setOnClickListener((view) -> {
            Intent stopIntent = new Intent(this, AlarmPlaybackService.class);
            stopIntent.setAction(AlarmScheduler.ACTION_STOP_ALARM);
            stopIntent.putExtra(AlarmScheduler.EXTRA_ALARM_ID, alarmId);
            androidx.core.content.ContextCompat.startForegroundService(this, stopIntent);
            finishAndRemoveTask();
        });

        Button openAppButton = new Button(this);
        openAppButton.setText("Open Edenify");
        openAppButton.setAllCaps(false);
        openAppButton.setTextSize(16f);
        LinearLayout.LayoutParams appParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        appParams.topMargin = 16;
        openAppButton.setLayoutParams(appParams);
        openAppButton.setOnClickListener((view) -> {
            Intent openIntent = new Intent(this, MainActivity.class);
            openIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            if (alarmId != null) {
                openIntent.putExtra(AlarmScheduler.EXTRA_ALARM_ID, alarmId);
            }
            startActivity(openIntent);
        });

        root.addView(titleView, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        root.addView(bodyView);
        root.addView(stopButton, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        root.addView(openAppButton);

        setContentView(root);
    }

    @Override
    public void onBackPressed() {
        // Keep alarm screen visible until user explicitly stops alarm.
    }
}