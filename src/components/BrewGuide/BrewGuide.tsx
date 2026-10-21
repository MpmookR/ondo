import type { BrewGuideData } from '@/types';

export interface BrewGuideProps {
  brew: BrewGuideData;
  className?: string;
}

/** Brew data in monospace. Tea adds steeps, matcha adds the whisk; fields only show when present. */
export function BrewGuide({ brew, className = '' }: BrewGuideProps) {
  const rows: [string, string][] = [
    ['Ratio', brew.ratio],
    ['Water', `${brew.tempC}°C`],
    ['Time', brew.time],
  ];
  if (brew.steeps) rows.push(['Steeps', `${brew.steeps}×`]);
  if (brew.whisk) rows.push(['Whisk', brew.whisk]);

  return (
    <dl className={`grid grid-cols-3 gap-12 rounded-card border border-border p-16 ${className}`}>
      {rows.map(([label, value]) => (
        <div key={label} className={label === 'Whisk' ? 'col-span-2' : ''}>
          <dt className="font-mono text-eyebrow uppercase text-text-muted">{label}</dt>
          <dd className="mt-4 font-mono text-label text-text-primary">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
