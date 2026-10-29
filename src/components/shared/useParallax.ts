'use client';

import { useEffect, useRef } from 'react';

/**
 * Drifts an element against the scroll: it sets `--parallax` (px) from how far the element's
 * centre is from the middle of the screen, times `speed` (negative = moves slower than the page).
 * Pair it with the `parallax` utility. Off under reduced motion; only works while on screen.
 */
export function useParallax<T extends HTMLElement>(speed = -0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let onScreen = false;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const fromMiddle = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.setProperty('--parallax', `${(fromMiddle * speed).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (onScreen && !frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) update();
    });
    observer.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [speed]);

  return ref;
}
