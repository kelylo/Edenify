import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { getDayReading } from '../services/bible';

interface BibleReadingUIProps {
  currentDay: number;
  completedToday: boolean;
  onToggleComplete: (completed: boolean) => void;
  onReadMore?: () => void;
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
  onReadMore,
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
          const tomorrow = await getDayReading(Math.min(365, currentDay + 1));
          setNextReading({
            day: Math.min(365, currentDay + 1),
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
    <div className="space-y-3">
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
              'flex items-center justify-center w-10 h-10 rounded-full transition-all flex-shrink-0',
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

        <div className="flex items-center gap-2">
          <button
            onClick={onReadMore}
            className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary bg-primary/10 px-3 py-2 rounded-full hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
          >
            <BookOpen size={12} />
            Read More
          </button>
          <span className={cn(
            'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]',
            completedToday
              ? 'bg-primary text-white'
              : 'bg-primary/20 text-primary'
          )}>
            {completedToday ? '✓ Confirmed' : '○ Pending'}
          </span>
        </div>
      </div>

      {/* Next Day Preview or Locked */}
      {nextReading && (
        <div className={cn(
          'rounded-xl border-2 p-4 transition-all',
          completedToday
            ? 'border-primary/20 bg-primary/5'
            : 'border-outline-variant/30 bg-surface-container-lowest opacity-60'
        )}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-secondary mb-2">
                {completedToday ? 'Tomorrow' : 'Locked'}
              </p>
              {completedToday ? (
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
                  Complete today to see tomorrow's reading
                </p>
              )}
            </div>
            {completedToday && <ChevronRight size={18} className="text-primary mt-1" />}
          </div>
        </div>
      )}
    </div>
  );
};
