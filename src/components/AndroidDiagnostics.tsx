import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const DEVICE_BRAND_INSTRUCTIONS: Record<string, { name: string; steps: string[] }> = {
  samsung: {
    name: 'Samsung',
    steps: [
      'Open Settings',
      'Tap Battery and device care',
      'Tap Battery',
      'Tap App battery saver or Battery optimization',
      'Find and tap "Edenify"',
      'Tap "Don\'t optimize" or disable',
    ],
  },
  xiaomi: {
    name: 'Xiaomi',
    steps: [
      'Open Settings',
      'Tap Battery & device care',
      'Tap Battery',
      'Tap App battery saver',
      'Find and disable Edenify',
      'Or go to Start-up manager and allow startup',
    ],
  },
  oneplus: {
    name: 'OnePlus',
    steps: [
      'Open Settings',
      'Tap Battery',
      'Tap Battery optimization',
      'Find and tap Edenify',
      'Set to "Unrestricted" ',
      'Confirm the change',
    ],
  },
  huawei: {
    name: 'Huawei',
    steps: [
      'Open Settings',
      'Tap Battery',
      'Tap App launch',
      'Find Edenify',
      'Toggle all switches to ON',
      'This allows background activity',
    ],
  },
  realme: {
    name: 'Realme/OPPO',
    steps: [
      'Open Settings',
      'Tap Battery',
      'Tap Battery optimization or Battery Saver',
      'Find Edenify and disable',
      'Go to App permissions > Permissions',
      'Allow all requested permissions',
    ],
  },
};

const AndroidDiagnostics: React.FC = () => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [deviceBrand, setDeviceBrand] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const detectDevice = async () => {
      try {
        // Check if running on Android using Capacitor
        const { Device } = await import('@capacitor/device');

        const info = await Device.getInfo();
        if (info.platform === 'android') {
          setIsAndroid(true);

          // Try to detect device manufacturer
          const manufacturer = (info as any).manufacturer?.toLowerCase() || '';
          if (manufacturer.includes('samsung')) {
            setDeviceBrand('samsung');
          } else if (manufacturer.includes('xiaomi')) {
            setDeviceBrand('xiaomi');
          } else if (manufacturer.includes('oneplus')) {
            setDeviceBrand('oneplus');
          } else if (manufacturer.includes('huawei')) {
            setDeviceBrand('huawei');
          } else if (manufacturer.includes('oppo') || manufacturer.includes('realme')) {
            setDeviceBrand('realme');
          } else {
            setDeviceBrand('');
          }
        }
      } catch {
        // Not running on Android or Capacitor not available
        setIsAndroid(false);
      }
    };

    void detectDevice();
  }, []);

  if (!isAndroid) return null;

  const brandInstructions = deviceBrand ? DEVICE_BRAND_INSTRUCTIONS[deviceBrand] : null;

  return (
    <section className="space-y-4">
      <h2 className="font-serif italic text-3xl text-primary">Android Setup</h2>
      <div className="bg-surface-container-low rounded-3xl p-2 border border-outline-variant/25 space-y-3">
        <div className="rounded-2xl border border-warning/35 bg-warning/5 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={18} />
            <div className="space-y-2 flex-1">
              <p className="font-label text-[11px] uppercase tracking-[0.15em] text-on-surface font-bold">
                Battery Optimization Detection
              </p>
              <p className="text-xs text-secondary">
                Edenify needs to be excluded from battery optimization to send alarms when the app is closed. This is a common Android requirement.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              try {
                // Request to open app settings
                if ((window as any).open) {
                  // For web-based access
                  (window as any).open('android-app://com.android.settings/', '_system');
                }
              } catch (error) {
                // Fallback: user will need to manually open settings
                alert('Please open Settings > Apps > Edenify > Battery > Don\'t optimize (or similar on your device)');
              }
            }}
            className="w-full px-4 py-2 rounded-full bg-warning text-on-surface text-xs font-bold uppercase tracking-[0.14em] hover:bg-warning-dark transition-colors"
          >
            Open Device Settings
          </button>

          {brandInstructions && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-on-surface">
                📱 {brandInstructions.name} Device Instructions:
              </p>
              <ol className="text-xs text-secondary space-y-1 list-decimal list-inside">
                {brandInstructions.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {!brandInstructions && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-on-surface">Generic Android Instructions:</p>
              <ol className="text-xs text-secondary space-y-1 list-decimal list-inside">
                <li>Go to Settings</li>
                <li>Search for "Battery optimization" or "Battery saver"</li>
                <li>Find Edenify in the list</li>
                <li>Set it to "Don't optimize" or disable the restriction</li>
                <li>Confirm the change</li>
              </ol>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 rounded-2xl flex items-center justify-between gap-3 text-sm font-bold text-primary hover:bg-surface-container-low transition-colors"
        >
          <span>Why is this needed?</span>
          <span className={cn("material-symbols-outlined transition-transform duration-300", isExpanded && "rotate-180")}>
            expand_more
          </span>
        </button>

        {isExpanded && (
          <div className="px-4 py-3 rounded-2xl border border-outline-variant/25 bg-surface-container-lowest space-y-2">
            <p className="text-xs text-secondary">
              <strong>Background Activity:</strong> When Android is in Doze mode or running aggressive battery optimization, your device suspends background processes. This prevents Edenify from sending alarms when the app is closed.
            </p>
            <p className="text-xs text-secondary">
              <strong>Solution:</strong> Excluding Edenify from battery optimization allows the app to keep running in the background and send timely reminders and alarms.
            </p>
            <p className="text-xs text-secondary">
              <strong>Result:</strong> Your Bible reminders at 06:30 and task alarms will work reliably even when the app is minimized or closed.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-3 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-on-surface">Already Configured?</span>
          </div>
          <p className="text-xs text-secondary">
            If you've already added Edenify to the exception list, alarms should reach you reliably. If issues persist, try:
          </p>
          <ul className="text-xs text-secondary space-y-1 list-disc list-inside">
            <li>Restarting your device</li>
            <li>Checking that Edenify has all requested permissions</li>
            <li>Enabling location access (some devices require this for exact alarms)</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AndroidDiagnostics;
