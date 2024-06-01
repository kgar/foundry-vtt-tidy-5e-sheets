<script lang="ts">
  import ItemImage from 'src/components/item-list/ItemImage.svelte';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    CharacterSheetContext,
    EffectFavoriteSection,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>('context');
  export let section: EffectFavoriteSection;

  /**
   * An optional subset of item IDs which will hide all other items not included in this set.
   * Useful for showing only search results, for example.
   */
  export let visibleEffectIdSubset: Set<string> | null = null;

  const localize = FoundryAdapter.localize;
</script>

<ItemTable key={section.key}>
  <svelte:fragment slot="header">
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize(section.label ?? 'DND5E.Effect')}
      </ItemTableColumn>
    </ItemTableHeaderRow>
  </svelte:fragment>
  <svelte:fragment slot="body">
    {#each section.effects as effect (effect.effectId)}
      <ItemTableRow
        effect={effect.effect}
        on:mousedown={(event) =>
          FoundryAdapter.editOnMiddleClick(event.detail, effect.effect)}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS,
          uuid: effect.effect.uuid,
        }}
        hidden={visibleEffectIdSubset !== null &&
          !visibleEffectIdSubset.has(effect.effectId)}
        favoriteId={effect.id}
      >
        <ItemTableCell
          primary={true}
          attributes={{
            'data-tidy-effect-name-container': true,
            'data-effect-id': effect.id,
          }}
        >
          <ItemImage src={effect.img} />
          <span
            class="align-self-center truncate"
            data-tidy-effect-name={effect.effect.name}
            >{effect.effect.name}</span
          >
        </ItemTableCell>
      </ItemTableRow>
    {/each}
  </svelte:fragment>
</ItemTable>
