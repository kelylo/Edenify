import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { getDayReading } from '../services/bible';

interface BibleReadingUIProps {
  currentDay: number;
  completedToday: boolean;
  onToggleComplete: (completed: boolean) => void;
  isProgressionEnforced?: boolean;
}

interface ReadingData {
  day: number;
  passages: string;
}

export const BibleReadingUI: React.FC<BibleReadingUIProps> = ({
  currentDay,
  completedToday,
  onToggleComplete,
  isProgressionEnforced = true,
}) => {
  const [reading, setReading] = useState<ReadingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextReading, setNextReading] = useState<ReadingData | null>(null);

  useEffect(() => {
    const loadReading = async () => {
      try {
        setLoading(true);
        const today = await getDayReading(currentDay);
        setReading({
          day: currentDay,
          passages: today.passage,
        });

        // Load next day preview (locked if not completed today)
        if (completedToday) {
          const tomorrow = await getDayReading(currentDay + 1);
          setNextReading({
            day: currentDay + 1,
            passages: tomorrow.passage,
          });
        }
      } catch (error) {
        console.error('Failed to load Bible reading:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReading();
  }, [currentDay, completedToday]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 animate-pulse">
        <div className="h-4 bg-primary/20 rounded w-1/2 mb-3" />
        <div className="h-3 bg-primary/20 rounded w-3/4" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Today's Scripture */}
      <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-primary mb-1">
              Day {reading?.day} of 365
            </p>
            <h3 className="text-sm font-bold text-on-surface">Today's Scripture</h3>
          </div>

          <button
            onClick={() => onToggleComplete(!completedToday)}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full transition-all',
              completedToday
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'
            )}
            title={completedToday ? 'Mark as unread' : 'Mark as read'}
          >
            {completedToday ? (
              <CheckCircle2 size={24} />
            ) : (
              <Circle size={24} />
            )}
          </button>
        </div>

        <p className="text-xs font-mono text-secondary mb-4 leading-relaxed">
          {reading?.passages}
        </p>

        <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-[0.12em]">
          <span className={cn(
            'px-2 py-1 rounded-full',
            completedToday
              ? 'bg-primary text-white'
              : 'bg-primary/20 text-primary'
          )}>
            {completedToday ? '✓ Completed' : '○ Pending'}
          </span>
        </div>
      </div>

      {/* Progression Lock / Next Day */}
      {isProgressionEnforced && !completedToday && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
          <div className="text-amber-600 mt-0.5">⚠️</div>
          <div>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-[0.12em]">
              Complete Today to Continue
            </p>
            <p className="text-[11px] text-amber-800 mt-1">
              Mark today's reading as complete to unlock tomorrow's scripture.
            </p>
          </div>
        </div>
      )}

      {/* Next Day Preview or Locked */}
      <div className={cn(
        'rounded-xl border-2 p-4 transition-all',
        completedToday && nextReading
          ? 'border-primary/20 bg-primary/5'
          : 'border-outline-variant/30 bg-surface-container-lowest opacity-60'
      )}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-secondary mb-2">
              {completedToday ? 'Next Day' : 'Locked Until Completed'}
            </p>
            {completedToday && nextReading ? (
              <>
                <p className="text-xs font-bold text-on-surface mb-2">
                  Day {nextReading.day}
                </p>
                <p className="text-xs text-secondary font-mono">
                  {nextReading.passages}
                </p>
              </>
            ) : (
              <p className="text-xs text-secondary">
                Complete today's reading first →
              </p>
            )}
          </div>
          {completedToday && <ChevronRight size={18} className="text-primary mt-1" />}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-lg bg-surface-container-lowest p-3">
        <p className="text-[10px] uppercase tracking-[0.12em] text-secondary font-bold mb-2">
          💡 Tip
        </p>
        <p className="text-[11px] text-secondary leading-relaxed">
          This plan includes 2 chapters daily (one from the New Testament and wisdom literature, one from the Old Testament and Psalms), completing the Bible in 365 days.
        </p>
      </div>
    </div>
  );
};
