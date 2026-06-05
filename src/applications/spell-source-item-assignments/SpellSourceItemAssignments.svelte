<script lang="ts">
  import type { SpellSourceItemAssignmentsContext } from './SpellSourceItemAssignmentsFormApplication.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import Search from 'src/components/utility-bar/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { SvelteMap } from 'svelte/reactivity';

  let context = $derived(
    getContext<CoarseReactivityProvider<SpellSourceItemAssignmentsContext>>(
      CONSTANTS.SVELTE_CONTEXT.CONTEXT,
    ).data,
  );

  let searchCriteria: string = $state('');

  let visibleSelectablesIdSubset = $derived(
    new Set<string>(
      context.assignments
        .filter(
          (s) =>
            searchCriteria.trim() === '' ||
            s.item.name?.toLowerCase().includes(searchCriteria.toLowerCase()),
        )
        .map((d) => d.item.id),
    ),
  );

  let classColumns = $derived(
    Object.entries<Item5e>(context.actor.spellcastingClasses).map(
      ([identifier, value]) => ({
        identifier: `${CONSTANTS.ITEM_TYPE_CLASS}:${identifier}`,
        item: value,
      }),
    ),
  );

  let sourceItemOverrides = new SvelteMap<string, string>();

  function currentSource(item: Item5e): string {
    return sourceItemOverrides.get(item.id) ?? item.system.sourceItem ?? '';
  }

  const localize = FoundryAdapter.localize;

  var showUnassignedOnly = $state(false);
</script>

<section class="dialog-content-container flexcol">
  <h2> {localize('TIDY5E.Utilities.AssignSpellsToClasses')}</h2>
  <p class="settings-description">
    {localize('TIDY5E.SheetSettings.AssignSpellsToClasses.hint')}
  </p>
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
              >{localize('TIDY5E.SpellSourceItemAssignments.Identifier')}</span
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
        {#each context.assignments as assignment (assignment.item.id)}
          {@const sourceItemValue = currentSource(assignment.item)}
          {@const sourceItemIsUnassigned = sourceItemValue.trim() === ''}
          {@const hideRow =
            !visibleSelectablesIdSubset.has(assignment.item.id) ||
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
                  FoundryAdapter.renderSheetFromUuid(assignment.item.uuid)}
                onkeydown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    FoundryAdapter.renderSheetFromUuid(assignment.item.uuid);
                  }
                }}
              >
                {assignment.item.name}
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
                    assignment.item.id,
                    (ev.target as HTMLSelectElement).value,
                  ),
              }}
            >
              <SelectQuadrone
                field="system.sourceItem"
                document={assignment.item}
                value={sourceItemValue}
                blankValue=""
                disabled={!assignment.item.isOwner}
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
              </SelectQuadrone>
            </TidyTableCell>
            <TidyTableCell columnWidth="12.5rem">
              <TextInput
                document={assignment.item}
                disabled={!assignment.item.isOwner}
                field="system.sourceItem"
                selectOnFocus={true}
                value={sourceItemValue}
                onSaveChange={(ev) => {
                  sourceItemOverrides.set(
                    assignment.item.id,
                    ev.currentTarget.value,
                  );
                  return true;
                }}
              />
            </TidyTableCell>
          </TidyTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  </div>
</section>
