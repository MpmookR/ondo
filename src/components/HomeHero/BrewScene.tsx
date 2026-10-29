'use client';

import { useId } from 'react';

/** Every loop switches off for people who ask for less motion. */
const still = 'motion-reduce:animate-none';

const glassPath =
  'M168 262 L222 262 L226 298 C262 318 270 356 262 384 C256 404 134 404 128 384 C120 356 128 318 164 298 Z';

/**
 * The homepage's slow brew: a ceramic pour-over dripping into a glass carafe that fills, steam,
 * a swaying plant and dust in the morning light. Drawn in code (SVG + CSS), so it's tiny, sharp
 * at any size and needs no video. Decorative: hidden from screen readers.
 * Colours are the `--illo-*` tokens; motion is the `animate-brew-*` tokens.
 */
export interface BrewSceneProps {
  className?: string;
  /**
   * How full the carafe is, 0 (empty) to 1 (the hero's level). Leave out for the hero's gentle
   * rise and fall; the preloader sets it to show loading progress.
   */
  level?: number;
}

/** How far the coffee sits below its full line when the carafe is empty (SVG units). */
const EMPTY_DROP = 62;

export function BrewScene({ className = '', level }: BrewSceneProps) {
  // Unique ids so two scenes on one page (Storybook docs) don't share gradients.
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ref = (name: string) => `${id}-${name}`;
  const url = (name: string) => `url(#${ref(name)})`;

  return (
    <svg aria-hidden="true" focusable="false" viewBox="20 60 300 352" className={`block h-auto w-full ${className}`}>
      <defs>
        <linearGradient id={ref('ceramic')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--illo-ceramic-light)" />
          <stop offset="0.35" stopColor="var(--illo-ceramic)" />
          <stop offset="1" stopColor="var(--illo-ceramic-dark)" />
        </linearGradient>
        <linearGradient id={ref('rim')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--illo-rim-light)" />
          <stop offset="1" stopColor="var(--illo-rim-dark)" />
        </linearGradient>
        <linearGradient id={ref('coffee')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--illo-coffee-top)" />
          <stop offset="1" stopColor="var(--illo-coffee-bottom)" />
        </linearGradient>
        <linearGradient id={ref('collar')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--illo-collar)" />
          <stop offset="0.5" stopColor="var(--illo-collar-light)" />
          <stop offset="1" stopColor="var(--illo-collar-dark)" />
        </linearGradient>
        <linearGradient id={ref('pot')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--illo-pot-light)" />
          <stop offset="1" stopColor="var(--illo-pot)" />
        </linearGradient>
        <linearGradient id={ref('leaf')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--illo-leaf-light)" />
          <stop offset="1" stopColor="var(--illo-leaf)" />
        </linearGradient>
        <radialGradient id={ref('drop')} cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="var(--illo-drop-light)" />
          <stop offset="1" stopColor="var(--illo-drop-dark)" />
        </radialGradient>
        <filter id={ref('soft')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id={ref('glass')}>
          <path d={glassPath} />
        </clipPath>
      </defs>

      {/* Dust in the light */}
      <g fill="var(--illo-steam)">
        <circle className={`animate-brew-mote ${still}`} cx="290" cy="120" r="1.6" opacity="0.9" />
        <circle className={`animate-brew-mote-slow ${still}`} cx="262" cy="210" r="1.2" opacity="0.8" />
        <circle className={`animate-brew-mote ${still}`} cx="300" cy="260" r="1.8" opacity="0.7" />
      </g>

      {/* Contact shadows on the counter */}
      <g fill="var(--illo-shadow)" filter={url('soft')}>
        <ellipse cx="200" cy="404" rx="88" ry="7" opacity="0.3" />
        <ellipse cx="78" cy="404" rx="38" ry="5" opacity="0.25" />
      </g>

      {/* Plant */}
      <g className={`animate-brew-sway origin-shape-bottom ${still}`}>
        <g stroke="var(--illo-leaf)" strokeWidth="2.5" fill="none">
          <path d="M76 344 C70 310 60 290 44 276" />
          <path d="M80 344 C84 304 98 284 116 272" />
          <path d="M78 344 C78 314 80 292 82 262" />
        </g>
        <g fill={url('leaf')}>
          <ellipse cx="46" cy="282" rx="18" ry="8" transform="rotate(-35 46 282)" />
          <ellipse cx="112" cy="276" rx="18" ry="8" transform="rotate(30 112 276)" />
          <ellipse cx="82" cy="262" rx="8" ry="17" />
          <ellipse cx="62" cy="312" rx="14" ry="6" transform="rotate(-20 62 312)" />
          <ellipse cx="98" cy="306" rx="14" ry="6" transform="rotate(25 98 306)" />
        </g>
      </g>
      <path d="M50 340 L106 340 L100 404 L56 404 Z" fill={url('pot')} />
      <rect x="46" y="334" width="64" height="10" rx="3" fill="var(--illo-pot-rim)" />

      {/* Carafe: glass, the coffee slowly filling, a ripple under each drop */}
      <path d={glassPath} fill="var(--illo-glass)" opacity="0.3" />
      <g clipPath={url('glass')}>
        <g
          className={level === undefined ? `animate-brew-fill ${still}` : undefined}
          transform={level === undefined ? undefined : `translate(0 ${(1 - Math.min(1, Math.max(0, level))) * EMPTY_DROP})`}
        >
          <rect x="110" y="346" width="170" height="70" fill={url('coffee')} />
          <ellipse cx="195" cy="346" rx="66" ry="5" fill="var(--illo-crema)" />
          <g fill="none" stroke="var(--illo-ripple)" strokeWidth="1">
            <ellipse className={`animate-brew-ripple origin-shape-center ${still}`} cx="195" cy="346" rx="6" ry="1.6" opacity="0" />
            <ellipse className={`animate-brew-ripple-late origin-shape-center ${still}`} cx="195" cy="346" rx="6" ry="1.6" opacity="0" />
          </g>
        </g>
      </g>
      <path d={glassPath} fill="none" stroke="var(--illo-glass-edge)" strokeOpacity="0.35" strokeWidth="1.5" />
      <g stroke="var(--illo-glass)" fill="none" strokeLinecap="round">
        <path d="M150 312 C134 332 132 362 140 386" strokeOpacity="0.85" strokeWidth="4" />
        <path d="M248 330 C254 344 255 358 252 370" strokeOpacity="0.5" strokeWidth="2.5" />
        <path d="M172 266 L174 292" strokeOpacity="0.7" strokeWidth="2" />
      </g>
      <path d="M162 276 L228 276 L230 296 L160 296 Z" fill={url('collar')} />
      <path d="M195 286 C204 292 214 304 210 314" stroke="var(--illo-tie)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="195" cy="286" r="3" fill="var(--illo-tie)" />

      {/* Drops */}
      <circle className={`animate-brew-drop ${still}`} cx="195" cy="262" r="3.6" fill={url('drop')} opacity="0" />
      <circle className={`animate-brew-drop-late ${still}`} cx="195" cy="262" r="3.6" fill={url('drop')} opacity="0" />

      {/* Pour-over: paper filter, glazed cone, rim, handle */}
      <path
        d="M146 150 C160 140 172 156 186 146 C200 138 212 154 226 144 C236 138 242 148 246 150 L246 164 L146 164 Z"
        fill="var(--illo-paper)"
      />
      <path d="M140 168 L250 168 L222 252 L168 252 Z" fill={url('ceramic')} />
      <path d="M156 180 L176 246 M195 178 L195 248 M234 180 L214 246" stroke="var(--illo-glass)" strokeOpacity="0.18" strokeWidth="2" />
      <path d="M150 176 C152 200 158 222 166 244" stroke="var(--illo-glass)" strokeOpacity="0.45" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="132" y="158" width="126" height="14" rx="7" fill={url('rim')} />
      <rect x="138" y="159" width="60" height="3" rx="1.5" fill="var(--illo-glass)" opacity="0.5" />
      <rect x="172" y="250" width="46" height="10" rx="3" fill="var(--illo-ceramic-dark)" />
      <path d="M258 172 C284 174 286 206 262 212" stroke={url('rim')} strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* Steam */}
      <g fill="none" stroke="var(--illo-steam)" strokeWidth="6" strokeLinecap="round" filter={url('soft')}>
        <path className={`animate-brew-steam origin-shape-bottom ${still}`} d="M176 140 C164 116 190 102 178 76" opacity="0" />
        <path className={`animate-brew-steam-mid origin-shape-bottom ${still}`} d="M200 138 C212 114 186 100 200 72" opacity="0" />
        <path className={`animate-brew-steam-late origin-shape-bottom ${still}`} d="M222 140 C210 118 234 104 222 80" opacity="0" />
      </g>
    </svg>
  );
}
