import React from 'react';
import { Home, Layers, Sparkles, User, Moon, Sun, Laptop } from 'lucide-react';
import { cn } from '../lib/utils';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem('edenify_theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
  });

  const applyTheme = React.useCallback((nextTheme: 'light' | 'dark' | 'system', persist: boolean) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = nextTheme === 'system' ? (prefersDark ? 'dark' : 'light') : nextTheme;

    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.setAttribute('data-theme', nextTheme);

    if (persist) {
      try {
        window.localStorage.setItem('edenify_theme', nextTheme);
      } catch {
        // Ignore storage issues.
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    applyTheme(theme, false);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') applyTheme('system', false);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'edenify_theme') return;
      const incoming = event.newValue;
      if (incoming === 'light' || incoming === 'dark' || incoming === 'system') {
        setTheme(incoming);
      }
    };

    media.addEventListener('change', handleSystemChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      media.removeEventListener('change', handleSystemChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [theme, applyTheme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
    applyTheme(next, true);
  };

  const themeLabel =
    theme === 'dark'
      ? 'Theme: Dark (tap to System)'
      : theme === 'system'
        ? 'Theme: System (tap to Light)'
        : 'Theme: Light (tap to Dark)';

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'layers', icon: Layers, label: 'Pillars' },
    { id: 'eden', icon: Sparkles, label: 'Eden' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background max-w-5xl mx-auto relative overflow-hidden">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
        className="fixed top-3 right-3 z-[60] h-9 w-9 rounded-xl border border-outline-variant/50 bg-surface-container-low text-primary flex items-center justify-center shadow-md"
      >
        {theme === 'dark' ? <Sun size={16} /> : theme === 'system' ? <Laptop size={16} /> : <Moon size={16} />}
      </button>

      {/* Header with Logo (hidden on Home because Home has a custom fixed navbar) */}
      {activeTab !== 'home' && <Header />}

      {/* Main Content */}
      <main className={cn('flex-1 overflow-y-auto no-scrollbar pb-28', activeTab === 'home' ? 'pt-0' : 'pt-16')}>
        {children}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-outline-variant px-6 py-3 flex justify-between items-center z-50 max-w-5xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-secondary opacity-60 hover:opacity-100"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px] font-medium uppercase tracking-widest", isActive ? "opacity-100" : "opacity-0")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
