import type { Category } from '@/types';
import { Icon, categoryIcon } from '../Icon';

export const categoryLabel: Record<Category, string> = {
  coffee: 'Coffee',
  tea: 'Tea',
  matcha: 'Matcha',
  gear: 'Gear',
};

export interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

/** Sets its own data-category, so it shows the right accent wherever it's placed. */
export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  return (
    <span
      data-category={category === 'gear' ? undefined : category}
      className={`inline-flex h-24 items-center gap-4 rounded-pill bg-accent pl-8 pr-10 font-display text-caption text-on-accent ${className}`}
    >
      <Icon name={categoryIcon[category]} size={16} />
      {categoryLabel[category]}
    </span>
  );
}
