<script lang="ts">
  import ItemImage from 'src/components/item-list/ItemImage.svelte';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import TidySwitch from 'src/components/toggle/TidySwitch.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    CharacterSheetContext,
    EffectFavoriteSection,
    FavoriteEffectContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  interface Props {
    section: EffectFavoriteSection;
    /**
     * An optional subset of item IDs which will hide all other items not included in this set.
     * Useful for showing only search results, for example.
     */
    visibleEffectIdSubset?: Set<string> | null;
  }

  let { section, visibleEffectIdSubset = null }: Props = $props();

  const localize = FoundryAdapter.localize;

  function toggleEffect(context: FavoriteEffectContext): void {
    context.effect.update({ disabled: !context.effect.disabled });
  }

  const subtitleColumnWidth = '5rem';
  const controlsColumnWidth = '3rem';
</script>

<ItemTable key={section.key} class="favorite-effects">
  {#snippet header()}
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize(section.label ?? 'DND5E.Effect')}
      </ItemTableColumn>
      <ItemTableColumn baseWidth={subtitleColumnWidth}>
        <!-- Subtitle -->
      </ItemTableColumn>
      <ItemTableColumn baseWidth={controlsColumnWidth}>
        <!-- Controls -->
      </ItemTableColumn>
    </ItemTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each section.effects as effectContext (effectContext.effectId)}
      <ItemTableRow
        effect={effectContext.effect}
        on:mousedown={(event) =>
          FoundryAdapter.editOnMiddleClick(event.detail, effectContext.effect)}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS,
          uuid: effectContext.effect.uuid,
        }}
        hidden={visibleEffectIdSubset !== null &&
          !visibleEffectIdSubset.has(effectContext.effect.id)}
        favoriteId={effectContext.id}
        cssClass={effectContext.suppressed ? 'suppressed' : ''}
      >
        <ItemTableCell
          primary={true}
          attributes={{
            'data-tidy-effect-name-container': true,
            'data-effect-id': effectContext.id,
          }}
        >
          <ItemImage src={effectContext.img} />
          <span
            class="align-self-center truncate"
            data-tidy-effect-name={effectContext.effect.name}
            >{effectContext.effect.name}</span
          >
        </ItemTableCell>
        <ItemTableCell baseWidth={subtitleColumnWidth}>
          {effectContext.subtitle ?? ''}
        </ItemTableCell>
        <ItemTableCell baseWidth={controlsColumnWidth}>
          <TidySwitch
            disabled={effectContext.suppressed}
            checked={effectContext.toggle.value}
            on:change={() => toggleEffect(effectContext)}
          />
        </ItemTableCell>
      </ItemTableRow>
    {/each}
  {/snippet}
</ItemTable>
