import { ISortModel } from './interfaces';

export const DEBOUNCE_TIME = 500;
export const STALE_TIME = 2 * 60 * 1000;

export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [25, 50];

export const DEFAULT_SORT_MODEL = {
  field: 'firstname',
  order: 'asc',
} as ISortModel;
