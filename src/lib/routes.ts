import type { ShopTabId } from '@/data/labels';

export const homeHref = '/';
/** The homepage's "How it works" section. */
export const howItWorksHref = '/#how-it-works';
export const boxHref = '/box';
export const onboardingHref = '/onboarding';
export const itemHref = (itemId: string): string => `/item/${itemId}`;
export const shopHref = (tab: ShopTabId = 'for-you'): string => `/shop?tab=${tab}`;
