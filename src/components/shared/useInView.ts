'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export interface InView<T extends Element> {
  ref: RefObject<T | null>;
  /** True once JavaScript is running: only then may content start hidden, waiting for its entrance. */
  ready: boolean;
  /** Has been on screen at least once (for entrances that play once). */
  seen: boolean;
  /** On screen right now (for loops that should rest while off screen). */
  visible: boolean;
}

/** Watches an element scroll in and out of view. Falls back to "always visible" without IntersectionObserver. */
export function useInView<T extends Element>(threshold = 0.2): InView<T> {
  const ref = useRef<T>(null);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    setReady(true);
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, ready, seen, visible };
}
