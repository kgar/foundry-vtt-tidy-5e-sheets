<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TableRowActionsRuntime from 'src/runtime/table-row-actions/TableRowActionsRuntime.svelte';
  import { CONSTANTS } from 'src/constants';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import EncounterMemberNameCell from '../encounter-parts/EncounterMemberNameColumn.svelte';
  import { EncounterMemberColumnRuntime } from 'src/runtime/table-columns/EncounterMemberColumnRuntime.svelte';
  import EncounterPlaceholderNameColumn from '../encounter-parts/EncounterPlaceholderNameColumn.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TableRowActions from '../../../../components/table-quadrone/parts/TableRowActions.svelte';
  import MemberActionsColumnHeader from '../../item/columns/MemberActionsColumnHeader.svelte';
  import {
    type EncounterCombatantMemberRowActionPropsData,
    type ActorRowActionPropsData,
  } from 'src/types/types';

  let context = $derived(getEncounterSheetQuadroneContext());
  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  const localize = FoundryAdapter.localize;

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }
</script>

<aside class="sidebar expanded flexcol">
  <button
    type="button"
    class="button button-primary button-preroll-initiative"
    onclick={(ev) => context.sheet.prerollAllInitiatives(ev)}
    data-has-roll-modes
  >
    <i class="fas fa-dice-d20"></i>
    {localize('TIDY5E.Encounter.PrerollInitiative')}
  </button>
  <button
    type="button"
    class="button button-add-all-placeholders"
    onclick={(ev) => context.sheet.addAllAsPlaceholders()}
  >
    <i class="fas fa-circle-dashed"></i>
    {localize('TIDY5E.Encounter.AddAllPlaceholders.Label')}
  </button>
  <hr />
  <button
    type="button"
    class="button button-add-placeholder"
    onclick={(ev) => context.sheet.addNewPlaceholder()}
  >
    <i class="fas fa-circle-dashed"></i>
    {localize('TIDY5E.Encounter.AddPlaceholder.Label')}
  </button>
  <button
    type="button"
    class="button button-add-lair"
    onclick={(ev) =>
      context.sheet.addNewPlaceholder(
        {
          name: localize('DND5E.LAIR.Action.Label'),
        },
        { initiative: 20 },
      )}
  >
    <i class="fas fa-eye-evil"></i>
    {localize('DND5E.LAIR.Action.Label')}
  </button>
  <button
    type="button"
    class="button button-add-init-20"
    onclick={(ev) =>
      context.sheet.addNewPlaceholder(
        {
          name: localize('TIDY5E.Encounter.InitiativeCount.Label', {
            count: 20,
          }),
        },
        { initiative: 20 },
      )}
  >
    <i class="fas fa-circle-dashed"></i>
    {localize('TIDY5E.Encounter.InitiativeCount.Label', { count: 20 })}
  </button>
  <button
    type="button"
    class="button button-add-init-15"
    onclick={(ev) =>
      context.sheet.addNewPlaceholder(
        {
          name: localize('TIDY5E.Encounter.InitiativeCount.Label', {
            count: 15,
          }),
        },
        { initiative: 15 },
      )}
  >
    <i class="fas fa-circle-dashed"></i>
    {localize('TIDY5E.Encounter.InitiativeCount.Label', { count: 15 })}
  </button>
  <button
    type="button"
    class="button button-add-init-10"
    onclick={(ev) =>
      context.sheet.addNewPlaceholder(
        {
          name: localize('TIDY5E.Encounter.InitiativeCount.Label', {
            count: 10,
          }),
        },
        { initiative: 10 },
      )}
  >
    <i class="fas fa-circle-dashed"></i>
    {localize('TIDY5E.Encounter.InitiativeCount.Label', { count: 10 })}
  </button>
</aside>

<div class="tab-right-column">
  <section class="tab-content" {@attach observeResize(onResize)}>
    {#each context.combat as section (section.key)}
      {#if section.show && section.combatants.length}
        {const visibleItemCount = $derived(section.combatants.length)}

        {const rowActionInfo = $derived(
          TableRowActionsRuntime.getRowActionWidthInfo(
            section.combatants,
            (entry) => entry.rowActions,
          ),
        )}

        {const hiddenColumns = $derived(
          EncounterMemberColumnRuntime.determineHiddenColumns(
            sectionsInlineWidth - rowActionInfo.widthPx,
            section.columns,
          ),
        )}

        <TidyTable key={section.key}>
          {#snippet header()}
            <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
              <TidyTableHeaderCell primary={true}>
                <h3>
                  {localize(section.label)}
                  <span class="table-header-count">{visibleItemCount}</span>
                </h3>
              </TidyTableHeaderCell>

              <TidyTableCustomHeaderCells {context} {hiddenColumns} {section} />

              <TidyTableHeaderCell
                class="header-cell-actions"
                columnWidth="{rowActionInfo.widthRems}rem"
                data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
              >
                <MemberActionsColumnHeader
                  {section}
                  sheetDocument={context.document}
                  sheetContext={context}
                />
              </TidyTableHeaderCell>
            </TidyTableHeaderRow>
          {/snippet}
          {#snippet body()}
            {#each section.combatants as combatant}
              {const member = $derived(
                combatant.type === 'member' ? combatant : null,
              )}
              {const placeholder = $derived(
                combatant.type === 'placeholder' ? combatant : null,
              )}
              <div
                class={[
                  'tidy-table-row group-member',
                  { 'include-in-combat': !combatant.includeInCombat },
                ]}
                style:--t5e-theme-color-default={member?.accentColor}
                style:--t5e-theme-color-highlight={member?.highlightColor}
                style:--t5e-member-color-hover={member?.highlightColor}
                data-combatant-type={combatant.type}
                data-member-uuid={member?.actor.uuid}
                data-placeholder-id={placeholder?.id}
                data-context-menu={!!member
                  ? CONSTANTS.CONTEXT_MENU_TYPE_ENCOUNTER_MEMBER
                  : CONSTANTS.CONTEXT_MENU_TYPE_ENCOUNTER_PLACEHOLDER}
              >
                {#if combatant.type === 'placeholder'}
                  <EncounterPlaceholderNameColumn placeholder={combatant} />
                {:else if member}
                  <EncounterMemberNameCell {member} />
                {/if}

                <TidyTableCustomCells
                  {context}
                  ctx={combatant}
                  {section}
                  entry={member?.actor}
                  {hiddenColumns}
                />

                <TidyTableCell
                  columnWidth="{rowActionInfo.widthRems}rem"
                  class="tidy-table-actions"
                  attributes={{
                    ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
                  }}
                >
                  {#if combatant.type === 'placeholder'}
                    {const data =
                      $derived<EncounterCombatantMemberRowActionPropsData>(
                        combatant,
                      )}
                    <TableRowActions rowActions={combatant.rowActions} {data} />
                  {:else}
                    {const data = $derived<ActorRowActionPropsData>(combatant)}
                    <TableRowActions rowActions={combatant.rowActions} {data} />
                  {/if}
                </TidyTableCell>
              </div>
            {/each}
          {/snippet}
        </TidyTable>
      {/if}
    {/each}
  </section>
</div>
