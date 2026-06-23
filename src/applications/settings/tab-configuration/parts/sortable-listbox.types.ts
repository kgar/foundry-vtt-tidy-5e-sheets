import type { Snippet } from 'svelte';
import type { ClassValue } from 'svelte/elements';

export type SortableListboxColumn<Item> = {
  cellSnippet?: Snippet<[Item]>;
  title?: string;
  titleClasses?: ClassValue;
};
