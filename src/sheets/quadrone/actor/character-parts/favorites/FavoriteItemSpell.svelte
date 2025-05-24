<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemRollButton from './parts/FavoriteItemRollButton.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let subtitle = $derived(
    [
      favorite.item.labels.components.vsm,
      favorite.item.labels.activation,
    ].filterJoin(` <span class="divider-dot"></span> `),
  );

  let modifier = $derived(favorite.item.labels.modifier);

  let range = $derived(favorite.item.system.range);

  let save = $derived(
    favorite.item.system.activities.getByType('save')[0]?.save,
  );
</script>

<li
  class="favorite"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
  data-item-id={favorite.item.item?.id}
>
  <FavoriteItemRollButton {favorite} />
  <div class="name stacked">
    <span class="title">
      {favorite.item.name}
    </span>
    <span class="subtitle">
      {subtitle}
    </span>
  </div>
  <div class="info">
    <span class="primary">
      {#if !isNil(modifier)}
        {@const mod = getModifierData(modifier)}
        <span class="modifier">
          <span class="sign">
            {mod.sign}
          </span>
          <span>
            {mod.value}
          </span>
        </span>
      {:else if save?.dc?.value}
        <span class="ability">
          {save.ability}
        </span>
        <span class="value">
          {save.dc.value}
        </span>
      {/if}
    </span>
    <span class="secondary">
      {#if range?.value}
        <span class="range">
          {range.value}
          {#if range.long}&sol; {range.long}{/if}
          {range.units}
        </span>
      {:else if range?.reach}
        <span class="range">
          {range.reach}
          {range.units}
        </span>
      {/if}
    </span>
  </div>
</li>
