import type { Readable, Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';

export const storeArrayToStore = <T>(stores: Readable<T>[]): Readable<T[]> => {
  const result: Writable<T[]> = writable(stores.map(get));

  stores.forEach((store, i) => {
    store.subscribe((value) => {
      const current = get(result);
      current[i] = value;
      result.set(current);
    });
  });

  return result;
};
