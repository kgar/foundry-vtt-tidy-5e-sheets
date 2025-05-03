<script lang="ts">
  import type { SpellSourceClassAssignmentsContext } from './SpellSourceClassAssignmentsFormApplication.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import Search from 'src/components/utility-bar/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTable, {
    type TidyTableColumns,
  } from 'src/components/table/TidyTable.svelte';
  import type { Item5e } from 'src/types/item.types';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import TidySwitch from 'src/components/toggles/TidySwitch.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';

  let context = $derived(
    getContext<CoarseReactivityProvider<SpellSourceClassAssignmentsContext>>(
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
      ([key, value]) => ({
        key: key,
        item: value,
      }),
    ),
  );

  let gridTemplateColumns: TidyTableColumns = $derived.by(() => {
    let columns: TidyTableColumns = [
      { name: 'Spell Name', width: 'minmax(12.5rem, 1fr)' },
    ];

    let standardClassColumnWidth = '10rem';
    classColumns.forEach((column) => {
      columns.push({ name: column.item.name, width: standardClassColumnWidth });
    });

    columns.push({ name: 'Identifier', width: '12.5rem' });

    return columns;
  });

  async function setItemSourceClass(item: Item5e, sourceClass: string) {
    await item.update({
      'system.sourceClass': sourceClass,
    });
  }

  const localize = FoundryAdapter.localize;

  var showUnassignedOnly = $state(false);
</script>

<section class="flex-column small-gap full-height">
  <div role="presentation" class="flex-row small-gap">
    <Search bind:value={searchCriteria} />
    <label class="flex-row extra-small-gap align-items-center">
      <input type="checkbox" bind:checked={showUnassignedOnly} />
      {localize('TIDY5E.SpellSourceClassAssignments.ShowUnassignedOnly.Text')}
    </label>
  </div>
  <div role="presentation" class="scroll-container flex-1">
    <TidyTable
      key="spell-source-class-assignments-matrix"
      toggleable={false}
      {gridTemplateColumns}
    >
      {#snippet header()}
        <TidyTableHeaderRow>
          <TidyTableHeaderCell primary={true} class="p-1 capitalize">
            {localize('DND5E.spell')}
          </TidyTableHeaderCell>
          {#each classColumns as classColumn}
            <TidyTableHeaderCell>
              {classColumn.item.name}
            </TidyTableHeaderCell>
          {/each}
          <TidyTableHeaderCell class="flex-row small-gap">
            <span
              >{localize('TIDY5E.SpellSourceClassAssignments.Identifier')}</span
            >
            <i
              class="fas fa-question-circle"
              title={localize(
                'TIDY5E.SpellSourceClassAssignments.IdentifierHint',
              )}
            ></i>
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each context.assignments as assignment (assignment.item.id)}
          {@const sourceClassIsUnassigned =
            (assignment.item.system.sourceClass?.trim() ?? '') === ''}
          {@const hideRow =
            !visibleSelectablesIdSubset.has(assignment.item.id) ||
            (showUnassignedOnly && !sourceClassIsUnassigned)}
          <TidyTableRow hidden={hideRow}>
            <TidyTableCell primary={true} class="p-1 semibold">
              <a
                class="flex-1 highlight-on-hover"
                onclick={async () =>
                  FoundryAdapter.renderSheetFromUuid(assignment.item.uuid)}
              >
                {assignment.item.name}
                </a>
            </TidyTableCell>
            {#each classColumns as classColumn}
              {@const selected =
                assignment.item.system.sourceClass === classColumn.key}
              <TidyTableHeaderCell>
                <TidySwitch
                  checked={selected}
                  onChange={(ev) =>
                    setItemSourceClass(
                      assignment.item,
                      ev.currentTarget.checked ? classColumn.key : '',
                    )}
                />
              </TidyTableHeaderCell>
            {/each}
            <TidyTableCell>
              <TextInput
                document={assignment.item}
                disabled={!assignment.item.isOwner}
                field="system.sourceClass"
                selectOnFocus={true}
                value={assignment.item.system.sourceClass}
              />
            </TidyTableCell>
          </TidyTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  </div>
</section>
