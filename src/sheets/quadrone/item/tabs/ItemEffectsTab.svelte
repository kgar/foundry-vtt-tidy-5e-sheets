<script lang="ts">
  import TidyEffectTableRow from 'src/components/table-quadrone/TidyEffectTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetContext } from 'src/types/item.types';

  let context = $derived(getSheetContext<ItemSheetContext>());

  let effects = $derived(
    Object.entries(context.effects) as Iterable<[string, any]>,
  );

  const localize = FoundryAdapter.localize;

  function onAddClicked(section: any) {
    const owner = context.item;
    return FoundryAdapter.addEffect(section.type, owner);
  }
</script>

{#each effects as [key, section] (key)}
  {#if !section.hidden}
    <TidyTable {key}>
      {#snippet header()}
        <TidyTableHeaderRow class="dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            <span class="table-header-count">{section.effects.length}</span>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell>
            {localize('DND5E.SOURCE.FIELDS.source.label')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell>
            {localize('DND5E.Duration')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell class="header-actions">
            {#if context.editable}
              <button
                type="button"
                class="header-action"
                title={localize('DND5E.EffectCreate')}
                onclick={(event) => onAddClicked(section)}
                tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
              >
                <i class="fas fa-plus"></i>
              </button>
            {/if}
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {@const effectEntries = section.effects.map((effect: any) => ({
          effect,
        }))}

        {#each effectEntries as { effect } (effect.id)}
          <TidyEffectTableRow activeEffect={effect}>
            {#snippet children({ toggleSummary, expanded })}
              <span class="item-use-button">
                <img
                  class="item-image"
                  src={effect.img ?? effect.icon}
                  alt={effect.name ?? ''}
                />
              </span>
              <TidyTableCell primary={true}>
                <a class="item-name" onclick={(ev) => toggleSummary()}>
                  <span class="cell-name">{effect.name}</span>
                  <span class="row-detail-expand-indicator">
                    <i
                      class="fa-solid fa-angle-right expand-indicator"
                      class:expanded
                    >
                    </i>
                  </span>
                </a>
              </TidyTableCell>
              <TidyTableCell>
                {effect.sourceName ?? ''}
              </TidyTableCell>
              <TidyTableCell>
                {effect.duration.label ?? ''}
              </TidyTableCell>
              <TidyTableCell>Buttons here</TidyTableCell>
            {/snippet}
          </TidyEffectTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  {/if}
{/each}
