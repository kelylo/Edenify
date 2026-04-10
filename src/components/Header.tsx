import React from 'react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';

interface HeaderProps {
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showNotifications = true }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 py-3 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 max-w-md mx-auto h-[52px]">
      {/* Left: Logo and Edenify text */}
      <div className="flex items-center gap-2">
        <img
          src="/edenify-logo.png"
          alt="Edenify"
          className="w-6 h-6 object-contain"
        />
        <h1 className="text-lg font-serif font-medium text-primary italic">Edenify</h1>
      </div>

      {/* Right: Notifications Bell */}
      <div className="flex items-center gap-4">
        {showNotifications && (
          <button className="text-primary hover:text-on-surface transition-colors active:scale-95 duration-150">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
