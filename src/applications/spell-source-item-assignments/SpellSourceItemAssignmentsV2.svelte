<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import Search from 'src/components/utility-bar/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { SvelteMap } from 'svelte/reactivity';
  import type {
    SpellSourceItemAssignment,
    SpellSourceItemAssignmentsContext,
  } from '../settings/editors/spell-source-item-assignments-settings-editor.svelte';
  import type { Actor5e } from 'src/types/types';
  import SpellSourceItemAssignments from './SpellSourceItemAssignments.svelte';

  type Props = {
    config: SpellSourceItemAssignmentsContext;
    actor: Actor5e;
  };

  let { actor, config }: Props = $props();

  let searchCriteria: string = $state('');

  let visibleSelectablesIdSubset = $derived(
    new Set<string>(
      config.assignments
        .filter(
          (s) =>
            searchCriteria.trim() === '' ||
            s.name?.toLowerCase().includes(searchCriteria.toLowerCase()),
        )
        .map((d) => d._id),
    ),
  );

  let classColumns = $derived(
    Object.entries<Item5e>(actor.spellcastingClasses).map(
      ([identifier, value]) => ({
        identifier: `${CONSTANTS.ITEM_TYPE_CLASS}:${identifier}`,
        item: value,
      }),
    ),
  );

  let sourceItemOverrides = new SvelteMap<string, string>();

  function currentSource(item: SpellSourceItemAssignment): string {
    return sourceItemOverrides.get(item._id) ?? item.sourceItem ?? '';
  }

  const localize = FoundryAdapter.localize;

  var showUnassignedOnly = $state(false);
</script>

<section class="dialog-content-container flexcol">
  <h2>{localize('TIDY5E.Utilities.AssignSpellsToClasses')}</h2>
  <p class="settings-description">
    {localize('TIDY5E.SheetSettings.AssignSpellsToClasses.hint')}
  </p>
  <div class="flexcol flexgap-3">
    <div role="presentation" class="flexrow flexgap-3">
      <Search bind:value={searchCriteria} />
      <label class="flexshrink checkbox">
        <input type="checkbox" bind:checked={showUnassignedOnly} />
        {localize('TIDY5E.SpellSourceItemAssignments.ShowUnassignedOnly.Text')}
      </label>
    </div>
    <div role="presentation" class="scroll-container flex1">
      <TidyTable key="spell-source-class-assignments-matrix" toggleable={false}>
        {#snippet header()}
          <TidyTableHeaderRow class="unset-header-height theme-dark">
            <TidyTableHeaderCell primary={true}>
              <h3
                class="truncate"
                data-tooltip="DND5E.spell"
                style="padding-inline-start: 0.75rem"
              >
                {localize('TYPES.Item.spell')}
              </h3>
            </TidyTableHeaderCell>
            <TidyTableHeaderCell columnWidth="12.5rem">
              <span class="truncate">{localize('TYPES.Item.class')}</span>
            </TidyTableHeaderCell>
            <TidyTableHeaderCell columnWidth="12.5rem" class="flexgap-1">
              <span
                >{localize(
                  'TIDY5E.SpellSourceItemAssignments.Identifier',
                )}</span
              >
              <i
                class="fas fa-question-circle"
                title={localize(
                  'TIDY5E.SpellSourceItemAssignments.IdentifierHint',
                )}
              ></i>
            </TidyTableHeaderCell>
          </TidyTableHeaderRow>
        {/snippet}
        {#snippet body()}
          {#each config.assignments as assignment (assignment._id)}
            {@const sourceItemValue = currentSource(assignment)}
            {@const sourceItemIsUnassigned = sourceItemValue.trim() === ''}
            {@const hideRow =
              !visibleSelectablesIdSubset.has(assignment._id) ||
              (showUnassignedOnly && !sourceItemIsUnassigned)}
            <TidyTableRow hidden={hideRow}>
              <TidyTableCell primary={true} class="flexrow">
                <!--svelte-ignore a11y_missing_attribute-->
                <a
                  tabindex="0"
                  role="button"
                  data-keyboard-focus
                  class="button button-borderless"
                  style="justify-content: flex-start;"
                  onclick={async () =>
                    FoundryAdapter.renderSheetFromUuid(assignment.uuid)}
                  onkeydown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      FoundryAdapter.renderSheetFromUuid(assignment.uuid);
                    }
                  }}
                >
                  {assignment.name}
                </a>
              </TidyTableCell>
              {@const isCustomSource =
                sourceItemValue !== '' &&
                !classColumns.some((c) => c.identifier === sourceItemValue)}
              <TidyTableCell
                columnWidth="12.5rem"
                attributes={{
                  onchange: (ev) =>
                    sourceItemOverrides.set(
                      assignment._id,
                      (ev.target as HTMLSelectElement).value,
                    ),
                }}
              >
                <select
                  bind:value={assignment.sourceItem}
                  disabled={!actor.isOwner}
                >
                  <option value="">—</option>
                  {#each classColumns as classColumn}
                    <option value={classColumn.identifier}>
                      {classColumn.item.name}
                    </option>
                  {/each}
                  {#if isCustomSource}
                    <option value={sourceItemValue} disabled>
                      {sourceItemValue}
                    </option>
                  {/if}
                </select>
              </TidyTableCell>
              <TidyTableCell columnWidth="12.5rem">
                <input
                  type="text"
                  bind:value={assignment.sourceItem}
                  disabled={!actor.isOwner}
                />
              </TidyTableCell>
            </TidyTableRow>
          {/each}
        {/snippet}
      </TidyTable>
    </div>
  </div>
</section>
