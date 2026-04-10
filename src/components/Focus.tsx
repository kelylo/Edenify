import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play, RefreshCw, Upload, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface FocusProps {
  user: User | null;
  setUser: (user: User | null) => void;
  onClose: () => void;
}

const soundOptions = ['Rain Forest', 'Cathedral Air', 'Brown Noise', 'Light Wind', 'Stream Flow'];
const musicOptions = ['Instrumental Warmth', 'Piano Prayer', 'Ambient Strings', 'Lo-fi Study'];
const alarmOptions = ['Aggressive Bell', 'Emergency Pulse', 'Sharp Chime', 'Focus Siren'];

const Focus: React.FC<FocusProps> = ({ user, setUser, onClose }) => {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [minutes, setMinutes] = useState(user?.preferences.focusDuration ?? 25);
  const [secondsLeft, setSecondsLeft] = useState((user?.preferences.focusDuration ?? 25) * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [selectedSound, setSelectedSound] = useState(user?.preferences.focusSound ?? 'Rain Forest');
  const [selectedMusic, setSelectedMusic] = useState('Instrumental Warmth');
  const [selectedAlarmSound, setSelectedAlarmSound] = useState(user?.preferences.focusAlarmSound ?? 'Aggressive Bell');
  const [alarmSource, setAlarmSource] = useState<'default' | 'upload'>(user?.preferences.customFocusSongDataUrl ? 'upload' : 'default');
  const [customSongName, setCustomSongName] = useState(user?.preferences.customFocusSongName || '');
  const [customSongDataUrl, setCustomSongDataUrl] = useState(user?.preferences.customFocusSongDataUrl || '');
  const [customSongPlaylist, setCustomSongPlaylist] = useState<Array<{ name: string; dataUrl: string }>>(() => {
    const names = user?.preferences.customFocusPlaylistNames || [];
    const urls = user?.preferences.customFocusPlaylistDataUrls || [];
    if (names.length > 0 && names.length === urls.length) {
      return names.map((name, index) => ({ name, dataUrl: urls[index] }));
    }
    if (user?.preferences.customFocusSongDataUrl) {
      return [{
        name: user.preferences.customFocusSongName || 'Uploaded song',
        dataUrl: user.preferences.customFocusSongDataUrl,
      }];
    }
    return [];
  });
  const [shufflePlaylist, setShufflePlaylist] = useState(Boolean(user?.preferences.shuffleFocusPlaylist));
  const [previewMode, setPreviewMode] = useState<'sound' | 'music' | 'alarm' | null>(null);

  const runningMediaRef = useRef<HTMLAudioElement | null>(null);
  const previewMediaRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioContextRef = useRef<AudioContext | null>(null);
  const backgroundAudioContextRef = useRef<AudioContext | null>(null);
  const backgroundIntervalRef = useRef<number | null>(null);
  const completionAudioContextRef = useRef<AudioContext | null>(null);
  const previewTimeoutRef = useRef<number | null>(null);
  const uploadedTrackIndexRef = useRef(0);

  const maxSeconds = useMemo(() => Math.max(1, minutes * 60), [minutes]);
  const progress = useMemo(() => 1 - secondsLeft / maxSeconds, [secondsLeft, maxSeconds]);

  const modeMinutes = (nextMode: 'focus' | 'short' | 'long') => {
    if (nextMode === 'focus') return user?.preferences.focusDuration ?? 25;
    if (nextMode === 'short') return user?.preferences.shortBreakDuration ?? 5;
    return user?.preferences.longBreakDuration ?? 15;
  };

  const playDefaultCompletionTone = (alarmName: string) => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    if (!completionAudioContextRef.current) {
      completionAudioContextRef.current = new AudioCtx();
    }

    const ctx = completionAudioContextRef.current;
    const alarmPatterns: Record<string, { notes: number[]; type: OscillatorType; gain: number; step: number }> = {
      'Aggressive Bell': { notes: [880, 1180, 980, 1320], type: 'triangle', gain: 0.24, step: 0.2 },
      'Emergency Pulse': { notes: [700, 980, 700, 980, 700], type: 'square', gain: 0.2, step: 0.17 },
      'Sharp Chime': { notes: [1040, 1560, 1320], type: 'sine', gain: 0.16, step: 0.27 },
      'Focus Siren': { notes: [520, 660, 820, 660, 520], type: 'sawtooth', gain: 0.18, step: 0.19 },
    };

    const profile = alarmPatterns[alarmName] || alarmPatterns['Aggressive Bell'];
    const notes = profile.notes;
    const start = ctx.currentTime + 0.02;
    notes.forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = start + index * profile.step;
      const t1 = t0 + Math.max(0.14, profile.step - 0.03);
      osc.type = profile.type;
      osc.frequency.setValueAtTime(frequency, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(profile.gain, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t1 + 0.01);
    });
  };

  const stopBackgroundPlayback = () => {
    if (backgroundIntervalRef.current) {
      window.clearInterval(backgroundIntervalRef.current);
      backgroundIntervalRef.current = null;
    }

    if (runningMediaRef.current) {
      runningMediaRef.current.pause();
      runningMediaRef.current.currentTime = 0;
      runningMediaRef.current = null;
    }

    if (backgroundAudioContextRef.current) {
      backgroundAudioContextRef.current.close();
      backgroundAudioContextRef.current = null;
    }
  };

  const stopPreviewPlayback = () => {
    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }

    if (previewMediaRef.current) {
      previewMediaRef.current.pause();
      previewMediaRef.current.currentTime = 0;
      previewMediaRef.current = null;
    }

    if (previewAudioContextRef.current) {
      previewAudioContextRef.current.close();
      previewAudioContextRef.current = null;
    }

    setPreviewMode(null);
  };

  const playSynthPattern = (notes: number[], kind: 'preview' | 'background') => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    let ctx: AudioContext;
    if (kind === 'preview') {
      if (previewAudioContextRef.current) {
        previewAudioContextRef.current.close();
      }
      ctx = new AudioCtx();
      previewAudioContextRef.current = ctx;
    } else {
      if (!backgroundAudioContextRef.current) {
        backgroundAudioContextRef.current = new AudioCtx();
      }
      ctx = backgroundAudioContextRef.current;
    }

    const start = ctx.currentTime + 0.02;
    notes.forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = start + index * 0.35;
      const t1 = t0 + 0.3;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(kind === 'preview' ? 0.22 : 0.09, t0 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t1 + 0.02);
    });
  };

  const startDefaultBackgroundMusic = () => {
    stopBackgroundPlayback();

    const patterns: Record<string, number[]> = {
      'Instrumental Warmth': [392, 440, 494, 523, 494, 440],
      'Piano Prayer': [349, 392, 440, 392, 349, 330],
      'Ambient Strings': [262, 330, 392, 330, 392, 440],
      'Lo-fi Study': [330, 392, 330, 294, 262, 294],
    };

    const notes = patterns[selectedMusic] || patterns['Instrumental Warmth'];
    playSynthPattern(notes, 'background');
    backgroundIntervalRef.current = window.setInterval(() => {
      playSynthPattern(notes, 'background');
    }, 2600);
  };

  const startRunningMusic = () => {
    if (alarmSource === 'upload' && customSongPlaylist.length > 0) {
      stopBackgroundPlayback();
      const media = new Audio();
      media.volume = 0.75;
      const tracks = customSongPlaylist;

      const playTrackAt = (index: number) => {
        uploadedTrackIndexRef.current = index;
        media.src = tracks[index].dataUrl;
        media.loop = !shufflePlaylist && tracks.length === 1;
        media.play().catch(() => {
          startDefaultBackgroundMusic();
        });
      };

      media.onended = () => {
        if (tracks.length === 0) return;
        if (shufflePlaylist && tracks.length > 1) {
          const next = Math.floor(Math.random() * tracks.length);
          playTrackAt(next);
          return;
        }
        const next = (uploadedTrackIndexRef.current + 1) % tracks.length;
        playTrackAt(next);
      };

      playTrackAt(uploadedTrackIndexRef.current % tracks.length);
      runningMediaRef.current = media;
      return;
    }

    startDefaultBackgroundMusic();
  };

  const playCompletionTone = () => {
    stopBackgroundPlayback();
    if (alarmSource === 'upload' && customSongPlaylist.length > 0) {
      const media = new Audio(customSongPlaylist[uploadedTrackIndexRef.current % customSongPlaylist.length].dataUrl);
      media.volume = 0.9;
      media.play().catch(() => {
        playDefaultCompletionTone(selectedAlarmSound);
      });
      runningMediaRef.current = media;
      return;
    }

    playDefaultCompletionTone(selectedAlarmSound);
  };

  useEffect(() => {
    if (!isRunning) return;

    startRunningMusic();

    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playCompletionTone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(id);
      stopBackgroundPlayback();
    };
  }, [isRunning, alarmSource, customSongDataUrl, selectedMusic, selectedAlarmSound]);

  useEffect(() => {
    return () => {
      stopBackgroundPlayback();
      stopPreviewPlayback();
      if (completionAudioContextRef.current) {
        completionAudioContextRef.current.close();
        completionAudioContextRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        focusDuration: minutes,
        focusSound: selectedSound,
        focusAlarmSound: selectedAlarmSound,
        customFocusSongName: customSongName,
        customFocusSongDataUrl: customSongDataUrl,
        customFocusPlaylistNames: customSongPlaylist.map((item) => item.name),
        customFocusPlaylistDataUrls: customSongPlaylist.map((item) => item.dataUrl),
        shuffleFocusPlaylist: shufflePlaylist,
      },
    });
  }, [minutes, selectedSound, selectedAlarmSound, customSongName, customSongDataUrl, customSongPlaylist, shufflePlaylist]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const setPreset = (nextMode: 'focus' | 'short' | 'long') => {
    setMode(nextMode);
    const nextMinutes = modeMinutes(nextMode);
    setMinutes(nextMinutes);
    setSecondsLeft(nextMinutes * 60);
    setIsRunning(false);
  };

  const adjustMinutes = (direction: 'up' | 'down') => {
    const next = direction === 'up' ? Math.min(120, minutes + 1) : Math.max(5, minutes - 1);
    setMinutes(next);
    setSecondsLeft(next * 60);
    setIsRunning(false);
  };

  const readFileAsDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read audio file.'));
    reader.readAsDataURL(file);
  });

  const handleSongUpload = async (files?: FileList | null) => {
    if (!files || files.length === 0) return;

    const selected = Array.from(files).slice(0, 10);
    const validAudio = selected.filter((file) => file.type.startsWith('audio/'));
    const validBySize = validAudio.filter((file) => file.size <= 100 * 1024 * 1024);
    if (validBySize.length === 0) return;

    const playlist: Array<{ name: string; dataUrl: string }> = [];
    for (const file of validBySize) {
      const dataUrl = await readFileAsDataUrl(file);
      playlist.push({ name: file.name, dataUrl });
    }

    setCustomSongPlaylist(playlist);
    setCustomSongName(playlist[0]?.name || '');
    setCustomSongDataUrl(playlist[0]?.dataUrl || '');
    uploadedTrackIndexRef.current = 0;
    setAlarmSource('upload');
  };

  const previewSound = () => {
    if (previewMode === 'sound') {
      stopPreviewPlayback();
      return;
    }

    stopPreviewPlayback();
    const notesBySound: Record<string, number[]> = {
      'Rain Forest': [330, 392, 440, 392],
      'Cathedral Air': [262, 330, 392, 330],
      'Brown Noise': [196, 220, 196, 174],
      'Light Wind': [294, 349, 392, 349],
      'Stream Flow': [370, 415, 494, 415],
    };
    playSynthPattern(notesBySound[selectedSound] || notesBySound['Rain Forest'], 'preview');
    setPreviewMode('sound');
    previewTimeoutRef.current = window.setTimeout(() => {
      stopPreviewPlayback();
    }, 2000);
  };

  const previewMusic = () => {
    if (previewMode === 'music') {
      stopPreviewPlayback();
      return;
    }

    stopPreviewPlayback();
    const patterns: Record<string, number[]> = {
      'Instrumental Warmth': [392, 440, 494, 523],
      'Piano Prayer': [349, 392, 440, 392],
      'Ambient Strings': [262, 330, 392, 440],
      'Lo-fi Study': [330, 392, 330, 294],
    };
    playSynthPattern(patterns[selectedMusic] || patterns['Instrumental Warmth'], 'preview');
    setPreviewMode('music');
    previewTimeoutRef.current = window.setTimeout(() => {
      stopPreviewPlayback();
    }, 2000);
  };

  const previewAlarmSong = () => {
    if (previewMode === 'alarm') {
      stopPreviewPlayback();
      return;
    }

    stopPreviewPlayback();

    if (alarmSource === 'upload' && customSongPlaylist.length > 0) {
      const media = new Audio(customSongPlaylist[uploadedTrackIndexRef.current % customSongPlaylist.length].dataUrl);
      media.volume = 0.8;
      media.loop = true;
      media.play().catch(() => {
        playDefaultCompletionTone(selectedAlarmSound);
      });
      media.onended = () => {
        setPreviewMode(null);
      };
      previewMediaRef.current = media;
      setPreviewMode('alarm');
      return;
    }

    playDefaultCompletionTone(selectedAlarmSound);
    setPreviewMode('alarm');
    previewTimeoutRef.current = window.setTimeout(() => {
      stopPreviewPlayback();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface overflow-y-auto no-scrollbar pb-24">
      <div className="sticky top-0 z-10 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/25">
        <div className="h-[62px] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
          <button aria-label="Close focus page" title="Back" onClick={onClose} className="h-10 w-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
            <ArrowLeft size={18} />
          </button>
          <p className="font-label text-[11px] uppercase tracking-[0.16em] text-outline font-bold">Focus Session</p>
          <button
            aria-label="Reset timer"
            title="Reset"
            onClick={() => {
              setSecondsLeft(minutes * 60);
              setIsRunning(false);
            }}
            className="h-10 w-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setPreset('focus')} className={cn('px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em]', mode === 'focus' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-secondary')}>Focus</button>
            <button onClick={() => setPreset('short')} className={cn('px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em]', mode === 'short' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-secondary')}>Short Break</button>
            <button onClick={() => setPreset('long')} className={cn('px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.14em]', mode === 'long' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-secondary')}>Long Break</button>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="font-label text-[11px] uppercase tracking-[0.14em] text-outline font-bold">Session Minutes</p>
            <div className="flex items-center gap-3">
              <button onClick={() => adjustMinutes('down')} aria-label="Decrease minutes" className="h-9 w-9 rounded-full bg-surface-container-lowest text-primary font-bold">-</button>
              <p className="display-text text-3xl text-on-surface w-14 text-center">{minutes}</p>
              <button onClick={() => adjustMinutes('up')} aria-label="Increase minutes" className="h-9 w-9 rounded-full bg-surface-container-lowest text-primary font-bold">+</button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold">Ambient Sound</p>
              <button
                type="button"
                aria-label="Preview ambient sound"
                title="Preview ambient sound"
                onClick={previewSound}
                className="h-8 w-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center"
              >
                <Volume2 size={14} />
              </button>
            </div>
            <select
              aria-label="Ambient sound"
              title="Ambient sound"
              value={selectedSound}
              onChange={(e) => setSelectedSound(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
            >
              {soundOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold">Music Track</p>
              <button
                type="button"
                aria-label="Preview music track"
                title="Preview music track"
                onClick={previewMusic}
                className="h-8 w-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center"
              >
                <Volume2 size={14} />
              </button>
            </div>
            <select
              aria-label="Music track"
              title="Music track"
              value={selectedMusic}
              onChange={(e) => setSelectedMusic(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
            >
              {musicOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 space-y-3">
          <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold">Focus Alarm Song</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setAlarmSource('default');
              }}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.14em]',
                alarmSource === 'default' ? 'bg-primary text-white' : 'bg-surface-container-low text-primary'
              )}
            >
              Use Default
            </button>
            <button
              onClick={() => setAlarmSource('upload')}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.14em] flex items-center gap-1',
                alarmSource === 'upload' ? 'bg-primary text-white' : 'bg-surface-container-low text-primary'
              )}
            >
              <Upload size={12} />
              Use Upload
            </button>
          </div>

          {alarmSource === 'default' && (
            <select
              aria-label="Focus alarm sound"
              title="Focus alarm sound"
              value={selectedAlarmSound}
              onChange={(e) => setSelectedAlarmSound(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
            >
              {alarmOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {alarmSource === 'upload' && (
            <>
              <input
                type="file"
                accept="audio/*"
                multiple
                title="Upload focus alarm song"
                onChange={(e) => handleSongUpload(e.target.files)}
                className="w-full text-sm"
              />
              <p className="text-xs text-on-surface-variant">Upload up to 10 songs, 100MB each.</p>
              {customSongPlaylist.length > 0 && (
                <p className="text-xs text-on-surface-variant">Selected: {customSongPlaylist.length} file(s) • First: {customSongPlaylist[0].name}</p>
              )}
              {customSongPlaylist.length > 1 && (
                <label className="flex items-center justify-between rounded-xl border border-outline-variant/35 bg-surface-container-lowest px-3 py-2">
                  <span className="text-sm text-on-surface">Shuffle Uploaded Playlist</span>
                  <button
                    type="button"
                    aria-label="Toggle shuffle uploaded playlist"
                    onClick={() => setShufflePlaylist((prev) => !prev)}
                    className={cn(
                      'h-8 w-14 rounded-full relative transition-all duration-300 border',
                      shufflePlaylist
                        ? 'bg-gradient-to-r from-primary to-primary-container border-primary/40 shadow-[0_8px_20px_rgba(150,68,7,0.25)]'
                        : 'bg-surface-container-low border-outline-variant/60'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center',
                        shufflePlaylist ? 'translate-x-7' : 'translate-x-1'
                      )}
                    >
                      <span className={cn('h-2 w-2 rounded-full', shufflePlaylist ? 'bg-primary' : 'bg-outline')} />
                    </span>
                  </button>
                </label>
              )}
            </>
          )}

          <button
            type="button"
            onClick={previewAlarmSong}
            className="px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1"
          >
            <Volume2 size={12} />
            {previewMode === 'alarm' ? 'Stop Preview' : 'Preview Song'}
          </button>
        </section>

        <section className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/30 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold mb-2">Pomodoro Clock</p>

          <div className="relative mx-auto mb-6 w-56 h-56 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r="108" fill="none" stroke="currentColor" strokeWidth="6" className="text-outline-variant/25" />
              <motion.circle
                cx="120"
                cy="120"
                r="108"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray="678"
                animate={{ strokeDashoffset: 678 * (1 - progress) }}
                transition={{ duration: 0.8, ease: 'linear' }}
              />
            </svg>
            <p className="display-text text-6xl text-on-surface tracking-tight tabular-nums">{formatTimer(secondsLeft)}</p>
          </div>

          <p className="mt-3 text-sm text-on-surface-variant">Sound: {selectedSound} • Music: {selectedMusic} • Alarm: {alarmSource === 'upload' && customSongName ? customSongName : selectedAlarmSound}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => setIsRunning((prev) => !prev)} className="px-6 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-[0.14em] flex items-center gap-2">
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(minutes * 60);
              }}
              className="px-6 py-2 rounded-full bg-surface-container-lowest text-primary text-xs font-bold uppercase tracking-[0.14em]"
            >
              Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Focus;
