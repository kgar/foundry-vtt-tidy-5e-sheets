<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemRollButton from './parts/FavoriteRollButton.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

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
    getSaveData(favorite.item.system.activities.getByType('save')[0]?.save),
  );

  function getSaveData(save: any) {
    if (foundry.utils.getType(save?.ability) === 'Set')
      save = {
        ...save,
        ability:
          save.ability.size > 2
            ? game.i18n.localize('DND5E.AbbreviationDC')
            : Array.from<string>(save.ability)
                .map((k: string) => CONFIG.DND5E.abilities[k]?.abbreviation)
                .filterJoin(' / '),
      };

    return save;
  }
</script>

<li
  class="favorite"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
  data-item-id={favorite.item.item?.id}
>
  <FavoriteItemRollButton
    {favorite}
    img={favorite.item.img}
    title={favorite.item.name}
    onUse={async (ev) =>
      await FoundryAdapter.actorTryUseItem(favorite.item, ev)}
  />
  <div class="name stacked">
    <span class="title">
      {favorite.item.name}
    </span>
    <span class="subtitle">
      {@html subtitle}
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
