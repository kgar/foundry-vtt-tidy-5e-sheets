<script lang="ts">
  import type { FavoriteContextEntry } from 'src/types/types';
  import FavoriteItemRollButton from './parts/FavoriteRollButton.svelte';

  interface Props {
    favorite: FavoriteContextEntry;
    img: string;
    name: string;
    onUse: (ev: MouseEvent) => Promise<void>;
    subtitle: string;
    children?: import('svelte').Snippet;
    dataAttributes?: Record<string, string | number | boolean | null | undefined>;
  }

  let { 
    favorite,
    img,
    name,
    onUse,
    subtitle,
    children,
    dataAttributes,
  }: Props = $props();
</script>

<li
  class="favorite tidy-table-row"
  {...Object.fromEntries(
    Object.entries(dataAttributes || {})
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [`data-${key}`, value])
  )}
>
  <FavoriteItemRollButton
    {favorite}
    img={img}
    title={name}
    onUse={onUse}
  />
  <div class="tidy-table-cell primary">
    <div class="item-name stacked">
      <span class="title">
        {name}
      </span>
      <span class="subtitle flexrow color-text-lighter font-default-small">
        {@html subtitle}
      </span>
    </div>
  </div>
  <div class="tidy-table-cell stacked">
    {@render children?.()}
  </div>
</li>
