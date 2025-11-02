<script lang="ts">
  import type { ColumnHeaderProps } from 'src/runtime/types';
  import type {
    Actor5e,
    DocumentSheetQuadroneContext,
    SpellbookSection,
    TidySectionBase,
  } from 'src/types/types';

  let {
    sheetContext,
    sheetDocument,
    section,
  }: ColumnHeaderProps<
    Actor5e,
    DocumentSheetQuadroneContext<any>,
    TidySectionBase | SpellbookSection
  > = $props();
</script>

{#each section.headerActions as action}
  <action.component {...action.props} />
{/each}

<!-- Configured Controls -->
<!-- {#each sectionActions as action}
  <a
    class="tidy-table-button"
    data-tooltip
    aria-label={localize(action.tooltip ?? action.label ?? '')}
    onclick={(event) =>
      action.execute?.({ actor: sheetContext.document, event, section })}
  >
    {#if action.iconClass}
      <i class={action.iconClass}></i>
    {/if}
  </a>
{/each}

{#if sheetContext.editable && 'canCreate' in section && !!section.canCreate}
  <a
    class="tidy-table-button"
    aria-label={localize('DND5E.ItemCreate')}
    data-tooltip
    onclick={onAddClicked}
  >
    <i class="fas fa-plus"></i>
  </a>
{/if}

{#if 'slots' in section && section.usesSlots && sheetContext.unlocked}
  <a
    aria-label={localize('DND5E.SpellSlotsConfig')}
    class="tidy-table-button"
    data-tooltip="DND5E.SpellSlotsConfig"
    onclick={() => FoundryAdapter.openSpellSlotsConfig(sheetDocument)}
  >
    <i class="fas fa-cog"></i>
  </a>
{/if} -->
