import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play, RefreshCw, Volume2, Maximize2, Minimize2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, requestMediaPermission } from '../lib/utils';
import { User } from '../types';

interface FocusProps {
  user: User | null;
  setUser: (user: User | null) => void;
  onClose: () => void;
}

const Focus: React.FC<FocusProps> = ({ user, setUser, onClose }) => {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [minutes, setMinutes] = useState(user?.preferences.focusDuration ?? 25);
  const [secondsLeft, setSecondsLeft] = useState((user?.preferences.focusDuration ?? 25) * 60);
  const [isRunning, setIsRunning] = useState(false);

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
  const [previewMode, setPreviewMode] = useState<'alarm' | null>(null);
  const [mediaPermissionGranted, setMediaPermissionGranted] = useState<boolean | null>(null);
  const [isFocusFullscreen, setIsFocusFullscreen] = useState(false);
  const focusPageRef = useRef<HTMLDivElement | null>(null);

  const runningMediaRef = useRef<HTMLAudioElement | null>(null);
  const previewMediaRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioContextRef = useRef<AudioContext | null>(null);
  const previewTimeoutRef = useRef<number | null>(null);
  const uploadedTrackIndexRef = useRef(0);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const maxSeconds = useMemo(() => Math.max(1, minutes * 60), [minutes]);
  const progress = useMemo(() => 1 - secondsLeft / maxSeconds, [secondsLeft, maxSeconds]);

  const modeMinutes = (nextMode: 'focus' | 'short' | 'long') => {
    if (nextMode === 'focus') return user?.preferences.focusDuration ?? 25;
    if (nextMode === 'short') return user?.preferences.shortBreakDuration ?? 5;
    return user?.preferences.longBreakDuration ?? 15;
  };

  const stopBackgroundPlayback = () => {
    if (runningMediaRef.current) {
      runningMediaRef.current.pause();
      runningMediaRef.current.currentTime = 0;
      runningMediaRef.current = null;
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

  const startRunningMusic = () => {
    if (customSongPlaylist.length === 0) return;
    stopBackgroundPlayback();
    const media = new Audio();
    media.volume = 0.75;
    const tracks = customSongPlaylist;

    const playTrackAt = (index: number) => {
      uploadedTrackIndexRef.current = index;
      media.src = tracks[index].dataUrl;
      media.loop = !shufflePlaylist && tracks.length === 1;
      media.play().catch(() => {
        // Silent fallback when autoplay is blocked.
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
  };

  const playCompletionTone = () => {
    stopBackgroundPlayback();
    if (customSongPlaylist.length === 0) return;
    const media = new Audio(customSongPlaylist[uploadedTrackIndexRef.current % customSongPlaylist.length].dataUrl);
    media.volume = 0.9;
    media.play().catch(() => {
      // Silent fallback when autoplay is blocked.
    });
    runningMediaRef.current = media;
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
  }, [isRunning, customSongDataUrl, customSongPlaylist, shufflePlaylist]);

  useEffect(() => {
    return () => {
      stopBackgroundPlayback();
      stopPreviewPlayback();
    };
  }, []);

  useEffect(() => {
    const checkMediaPermission = async () => {
      const permitted = await requestMediaPermission();
      setMediaPermissionGranted(permitted);
    };
    checkMediaPermission();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const currentFullscreen = document.fullscreenElement;
      setIsFocusFullscreen(Boolean(currentFullscreen));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        focusDuration: minutes,
        focusSound: customSongName || 'Uploaded Playlist',
        focusAlarmSound: customSongName || '',
        customFocusSongName: customSongName,
        customFocusSongDataUrl: customSongDataUrl,
        customFocusPlaylistNames: customSongPlaylist.map((item) => item.name),
        customFocusPlaylistDataUrls: customSongPlaylist.map((item) => item.dataUrl),
        shuffleFocusPlaylist: shufflePlaylist,
      },
    });
  }, [minutes, customSongName, customSongDataUrl, customSongPlaylist, shufflePlaylist]);

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
    const validBySize = validAudio.filter((file) => file.size <= 20 * 1024 * 1024);
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
  };

  const toggleFocusFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const element = focusPageRef.current || document.documentElement;
        
        // Ensure theme classes are applied to fullscreen element
        const selectedTheme = document.documentElement.getAttribute('data-theme') || 'system';
        const isDark = document.documentElement.classList.contains('dark');
        element.setAttribute('data-theme', selectedTheme);
        if (isDark) {
          element.classList.add('dark');
        } else {
          element.classList.remove('dark');
        }
        
        await element.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Focus fullscreen toggle failed:', error);
    }
  };

  const closeFocusView = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // no-op
      }
    }
    onClose();
  };

  const previewAlarmSong = () => {
    if (previewMode === 'alarm') {
      stopPreviewPlayback();
      return;
    }

    stopPreviewPlayback();

    if (customSongPlaylist.length > 0) {
      const media = new Audio(customSongPlaylist[uploadedTrackIndexRef.current % customSongPlaylist.length].dataUrl);
      media.volume = 0.8;
      media.loop = true;
      media.play().catch(() => {});
      media.onended = () => {
        setPreviewMode(null);
      };
      previewMediaRef.current = media;
      setPreviewMode('alarm');
      return;
    }
  };

  return (
    <div ref={focusPageRef} className="min-h-screen bg-surface overflow-y-auto no-scrollbar pb-24">
      {isFocusFullscreen && (
        <div
          className="fixed left-0 right-0 z-40 px-3 pointer-events-none focus-safe-top"
        >
          <div className="max-w-7xl mx-auto pt-2 flex items-center justify-between pointer-events-auto">
            <button
              aria-label="Back to home"
              title="Back"
              onClick={closeFocusView}
              className="h-11 w-11 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              aria-label="Exit fullscreen"
              title="Exit fullscreen"
              onClick={toggleFocusFullscreen}
              className="h-11 w-11 rounded-full bg-black/35 text-white flex items-center justify-center backdrop-blur-sm"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/25">
        <div className="min-h-[62px] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between focus-safe-padding">
          <button aria-label="Close focus page" title="Back" onClick={closeFocusView} className="h-10 w-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
            <ArrowLeft size={18} />
          </button>
          <p className="font-label text-[11px] uppercase tracking-[0.16em] text-outline font-bold">Focus Session</p>
          <div className="flex items-center gap-2">
            <button
              aria-label={isFocusFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFocusFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              onClick={toggleFocusFullscreen}
              className="h-10 w-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
            >
              {isFocusFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
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

        <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 space-y-3">
          <p className="font-label text-[10px] uppercase tracking-[0.14em] text-outline font-bold">Focus Audio Playlist (Upload Only)</p>
          {mediaPermissionGranted === false ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-xs text-red-700 font-semibold">Media access denied</p>
              <p className="text-xs text-red-600 mt-1">Please enable media/file permissions in your browser settings to upload focus songs.</p>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-surface-container-high transition-colors active:scale-95"
              >
                Upload songs
              </button>
              <input
                ref={uploadInputRef}
                type="file"
                accept="audio/*"
                multiple
                title="Upload focus songs"
                onChange={(e) => handleSongUpload(e.target.files)}
                className="hidden"
                disabled={mediaPermissionGranted !== true}
              />
              <p className="text-xs text-on-surface-variant">Upload up to 10 songs, 20MB each. Focus uses your uploaded playlist only.</p>
              {customSongPlaylist.length > 0 ? (
                <p className="text-xs text-on-surface-variant">Selected: {customSongPlaylist.length} file(s) • First: {customSongPlaylist[0].name}</p>
              ) : (
                <p className="text-xs text-secondary">No playlist uploaded yet. Timer will run silently until you upload songs.</p>
              )}
            </>
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

          <button
            type="button"
            onClick={previewAlarmSong}
            className="px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1"
          >
            <Volume2 size={12} />
            {previewMode === 'alarm' ? 'Stop Preview' : 'Preview Upload'}
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

          <p className="mt-3 text-sm text-on-surface-variant">Audio: {customSongName ? customSongName : 'No upload selected'}</p>

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
