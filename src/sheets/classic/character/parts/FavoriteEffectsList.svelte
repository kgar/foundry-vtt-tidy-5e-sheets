<script lang="ts">
  import ItemImage from 'src/components/item-list/ItemImage.svelte';
  import EffectTableRow from 'src/components/item-list/v1/EffectTableRow.svelte';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import TidySwitch from 'src/components/toggles/TidySwitch.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    EffectFavoriteSection,
    FavoriteEffectContext,
  } from 'src/types/types';

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
      <EffectTableRow
        hidden={visibleEffectIdSubset !== null &&
          !visibleEffectIdSubset.has(effectContext.effect.id)}
        cssClass={effectContext.suppressed ? 'suppressed' : ''}
        attributes={{
          'data-favorite-id': effectContext.id,
          'data-info-card': 'effect',
          'data-info-card-entity-uuid': effectContext.effect.uuid,
        }}
        activeEffect={effectContext.effect}
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
            onChange={() => toggleEffect(effectContext)}
          />
        </ItemTableCell>
      </EffectTableRow>
    {/each}
  {/snippet}
</ItemTable>
