<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import TidyAdvancementTableRow from 'src/components/table-quadrone/TidyAdvancementTableRow.svelte';
  import { isNil } from 'src/utils/data';
  import { CONSTANTS } from 'src/constants';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type { AdvancementTableAction } from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import SectionActions, {
    type AdvancementTableHeaderAction,
  } from 'src/features/sections/SectionActions';

  let localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());
  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  let advancements = $derived(Object.entries(context.advancement));

  // TODO: Move advancement sections / columns / row actions to context prep
  let tableRowActions: AdvancementTableAction[] = $derived(
    TableRowActionsRuntime.getItemAdvancementRowActions(context),
  );
</script>

<!-- TODO: Advancements, derive from TidySectionBase -->
<!-- TODO: Advancements, use column specs and custom column components -->
<!-- TODO: Advancements, use header action and row action render components -->
{#each advancements as [key, section]}
  {let tableHeaderActions: AdvancementTableHeaderAction[] = $derived(
    SectionActions.getItemAdvancementHeaderActions(
      context.item,
      context.unlocked,
      key,
      section.configured,
      context.editable,
    ),
  )}

  <!-- 
    Unlike with most other tables, this table cannot hide 
    the header buttons when there are too few row actions. 
    All header controls must be visible, always. 
  -->
  {let arrayWithMostActions = $derived(
    tableRowActions.length > tableHeaderActions.length
      ? tableRowActions
      : tableHeaderActions,
  )}

  {const rowActionInfo = $derived(
    TableRowActionsRuntime.getRowActionWidthInfo(
      section.items,
      (_entry) => arrayWithMostActions,
    ),
  )}

  <TidyTable {key}>
    {#snippet header()}
      <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
        <TidyTableHeaderCell primary={true} class="header-label-cell">
          <h3>
            {#if key === CONSTANTS.ADVANCEMENT_LEVEL_ZERO}
              {localize('DND5E.AdvancementLevelAnyHeader')}
            {:else if key === CONSTANTS.ADVANCEMENT_LEVEL_UNCONFIGURED}
              {localize('DND5E.AdvancementLevelNoneHeader')}
            {:else}
              {localize('DND5E.AdvancementLevelHeader', { level: key })}
            {/if}
          </h3>
        </TidyTableHeaderCell>
        <TidyTableHeaderCell columnWidth="3.75rem">
          {localize('DND5E.Value')}
        </TidyTableHeaderCell>

        <TidyTableHeaderCell
          class="header-cell-actions"
          columnWidth="{rowActionInfo.widthRems}rem"
        >
          {#each tableHeaderActions as headerAction}
            {#if headerAction.condition?.({ data: { key, section } }) ?? true}
              <headerAction.component
                {...headerAction.props({
                  data: { key, section },
                })}
              />
            {/if}
          {/each}
        </TidyTableHeaderCell>
      </TidyTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each section.items as advancement (advancement.id)}
        <TidyAdvancementTableRow
          {advancement}
          item={context.item}
          rowClass="advancement-item"
        >
          {#snippet children()}
            <span class="tidy-table-row-use-button disabled">
              <img
                class="item-image"
                src={advancement.icon}
                alt={advancement.title ?? ''}
              />
            </span>
            <TidyTableCell primary={true}>
              <div class="item-name">
                <div class="cell-text">
                  <div class="cell-name">
                    {@html advancement.title}
                    {#each advancement.tags as tag}
                      <i class={tag.iconClass} title={localize(tag.label)}></i>
                    {/each}
                  </div>
                  <div class="advancement-cell-context">
                    {@html advancement.summary}
                  </div>
                </div>
              </div>
            </TidyTableCell>
            <TidyTableCell columnWidth="3.75rem">
              {#if !isNil(advancement.value)}
                {const value = $derived(advancement.value?.toString())}
                <span class="truncate" data-tooltip={value}>
                  {value}
                </span>
              {:else}
                <span class="color-text-disabled">&mdash;</span>
              {/if}
            </TidyTableCell>
            <TidyTableCell
              class="tidy-table-actions"
              columnWidth="{rowActionInfo.widthRems}rem"
            >
              {#each tableRowActions as action}
                {const props = $derived(
                  action.props({
                    data: advancement,
                  }),
                )}
                <action.component {...props} />
              {/each}
            </TidyTableCell>
          {/snippet}
        </TidyAdvancementTableRow>
      {/each}
    {/snippet}
  </TidyTable>
{:else}
  <button
    type="button"
    class="button button-primary"
    title={localize('DND5E.ADVANCEMENT.Action.Create')}
    aria-label={localize('DND5E.ADVANCEMENT.Action.Create')}
    onclick={() =>
      FoundryAdapter.createAdvancementSelectionDialog(context.item)}
  >
    <i class="fas fa-plus"></i>
    {localize('DND5E.ADVANCEMENT.Action.Create')}
  </button>
{/each}
