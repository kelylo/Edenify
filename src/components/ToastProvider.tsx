import { Toaster } from 'react-hot-toast';
import React from 'react';

export const ToastProvider: React.FC = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#22223b',
        color: '#fff',
        borderRadius: '0.75rem',
        fontSize: '1rem',
        boxShadow: '0 2px 16px #0002',
      },
      success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
      error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      loading: { iconTheme: { primary: '#fbbf24', secondary: '#fff' } },
    }}
  />
);