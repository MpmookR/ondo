import type { ShopTabId } from '@/data/labels';

export const itemHref = (itemId: string): string => `/item/${itemId}`;
export const shopHref = (tab: ShopTabId = 'for-you'): string => `/shop?tab=${tab}`;
