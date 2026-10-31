import type { ReactNode, SVGProps } from 'react';

export type IconName =
  | 'plus' | 'minus' | 'trash' | 'check' | 'add'
  | 'chevron-left' | 'chevron-down' | 'chevron-up' | 'arrow-right'
  | 'info' | 'truck' | 'sliders' | 'tag' | 'bag' | 'sun' | 'moon'
  | 'bean' | 'leaf' | 'whisk' | 'kettle' | 'cookie' | 'jar' | 'cup' | 'close';

const paths: Record<IconName, ReactNode> = {
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  add: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  'chevron-left': <path d="M15 5l-7 7 7 7" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'chevron-up': <path d="M6 15l6-6 6 6" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  tag: (
    <>
      <path d="M12 3H4v8l9 9 8-8-9-9z" />
      <circle cx="8" cy="7" r="1.2" />
    </>
  ),
  bag: <path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  bean: (
    <>
      <ellipse cx="12" cy="12" rx="6.5" ry="9" transform="rotate(30 12 12)" />
      <path d="M8.5 18.5c3-2.5 1-6.5 3.5-9s4-3 4-3" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
      <path d="M5 19l8-8" />
    </>
  ),
  whisk: (
    <>
      <path d="M12 3v6" />
      <path d="M9 9h6l1 2c0 5-2 9-4 10-2-1-4-5-4-10l1-2z" />
      <path d="M12 11v9M10 12c0 4 1 7 2 8M14 12c0 4-1 7-2 8" />
    </>
  ),
  cup: (
    <>
      <path d="M5 9h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V9z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H16.5M9 3.5c-.8 1 .8 2 0 3M13 3.5c-.8 1 .8 2 0 3" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  kettle: (
    <>
      <path d="M6 20h12l-1-9a5 5 0 0 0-10 0l-1 9z" />
      <path d="M17 13l3-3M10 4h4M12 4v2" />
    </>
  ),
  cookie: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 9h.01M14.5 8.5h.01M15 14h.01M9.5 15h.01M12 11.5h.01" strokeWidth="2.5" />
    </>
  ),
  jar: (
    <>
      <path d="M8 4h8v3H8z" />
      <path d="M7 7h10a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1z" />
      <path d="M6 12h12" />
    </>
  ),
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: 16 | 20 | 24 | 32 | 48 | 64;
}

/** Line icons on a 24px grid, stroked in currentColor. Decorative unless given aria-label. */
export function Icon({ name, size = 24, className = '', ...rest }: IconProps) {
  const labelled = Boolean(rest['aria-label']);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={labelled ? undefined : true}
      role={labelled ? 'img' : undefined}
      focusable="false"
      className={`block shrink-0 ${className}`}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

export const categoryIcon = { coffee: 'bean', tea: 'leaf', matcha: 'whisk', gear: 'kettle', bites: 'cookie', sweeteners: 'jar' } as const;
