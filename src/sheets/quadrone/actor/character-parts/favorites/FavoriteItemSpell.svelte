<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
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
    ].filterJoin(` <div class="divider-dot"></div> `),
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
  class="list-entry favorite"
  data-favorite-type="spell"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={favorite.item?.id}
  data-favorite-id={favorite.id}
  data-tidy-draggable
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, favorite.item)}
  data-tidy-sheet-part="favorite-entry"
>
  <FavoriteRollButton
    {favorite}
    img={favorite.item.img}
    title={favorite.item.name}
    onUse={async (ev) =>
      await FoundryAdapter.actorTryUseItem(favorite.item, ev)}
    name={favorite.item.name}
    {subtitle}
  />
  {#if !isNil(modifier) || !isNil(save?.dc?.value) || !isNil(range?.value)}
    <div class="">
      <span class="primary">
        {#if !isNil(modifier)}
          {@const mod = getModifierData(modifier)}
          <span class="modifier">
            <span class="sign font-default-medium color-text-lighter"
              >{mod.sign}</span
            ><span class="value font-data-medium">{mod.value}</span>
          </span>
        {:else if save?.dc?.value}
          <span class="ability font-label-medium color-text-gold-emphasis">
            {save.ability}
          </span>
          <span class="value font-data-medium">
            {save.dc.value}
          </span>
        {/if}
      </span>
      <span class="secondary">
        {#if range?.value}
          <span class="range">
            {range.value}
            {#if range.long}&sol; {range.long}{/if}
          </span>
          <span class="units font-default-medium color-text-lighter">
            {range.units}
          </span>
        {:else if range?.reach}
          <span class="range">
            {range.reach}
          </span>
          <span class="units font-default-medium color-text-lighter">
            {range.units}
          </span>
        {/if}
      </span>
    </div>
  {/if}
</li>
