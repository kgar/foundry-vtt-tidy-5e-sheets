<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { getModifierData } from 'src/utils/formatting';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
  import FavoriteItemUses from './parts/FavoriteItemUses.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  const { favorite }: Props = $props();
  const localize = FoundryAdapter.localize;
  const context = $derived(getCharacterSheetQuadroneContext());
  const unidentified = $derived(ItemUtils.isUnidentified(favorite.item));
  const concealed = $derived(
    ItemUtils.isConcealed(favorite.item, { unlocked: context.unlocked }),
  );

  const subtitle = $derived(
    [
      favorite.item.system.type?.label ??
        game.i18n.localize(CONFIG.Item.typeLabels[favorite.item.type]),
    ].filterJoin(` <div class="divider-dot"></div> `),
  );

  const uses = $derived(
    favorite.item?.system?.hasLimitedUses
      ? favorite.item?.system?.getUsesData?.()
      : null,
  );

  const modifier = $derived(favorite.item?.labels?.modifier);

  const save: any = $derived.by(() => {
    const saveData =
      favorite.item?.system?.activities?.getByType?.('save')?.[0]?.save;
    if (foundry.utils.getType(saveData?.ability) === 'Set')
      return {
        ...saveData,
        ability:
          saveData.ability.size > 2
            ? game.i18n.localize('DND5E.AbbreviationDC')
            : Array.from<string>(saveData.ability)
                .map((k: string) => CONFIG.DND5E.abilities[k]?.abbreviation)
                .filterJoin(' / '),
      };
    return saveData;
  });

  const quantity = $derived(favorite.item?.system?.quantity);

  const range = $derived(favorite.item?.system?.range);

  const showPrimary = $derived(uses?.max || !isNil(modifier) || save?.dc?.value || quantity);
  const showSecondary = $derived(range?.value || range?.reach);
</script>

<div
  class="list-entry favorite {unidentified ? 'diminished' : ''}"
  data-favorite-type="generic"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={favorite.item?.id}
  data-favorite-id={favorite.id}
  data-tidy-draggable
  data-tidy-sheet-part="favorite-entry"
>
  <FavoriteRollButton
    img={favorite.item?.img}
    title={favorite.item?.name}
    data-action="use"
    name={favorite.item?.name || ''}
    {subtitle}
  />
  <div
    class={{
      stacked: showPrimary && showSecondary,
    }}
  >
    {#if showPrimary}
    <span class="primary">
      {#if uses?.max && !concealed}
        <FavoriteItemUses {favorite} {uses} />
      {:else if !isNil(modifier)}
        {const mod = $derived(getModifierData(modifier))}
        <span class="modifier">
          <span class="sign font-default-medium color-text-lighter">
            {mod.sign}
          </span>
          <span>
            {mod.value}
          </span>
        </span>
      {:else if save?.dc?.value && !concealed}
        <span class="ability font-label-medium color-text-gold-emphasis">
          {save.ability}
        </span>
        <span class="value font-data-medium">
          {save.dc.value}
        </span>
      {:else if quantity}
        <span class="sign font-default-medium color-text-lightest">&times;</span>
        <span class="value">{quantity}</span>
      {:else if concealed}
        <span class="value color-text-lightest">{localize('TIDY5E.Table.UnidentifiedPlaceholder')}</span>
      {/if}
    </span>
    {/if}
    {#if showSecondary}
    <span class="secondary">
      {#if uses?.max && quantity && !concealed}
        <span class="quantity">&times; {quantity}</span>
      {:else if range?.value}
        {const units =
          $derived(CONFIG.DND5E.movementUnits[range.units]?.abbreviation ?? range.units)}
        <span class="range">
          {range.value}
          {#if range.long}&sol; {range.long}{/if}
          {units}
        </span>
      {:else if range?.reach}
        {const units =
          $derived(CONFIG.DND5E.movementUnits[range.units]?.abbreviation ?? range.units)}
        <span class="range">
          {range.reach}
          {units}
        </span>
      {/if}
    </span>
    {/if}
  </div>
</div>
