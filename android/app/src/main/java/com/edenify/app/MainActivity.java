package com.edenify.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.edenify.app.alarm.EdenAlarmPlugin;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		registerPlugin(EdenAlarmPlugin.class);
		super.onCreate(savedInstanceState);
	}
}
