'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from '../Button';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Cancel, Escape, or a tap outside the card. */
  onCancel: () => void;
}

/**
 * Asks once before a choice that costs money later (adding something to every delivery). A native
 * modal dialog: focus moves in and stays in, Escape cancels, and focus returns to the control that
 * opened it. Cancel is first, so the safe answer is the first one a keyboard reaches.
 */
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel = 'Cancel', onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      className="m-auto w-full max-w-none bg-transparent p-16 text-text-primary backdrop:bg-primary/40"
    >
      {/* The dialog is the clear area around the card, so a tap there cancels. */}
      <div className="mx-auto flex max-w-column flex-col gap-16 rounded-card bg-bg-surface p-24 shadow-raised">
        <h2 id={titleId} className="font-heading text-title">
          {title}
        </h2>
        <div id={bodyId} className="flex flex-col gap-8 font-sans text-body">
          {children}
        </div>
        <div className="flex flex-col-reverse gap-8 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </dialog>
  );
}
