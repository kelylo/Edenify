import React, { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children, ariaLabel }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleKey);
    } else {
      window.removeEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-label={ariaLabel || 'Modal'}
      className="rounded-xl shadow-2xl p-0 border-0 bg-background max-w-lg w-full backdrop:bg-black/30 animate-fade-in"
      onClick={e => {
        if (e.target === dialogRef.current) onClose();
      }}
      onClose={onClose}
    >
      <div tabIndex={0} className="outline-none focus:outline-none">
        {children}
      </div>
    </dialog>
  );
};