import type { ReactNode, SVGProps } from 'react';

export type IconName = 'plus' | 'minus' | 'trash' | 'check' | 'bean' | 'leaf' | 'whisk' | 'kettle' | 'arrow-right';

const paths: Record<IconName, ReactNode> = {
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
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
  kettle: (
    <>
      <path d="M6 20h12l-1-9a5 5 0 0 0-10 0l-1 9z" />
      <path d="M17 13l3-3M10 4h4M12 4v2" />
    </>
  ),
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: 16 | 20 | 24 | 32 | 48 | 64;
}

/** Line icons on a 24px grid, stroked in currentColor. Decorative unless given aria-label. */
export function Icon({ name, size = 20, ...rest }: IconProps) {
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
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

export const categoryIcon = { coffee: 'bean', tea: 'leaf', matcha: 'whisk', gear: 'kettle' } as const;
