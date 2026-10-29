'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from './useInView';

export interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** How much of it must be on screen before it plays (0–1). */
  threshold?: number;
}

/**
 * A `group` that marks itself `data-ready` once JavaScript runs, `data-seen` once it has scrolled
 * into view and `data-playing` while on screen, so children can use `group-data-seen:animate-…`.
 * Without JavaScript nothing waits, so everything shows.
 */
export function Reveal({ as: Tag = 'div', className = '', children, threshold = 0.3 }: RevealProps) {
  const { ref, ready, seen, visible } = useInView<HTMLElement>(threshold);
  return (
    <Tag
      ref={ref}
      data-ready={ready || undefined}
      data-seen={seen || undefined}
      data-playing={visible || undefined}
      className={`group ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Sets which beat of a sequence an element plays: animation tokens multiply their delay by it. */
export const beat = (n: number) => ({ '--stagger': n }) as CSSProperties;

/**
 * A line of text whose words slide up one by one from behind their own mask.
 * `start` offsets the first word's beat, so a second line can follow the first.
 */
export function WordReveal({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-4 align-bottom">
          <span className="inline-block group-data-ready:opacity-0 group-data-seen:animate-word-up" style={beat(start + i)}>
            {word}
          </span>
          {' '}
        </span>
      ))}
    </>
  );
}
