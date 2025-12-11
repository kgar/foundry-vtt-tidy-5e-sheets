<script lang="ts">
  import type { SpellSourceClassAssignmentsContext } from './SpellSourceClassAssignmentsFormApplication.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import Search from 'src/components/utility-bar/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';
    import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

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

  async function setItemSourceClass(item: Item5e, sourceClass: string) {
    await item.update({
      'system.sourceClass': sourceClass,
    });
  }

  const localize = FoundryAdapter.localize;

  var showUnassignedOnly = $state(false);
</script>

<section class="flexcol flexgap-3 full-height">
  <div role="presentation" class="flexrow flexgap-3">
    <Search bind:value={searchCriteria} />
    <label class="flexshrink checkbox">
      <input type="checkbox" bind:checked={showUnassignedOnly} />
      {localize('TIDY5E.SpellSourceClassAssignments.ShowUnassignedOnly.Text')}
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
          {#each classColumns as classColumn}
            <TidyTableHeaderCell
              columnWidth="8rem"
              data-tooltip={classColumn.item.name}
            >
              <span class="truncate">
                {classColumn.item.name}
              </span>
            </TidyTableHeaderCell>
          {/each}
          <TidyTableHeaderCell columnWidth="12.5rem" class="flexgap-1">
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
            <TidyTableCell primary={true} class="flexrow">
              <a
                class="button button-borderless"
                style="justify-content: flex-start;"
                onclick={async () =>
                  FoundryAdapter.renderSheetFromUuid(assignment.item.uuid)}
              >
                {assignment.item.name}
              </a>
            </TidyTableCell>
            {#each classColumns as classColumn}
              {@const selected =
                assignment.item.system.sourceClass === classColumn.key}
              <TidyTableCell columnWidth="8rem">
                <FieldToggle
                  checked={selected}
                  onchange={(ev) =>
                    setItemSourceClass(
                      assignment.item,
                      ev.currentTarget.checked ? classColumn.key : '',
                    )}
                />
              </TidyTableCell>
            {/each}
            <TidyTableCell columnWidth="12.5rem">
              <TextInputQuadrone
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
