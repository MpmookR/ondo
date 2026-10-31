export interface OnboardingProgressProps {
  /** 1-based. */
  step: number;
  total: number;
  /** The last step is optional, so it says so instead of counting down. */
  lastIsOptional?: boolean;
  className?: string;
}

/** Where the coffee sits in the cup: from just covering the bottom (step 1) to the brim (last step). */
const CUP_TOP = 14;
const CUP_BOTTOM = 38;

/**
 * A little cup that fills as you go: the coffee rises one step at a time, and steam curls up on the
 * last step. Decorative; the progress bar beside it carries the meaning.
 */
function FillingCup({ fraction, done }: { fraction: number; done: boolean }) {
  const level = CUP_BOTTOM - (CUP_BOTTOM - CUP_TOP) * fraction;
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-44 shrink-0 overflow-visible">
      <defs>
        <clipPath id="onboarding-cup-inside">
          <path d="M9 14h26l-3 22a4 4 0 0 1-4 3.5H16a4 4 0 0 1-4-3.5z" />
        </clipPath>
      </defs>
      {done && (
        <g fill="none" stroke="var(--illo-steam)" strokeWidth="2" strokeLinecap="round" opacity="0.9">
          <path d="M17 10c-2-3 2-4 0-7" className="origin-shape-bottom animate-brew-steam motion-reduce:animate-none" />
          <path d="M23 10c-2-3 2-4 0-7" className="origin-shape-bottom animate-brew-steam-mid motion-reduce:animate-none" />
          <path d="M29 10c-2-3 2-4 0-7" className="origin-shape-bottom animate-brew-steam-late motion-reduce:animate-none" />
        </g>
      )}
      {/* Handle, then the cup and the coffee inside it */}
      <path d="M34 19h3a5 5 0 0 1 0 10h-4" fill="none" stroke="var(--illo-ceramic-dark)" strokeWidth="3" />
      <path d="M9 14h26l-3 22a4 4 0 0 1-4 3.5H16a4 4 0 0 1-4-3.5z" fill="var(--illo-ceramic-light)" />
      <g clipPath="url(#onboarding-cup-inside)">
        <g
          className="transition-transform duration-500 ease-brew motion-reduce:transition-none"
          style={{ transform: `translateY(${level - CUP_TOP}px)` }}
        >
          <rect x="6" y={CUP_TOP} width="36" height="30" fill="var(--illo-coffee-top)" />
          <rect x="6" y={CUP_TOP} width="36" height="2" fill="var(--illo-crema)" />
        </g>
      </g>
      <path d="M9 14h26l-3 22a4 4 0 0 1-4 3.5H16a4 4 0 0 1-4-3.5z" fill="none" stroke="var(--illo-ceramic-dark)" strokeWidth="2" />
      <rect x="7" y="12.5" width="30" height="3" rx="1.5" fill="var(--illo-ceramic)" />
    </svg>
  );
}

/**
 * Onboarding progress: "Step 3 of 8" and how many are left, a segmented bar (done steps in brand
 * green, the current one stretched and in spark), and a cup that fills as you go.
 */
export function OnboardingProgress({ step, total, lastIsOptional = false, className = '' }: OnboardingProgressProps) {
  const left = total - step;
  const isLast = step === total;
  const leftText = isLast ? (lastIsOptional ? 'Last one, and it’s optional' : 'Last one') : `${left} to go`;
  return (
    <div className={`flex items-center gap-12 ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <p className="flex items-baseline justify-between gap-8 font-sans">
          <span className="text-label">
            Step {step} <span className="font-regular text-text-muted">of {total}</span>
          </span>
          <span className="text-caption text-text-muted" aria-hidden="true">
            {leftText}
          </span>
        </p>
        <div
          role="progressbar"
          aria-label="Building your box"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step}
          aria-valuetext={`Step ${step} of ${total}, ${leftText.toLowerCase()}`}
          className="flex h-8 items-center gap-4"
        >
          {Array.from({ length: total }, (_, i) => {
            const n = i + 1;
            const state = n < step ? 'bg-brand' : n === step ? 'bg-spark' : 'bg-border';
            return (
              <span
                key={n}
                className={`h-full rounded-pill transition-[flex-grow,background-color] duration-500 ease-brew motion-reduce:transition-none ${state} ${
                  n === step ? 'grow-3' : 'grow'
                }`}
              />
            );
          })}
        </div>
      </div>
      <FillingCup fraction={step / total} done={isLast} />
    </div>
  );
}
