import { DemoProperty } from '@/types/demo-property';
import { US_LISTINGS_SEED } from '@/data/us-listings-seed';

export type { DemoProperty } from '@/types/demo-property';

let inMemoryCache: DemoProperty[] | null = null;

export async function fetchDemoProperties(): Promise<DemoProperty[]> {
  if (inMemoryCache) return inMemoryCache;
  inMemoryCache = US_LISTINGS_SEED;
  return inMemoryCache;
}
