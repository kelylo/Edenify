/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Layout from './components/Layout';
import { AnimatePresence, motion } from 'motion/react';

const Home = lazy(() => import('./components/Home'));
const Pillars = lazy(() => import('./components/Pillars'));
const Eden = lazy(() => import('./components/Eden'));
const Profile = lazy(() => import('./components/Profile'));
const Auth = lazy(() => import('./components/Auth'));

const ScreenSkeleton: React.FC = () => (
  <div className="p-6 space-y-4 animate-pulse">
    <div className="h-5 w-40 bg-surface-container-low rounded" />
    <div className="h-24 bg-surface-container-low rounded-2xl" />
    <div className="h-24 bg-surface-container-low rounded-2xl" />
    <div className="h-24 bg-surface-container-low rounded-2xl" />
  </div>
);

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  declare props: { children: React.ReactNode };
  declare state: { hasError: boolean };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Authenticated app render failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 text-center">
          <div className="max-w-sm space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Edenify</p>
            <h1 className="text-2xl font-serif text-on-surface">We hit a small hiccup.</h1>
            <p className="text-sm text-on-surface-variant">Please refresh and continue. If this keeps showing, we will recover your session as soon as the app restarts.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-[0.14em]"
            >
              Refresh Now
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { user, authReady } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const custom = event as CustomEvent<{ tab?: string; layerId?: string }>;
      const tab = custom.detail?.tab;
      const layerId = custom.detail?.layerId;

      if (tab) {
        setActiveTab(tab);
      }

      if (layerId) {
        setSelectedLayerId(layerId);
      }
    };

    window.addEventListener('edenify:navigate', handleNavigate as EventListener);
    return () => {
      window.removeEventListener('edenify:navigate', handleNavigate as EventListener);
    };
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Edenify</p>
          <div className="h-1.5 w-28 rounded-full bg-surface-container-low overflow-hidden mx-auto">
            <div className="h-full w-1/2 bg-primary animate-pulse" />
          </div>
          <p className="text-sm text-on-surface-variant">Loading your session.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<ScreenSkeleton />}>
        <Auth />
      </Suspense>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'layers': return <Pillars initialLayerId={selectedLayerId} />;
      case 'eden': return <Eden />;
      case 'profile': return <Profile />;
      default: return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full"
        >
          <Suspense fallback={<ScreenSkeleton />}>
            {renderContent()}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppErrorBoundary>
        <AppContent />
      </AppErrorBoundary>
    </AppProvider>
  );
}

