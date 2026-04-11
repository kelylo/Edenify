import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { Bell, Shield, LogOut, Award, Zap, Target, Sparkles, Download, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Profile: React.FC = () => {
  const { user, setUser, stats: appStats, layers } = useApp();
  const [telegramStatus, setTelegramStatus] = useState('');
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [bibleReminderDraft, setBibleReminderDraft] = useState('06:30');
  const [bibleReminderStatus, setBibleReminderStatus] = useState('');
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [pwaStatus, setPwaStatus] = useState('');
  const [isStandalone, setIsStandalone] = useState<boolean>(() => window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true);

  const level = useMemo(() => Math.round(layers.reduce((acc, layer) => acc + layer.level, 0) / Math.max(1, layers.length)), [layers]);
  const xp = useMemo(() => layers.reduce((acc, layer) => acc + layer.xp, 0), [layers]);
  const maxXp = useMemo(() => layers.reduce((acc, layer) => acc + layer.maxXp, 0), [layers]);

  useEffect(() => {
    if (!user) return;

    const raw = (user.preferences.bibleReminderTime || '06:30').trim().toUpperCase();
    const match12 = raw.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    const match24 = raw.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);

    if (match24) {
      setBibleReminderDraft(`${String(Number(match24[1])).padStart(2, '0')}:${match24[2]}`);
      return;
    }

    if (match12) {
      let hours = Number(match12[1]);
      const minutes = Number(match12[2]);
      const period = match12[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      setBibleReminderDraft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    }
  }, [user?.preferences.bibleReminderTime]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as any);
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const updateStandaloneMode = () => {
      setIsStandalone(mediaQuery.matches || (window.navigator as any).standalone === true);
    };

    updateStandaloneMode();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    mediaQuery.addEventListener('change', updateStandaloneMode);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', updateStandaloneMode);
    };
  }, []);

  if (!user) return null;

  const updatePreference = <K extends keyof typeof user.preferences>(key: K, value: typeof user.preferences[K]) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [key]: value,
      },
    });
  };

  const updateNotifications = (key: keyof typeof user.preferences.notifications, value: boolean) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        notifications: {
          ...user.preferences.notifications,
          [key]: value,
        },
      },
    });
  };

  const readFileAsDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.readAsDataURL(file);
  });

  const handleAvatarUpload = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setTelegramStatus('Please upload a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setTelegramStatus('Image is too large. Use a file under 5MB.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUser({ ...user, avatar: dataUrl });
      setTelegramStatus('Profile image updated.');
    } catch {
      setTelegramStatus('Could not upload profile image.');
    }
  };

  const confirmBibleReminderTime = () => {
    if (!/^([0-1]?\d|2[0-3]):([0-5]\d)$/.test(bibleReminderDraft)) {
      setBibleReminderStatus('Invalid time. Use the time picker.');
      return;
    }
    updatePreference('bibleReminderTime', bibleReminderDraft);
    setBibleReminderStatus(`Bible reminder saved at ${bibleReminderDraft}.`);
  };

  const testTelegramConnection = async () => {
    const chatId = (user.preferences.telegramChatId || '').trim();
    const accountKey = (user.id || user.email || '').trim().toLowerCase();
    const normalizedChatId = chatId.replace(/[^0-9-]/g, '');

    if (normalizedChatId !== chatId) {
      updatePreference('telegramChatId', normalizedChatId);
    }

    const validChatId = /^-?\d{6,20}$/.test(normalizedChatId);

    if (!validChatId) {
      setTelegramStatus('Telegram chat ID must be numeric (example: 123456789 or -1001234567890).');
      return;
    }

    if (!chatId) {
      setTelegramStatus('Please paste your Telegram chat ID first.');
      return;
    }

    setTestingTelegram(true);
    setTelegramStatus('Sending test message...');

    try {
      const response = await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: normalizedChatId,
          message: 'Edenify is connected. You will now receive task reminders here.',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        setTelegramStatus(data?.error || 'Could not connect Telegram.');
        return;
      }

      await fetch('/api/telegram/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: normalizedChatId,
          userId: accountKey,
        }),
      });

      setTelegramStatus('Telegram connected successfully.');
    } catch (error) {
      setTelegramStatus('Network error while connecting Telegram.');
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleInstallApp = async () => {
    if (!installPromptEvent) {
      setPwaStatus('Install prompt is not available yet. Open Edenify in your browser and use Install App from the browser menu.');
      return;
    }

    installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;
    if (choice?.outcome === 'accepted') {
      setPwaStatus('Install request accepted. Edenify should appear as an app shortly.');
    } else {
      setPwaStatus('Install was dismissed. You can try again anytime.');
    }
    setInstallPromptEvent(null);
  };

  const handleUninstallHint = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      setPwaStatus('Local app cache removed. To fully uninstall, remove Edenify from your OS/browser apps list.');
    } catch {
      setPwaStatus('Could not clear local app cache. You can still uninstall from your device app settings.');
    }
  };

  const stats = [
    { label: 'Level', value: `${level}`, icon: Award, color: 'text-primary' },
    { label: 'XP', value: `${xp}/${maxXp}`, icon: Zap, color: 'text-amber-500' },
    { label: 'Progress', value: `${Math.round(appStats.overallProgress)}%`, icon: Target, color: 'text-emerald-500' },
  ];

  const sectionTitleClass = 'font-serif italic text-3xl text-primary';
  const panelClass = 'bg-surface-container-low rounded-3xl p-2 border border-outline-variant/25';

  return (
    <div className="p-4 sm:p-6 space-y-10 pb-36 max-w-3xl mx-auto">
      <section className="rounded-[2.25rem] p-6 bg-gradient-to-br from-[#f6ded1] to-[#fef9f2] text-center border border-outline-variant/20">
        <div className="mx-auto relative w-fit mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center text-4xl font-serif italic shadow-[0_10px_24px_rgba(150,68,7,0.25)]">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <>{user.name?.slice(0, 2).toUpperCase() || 'U'}</>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center text-primary">
            <Award size={14} />
          </span>
        </div>
        <div className="mb-3">
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-[11px] font-bold uppercase tracking-[0.14em] cursor-pointer">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
            />
          </label>
        </div>
        <h1 className="text-5xl font-serif italic text-on-surface">{user.name}</h1>
        <p className="text-sm text-secondary mt-1">{user.email}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/80 px-4 py-2 border border-white/50">
          <Sparkles size={14} className="text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Level {level} • Champion</span>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-3 text-center space-y-1">
            <stat.icon size={18} className={cn('mx-auto', stat.color)} />
            <p className="text-lg font-serif font-medium">{stat.value}</p>
            <p className="text-[8px] uppercase tracking-widest font-bold text-secondary opacity-50">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitleClass}>Notifications</h2>
        <div className={panelClass}>
          {([
            ['taskReminders', 'Task reminders', Bell],
            ['dailyScripture', 'Daily scripture', Sparkles],
            ['streakProtection', 'Streak protection', Shield],
          ] as const).map(([key, label, Icon], idx, arr) => (
            <div key={key} className={cn('px-4 py-3 flex items-center justify-between gap-3 rounded-2xl', idx < arr.length - 1 && 'border-b border-outline-variant/25')}>
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-secondary" />
                <span className="text-sm text-on-surface">{label}</span>
              </div>
              <button
                aria-label={`Toggle ${label}`}
                onClick={() => updateNotifications(key, !user.preferences.notifications[key])}
                className={cn(
                  'h-8 w-14 rounded-full relative transition-all duration-300 border',
                  user.preferences.notifications[key]
                    ? 'bg-gradient-to-r from-primary to-primary-container border-primary/40 shadow-[0_8px_20px_rgba(150,68,7,0.25)]'
                    : 'bg-surface-container-low border-outline-variant/60'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center',
                    user.preferences.notifications[key] ? 'translate-x-7' : 'translate-x-1'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', user.preferences.notifications[key] ? 'bg-primary' : 'bg-outline')} />
                </span>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => document.getElementById('profile-integrations')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full px-4 py-3 rounded-2xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-secondary" />
              <span className="text-sm text-on-surface">Telegram Bot</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[18px]">chevron_right</span>
          </button>

          <div className="px-4 py-3 rounded-2xl border-t border-outline-variant/25 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-outline font-bold">Bible Reminder Schedule</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-on-surface">Reminder Time</span>
              <input
                type="time"
                title="Bible reminder time"
                placeholder="06:30"
                value={bibleReminderDraft}
                onChange={(e) => setBibleReminderDraft(e.target.value)}
                className="w-28 rounded-xl border border-outline-variant/45 bg-surface-container-lowest px-2 py-1.5 text-sm text-right"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={confirmBibleReminderTime}
                className="px-3 py-1.5 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-[0.14em]"
              >
                Confirm Time
              </button>
            </div>
            {bibleReminderStatus && <p className="text-xs text-secondary">{bibleReminderStatus}</p>}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-on-surface">Alarm Ring</span>
              <button
                aria-label="Toggle Bible reminder alarm"
                onClick={() => updatePreference('bibleReminderAlarm', !user.preferences.bibleReminderAlarm)}
                className={cn(
                  'h-8 w-14 rounded-full relative transition-all duration-300 border',
                  user.preferences.bibleReminderAlarm
                    ? 'bg-gradient-to-r from-primary to-primary-container border-primary/40 shadow-[0_8px_20px_rgba(150,68,7,0.25)]'
                    : 'bg-surface-container-low border-outline-variant/60'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center',
                    user.preferences.bibleReminderAlarm ? 'translate-x-7' : 'translate-x-1'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', user.preferences.bibleReminderAlarm ? 'bg-primary' : 'bg-outline')} />
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-on-surface">Telegram Message</span>
              <button
                aria-label="Toggle Bible reminder telegram"
                onClick={() => updatePreference('bibleReminderTelegram', !user.preferences.bibleReminderTelegram)}
                className={cn(
                  'h-8 w-14 rounded-full relative transition-all duration-300 border',
                  user.preferences.bibleReminderTelegram
                    ? 'bg-gradient-to-r from-primary to-primary-container border-primary/40 shadow-[0_8px_20px_rgba(150,68,7,0.25)]'
                    : 'bg-surface-container-low border-outline-variant/60'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center',
                    user.preferences.bibleReminderTelegram ? 'translate-x-7' : 'translate-x-1'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', user.preferences.bibleReminderTelegram ? 'bg-primary' : 'bg-outline')} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="profile-integrations" className="space-y-4">
        <h2 className={sectionTitleClass}>Focus</h2>
        <div className={panelClass}>
          <div className="px-4 py-3 rounded-2xl flex items-center justify-between">
            <span className="text-sm text-on-surface">Default Focus Duration</span>
            <input
              type="number"
              min={5}
              title="Focus minutes"
              placeholder="Focus minutes"
              value={user.preferences.focusDuration}
              onChange={(e) => updatePreference('focusDuration', Math.max(5, Number(e.target.value || 25)))}
              className="w-20 rounded-xl border border-outline-variant/45 bg-surface-container-lowest px-2 py-1.5 text-sm text-right"
            />
          </div>
          <div className="px-4 py-3 rounded-2xl flex items-center justify-between border-t border-outline-variant/25">
            <span className="text-sm text-on-surface">Default Break Duration</span>
            <input
              type="number"
              min={3}
              title="Break minutes"
              placeholder="Break minutes"
              value={user.preferences.shortBreakDuration}
              onChange={(e) => updatePreference('shortBreakDuration', Math.max(3, Number(e.target.value || 5)))}
              className="w-20 rounded-xl border border-outline-variant/45 bg-surface-container-lowest px-2 py-1.5 text-sm text-right"
            />
          </div>
          <div className="px-4 py-3 rounded-2xl flex items-center justify-between border-t border-outline-variant/25">
            <span className="text-sm text-on-surface">Focus Audio</span>
            <span className="text-xs text-secondary">Upload-only playlist in Focus page</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitleClass}>Integrations</h2>
        <div className={panelClass}>
          <div className="rounded-2xl border border-outline-variant/35 bg-surface-container-lowest p-4 space-y-3">
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline font-bold">Telegram Bot Connection</p>
          <p className="text-xs text-secondary">
            Open Telegram, talk to your bot, copy your numeric chat ID, then paste it here to receive task notifications.
          </p>

          <input
            value={user.preferences.telegramChatId || ''}
            onChange={(e) => updatePreference('telegramChatId', e.target.value)}
            placeholder="Paste Telegram chat ID"
            className="w-full rounded-xl border border-outline-variant/45 bg-surface-container-low px-3 py-2 text-sm"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={testTelegramConnection}
              disabled={testingTelegram}
              className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-70"
            >
              {testingTelegram ? 'Testing...' : 'Test Connection'}
            </button>
            {telegramStatus && <p className="text-xs text-secondary">{telegramStatus}</p>}
          </div>

          <div className="mt-2 rounded-xl border border-outline-variant/25 bg-surface-container-low p-3 space-y-2">
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline font-bold">Bot Commands</p>
            <p className="text-xs text-secondary">/set, /delete, /edit or /modify, /tasks, /chatid, /defaults, /cancel</p>
            <p className="text-xs text-secondary">Tasks created/edited/deleted in bot will sync to your app when chat ID is connected.</p>
          </div>
        </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitleClass}>Account</h2>
        <div className={panelClass}>
          <div className="px-4 py-3 rounded-2xl flex items-center justify-between border-b border-outline-variant/25">
            <span className="text-sm text-on-surface">Edit Profile</span>
            <span className="material-symbols-outlined text-outline-variant text-[18px]">chevron_right</span>
          </div>
          <div className="px-4 py-3 rounded-2xl flex items-center justify-between border-b border-outline-variant/25">
            <span className="text-sm text-on-surface">Change Password</span>
            <span className="material-symbols-outlined text-outline-variant text-[18px]">chevron_right</span>
          </div>
          <div className="px-4 py-3 text-xs text-secondary flex items-center gap-2">
            <Shield size={14} />
            Preferences are synced with your account state.
          </div>
        </div>
      </section>

      <div className="pt-1">
        <div className="mb-3 rounded-3xl border border-outline-variant/30 bg-surface-container-low p-4 space-y-3">
          <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold">App Install Controls</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleInstallApp}
              className="px-3 py-2 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1"
            >
              <Download size={13} />
              {isStandalone ? 'Installed' : 'Install App'}
            </button>
            <button
              type="button"
              onClick={handleUninstallHint}
              className="px-3 py-2 rounded-full bg-surface-container-lowest text-secondary border border-outline-variant/45 text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1"
            >
              <Trash2 size={13} />
              Uninstall Help
            </button>
          </div>
          {pwaStatus && <p className="text-xs text-secondary">{pwaStatus}</p>}
        </div>

        <button
          onClick={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
            } catch (error) {
              console.warn('Logout session clear failed:', error);
            }
            setUser(null);
          }}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-3xl bg-red-50 text-red-600 border border-red-100 font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-colors shadow-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <footer className="text-center opacity-45 pt-4">
        <p className="font-serif italic text-sm">Edenify Version 2.4.1</p>
        <p className="text-[10px] uppercase tracking-[0.14em] mt-1">Made for the disciplined soul</p>
      </footer>
    </div>
  );
};

export default Profile;
