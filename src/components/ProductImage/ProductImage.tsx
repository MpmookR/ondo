import type { Category } from '@/types';
import { isDrinkCategory } from '@/data/labels';
import { Icon, categoryIcon } from '../Icon';

export interface ProductImageProps {
  category: Category;
  /** Short text printed on the pack label, e.g. the size. Pass rounding in className. */
  label?: string;
  /** Pack shot base path (`item.image`). When set, the photo replaces the drawn pack. */
  image?: string;
  /** How wide the image shows, so the browser picks the 304px or 684px file. */
  sizes?: string;
  className?: string;
}

/**
 * Pack shot. Drinks with an `image` show the photo (transparent PNG art, sitting straight on the card);
 * anything else falls back to a pack drawn in the category accent, and add-ons show their
 * category icon. Decorative (the name is always next to it), so it's hidden from screen readers.
 */
export function ProductImage({ category, label, image, sizes = '(min-width: 1024px) 240px, 50vw', className = '' }: ProductImageProps) {
  if (image) {
    return (
      <div aria-hidden="true" className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${image}-304.webp`}
          srcSet={`${image}-304.webp 304w, ${image}-684.webp 684w`}
          sizes={sizes}
          width={304}
          height={400}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      data-category={category}
      className={`relative grid place-items-center overflow-hidden bg-accent-subtle text-accent ${className}`}
    >
      {!isDrinkCategory(category) ? (
        <Icon name={categoryIcon[category]} size={48} className="h-1/2 w-auto" />
      ) : (
        <svg viewBox="0 0 64 80" className="h-3/4 w-auto">
          {category === 'coffee' && (
            <>
              <path d="M14 14h36l3 58a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4l3-58z" className="fill-accent" />
              <path d="M14 14l4-8h28l4 8" className="fill-accent opacity-80" />
              <path d="M18 10h28" className="stroke-on-accent opacity-40" strokeWidth="1.5" />
            </>
          )}
          {category === 'tea' && (
            <>
              <rect x="10" y="12" width="44" height="64" rx="3" className="fill-accent" />
              <rect x="10" y="12" width="44" height="10" rx="3" className="fill-accent opacity-80" />
              <path d="M10 22h44" className="stroke-on-accent opacity-40" strokeWidth="1.5" />
            </>
          )}
          {category === 'matcha' && (
            <>
              <rect x="12" y="18" width="40" height="58" rx="4" className="fill-accent" />
              <ellipse cx="32" cy="18" rx="20" ry="6" className="fill-accent opacity-80" />
              <path d="M12 30h40" className="stroke-on-accent opacity-40" strokeWidth="1.5" />
            </>
          )}
          <rect x="18" y="40" width="28" height="22" rx="2" className="fill-bg-surface" />
          <circle cx="32" cy="48" r="4" fill="none" className="stroke-accent" strokeWidth="1.75" />
          {label && (
            <text x="32" y="58.5" textAnchor="middle" className="fill-text-primary font-mono" fontSize="5">
              {label}
            </text>
          )}
        </svg>
      )}
    </div>
  );
}
