<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import { VehicleMemberColumnRuntime } from 'src/runtime/tables/VehicleCrewMemberColumnRuntime';
  import type {
    VehicleItemContext,
    VehicleItemCrewAssignment,
  } from 'src/types/types';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import VehicleItemCrewAssignments from '../vehicle-parts/VehicleItemCrewAssignments.svelte';

  const localize = FoundryAdapter.localize;

  let context = $derived(getVehicleSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  // const searchResults = createSearchResultsState();
  // setSearchResultsContext(searchResults);

  // TODO: set up action bar so we can configure pins
  let tabOptionGroups: SectionOptionGroup[] = $derived([
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(context.document.type, tabId),
      ],
    },
  ]);

  let showSheetPins = $derived(
    UserSheetPreferencesService.getDocumentTypeTabPreference(
      context.document.type,
      tabId,
      'showSheetPins',
    ) ?? true,
  );

  let sections = $derived(
    SheetSections.configureVehicleStatblockSections(
      context.statblock,
      tabId,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);

    return () => {
      observer.disconnect();
    };
  });

  let totalItemCount = $derived(
    sections.reduce((count, s) => {
      const documentCount =
        s.type === 'inventory'
          ? s.items.length
          : s.type === 'draft'
            ? s.members.length
            : 0;

      return count + documentCount;
    }, 0),
  );

  // Vehicle Actions calculations (when stations are OFF)
  let showActionsPin = $derived(
    !context.system.attributes.actions.stations, //&& (context.system.attributes.actions.value ?? 0) > 0,
  );

  let totalCrew = $derived(
    context.crew.assigned.members.reduce((sum, m) => sum + m.quantity, 0) +
      context.crew.unassigned.members.reduce((sum, m) => sum + m.quantity, 0),
  );

  let totalActions = $derived(context.system.attributes.actions.value ?? 0);
  let thresholds = $derived(context.system.attributes.actions.thresholds);

  let actionsPerTurn = $derived(
    totalCrew >= (thresholds?.['2'] ?? 0)
      ? totalActions
      : totalCrew >= (thresholds?.['1'] ?? 0)
        ? Math.max(totalActions - 1, 0)
        : totalCrew >= (thresholds?.['0'] ?? 0)
          ? Math.max(totalActions - 2, 0)
          : 0,
  );

  let crewTallyDescription = $derived(
    actionsPerTurn === totalActions
      ? localize(
          'DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.full.label',
        )
      : actionsPerTurn === totalActions - 1
        ? localize(
            'DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.mid.label',
          )
        : actionsPerTurn === totalActions - 2
          ? localize(
              'DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.min.label',
            )
          : localize(
              'DND5E.VEHICLE.FIELDS.attributes.actions.thresholds.min.label',
            ),
  );

  // Track used actions (resets each session/refresh as these are per-turn resources)
  let usedActions = $state(0);

  let availableActions = $derived(actionsPerTurn - usedActions);

  function decrementActions() {
    if (!context.editable || availableActions <= 0) return;
    usedActions = Math.min(actionsPerTurn, usedActions + 1);
  }

  function incrementActions() {
    if (!context.editable || usedActions <= 0) return;
    usedActions = Math.max(0, usedActions - 1);
  }
</script>

<!-- <ItemsActionBar
  bind:searchCriteria
  sections={features}
  {tabId}
  {tabOptionGroups}
/> -->

{#if showSheetPins}
  <SheetPins />
{/if}

<!-- Vehicle Actions Tracker (when stations are OFF) -->
{#if showActionsPin}
  <div class="cards-container">
    <div
      class={[
        'npc-score-tracker card vehicle-actions-tracker',
        { 'tracker-warning': actionsPerTurn === 0 && totalActions > 0 },
      ]}
      data-tooltip={crewTallyDescription}
    >
      <div class="card-header flexrow">
        <h3>
          {localize('DND5E.ActionPl')}
        </h3>
      </div>
      <div class="card-content flexrow">
        <button
          type="button"
          class="button button-icon-only button-borderless flexshrink"
          disabled={availableActions <= 0 || !context.editable}
          onclick={decrementActions}
          aria-label={localize('DND5E.Subtract', { value: 1 })}
        >
          <i class="fa-solid fa-hexagon-minus"></i>
        </button>
        <span class="uses flexrow flexshrink">
          <span
            class={[
              'value',
              'color-text-default',
              'font-label-large',
              {
                'color-text-warning': actionsPerTurn === 0 && totalActions > 0,
              },
            ]}
          >
            {availableActions}
          </span>
          <span class="separator color-text-lightest flexshrink">/</span>
          <span class="max color-text-default font-label-large">
            {actionsPerTurn}
          </span>
        </span>
        <button
          type="button"
          class="button button-icon-only button-borderless flexshrink"
          disabled={usedActions <= 0 || !context.editable}
          onclick={incrementActions}
          aria-label={localize('DND5E.Add', { value: 1 })}
        >
          <i class="fa-solid fa-hexagon-plus"></i>
        </button>
      </div>
    </div>
  </div>
{/if}

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#each sections as section (section.key)}
    {#if section.type === 'inventory'}
      {#if section.show}
        {@const columns = new ColumnsLoadout(
          ItemColumnRuntime.getConfiguredColumnSpecifications({
            sheetType: context.document.type,
            tabId: tabId,
            sectionKey: section.key,
            rowActions: section.rowActions,
            section: section,
            sheetDocument: context.document,
          }),
        )}
        {@const hiddenColumns = ItemColumnRuntime.determineHiddenColumns(
          sectionsInlineWidth,
          columns,
        )}
        <TidyTable
          key={section.key}
          data-custom-section={section.custom ? true : null}
        >
          {#snippet header(expanded)}
            <TidyTableHeaderRow class="theme-dark">
              <TidyTableHeaderCell primary={true} class="header-label-cell">
                <h3>
                  {localize(section.label)}
                </h3>
                <span class="table-header-count">{section.items.length}</span>
              </TidyTableHeaderCell>
              {#each columns.ordered as column}
                {@const hidden = hiddenColumns.has(column.key)}

                <TidyTableHeaderCell
                  class={[column.headerClasses, { hidden }]}
                  columnWidth="{column.widthRems}rem"
                  data-tidy-column-key={column.key}
                >
                  {#if !!column.headerContent}
                    {#if column.headerContent.type === 'callback'}
                      {@html column.headerContent.callback?.(
                        context.document,
                        context,
                      )}
                    {:else if column.headerContent.type === 'component'}
                      <column.headerContent.component
                        sheetContext={context}
                        sheetDocument={context.document}
                        {section}
                      />
                    {:else if column.headerContent.type === 'html'}
                      {@html column.headerContent.html}
                    {/if}
                  {/if}
                </TidyTableHeaderCell>
              {/each}
            </TidyTableHeaderRow>
          {/snippet}

          {#snippet body()}
            {#if section.key === 'equipment' && section.items.length === 0}
              <div class="inventory-empty empty-state-container">
                <button
                  type="button"
                  class="button button-tertiary"
                  title={localize('TIDY5E.Vehicle.Equipment.EmptyState')}
                  aria-label={localize('TIDY5E.Vehicle.Equipment.EmptyState')}
                  onclick={() =>
                    context.document.sheet._addDocument({
                      tabId,
                    })}
                >
                  <i class="fas fa-plus"></i>
                  {localize('TIDY5E.Vehicle.Equipment.EmptyState')}
                </button>
              </div>
            {:else}
              {@const itemEntries = section.items.map((item) => ({
                item,
                ctx: context.itemContext[item.id] as VehicleItemContext,
              }))}
              {#each itemEntries as { item, ctx }, i (item.id)}
                <TidyItemTableRow
                  {item}
                  contextMenu={{
                    type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                    uuid: item.uuid,
                  }}
                >
                  {#snippet children({ toggleSummary, expanded })}
                    <div class="highlight"></div>
                    <a
                      class={[
                        'tidy-table-row-use-button',
                        { disabled: !context.editable },
                      ]}
                      onclick={(ev) =>
                        context.editable &&
                        FoundryAdapter.actorTryUseItem(item, ev)}
                      data-has-roll-modes
                    >
                      <img class="item-image" alt={item.name} src={item.img} />
                      <span class="roll-prompt">
                        <i class="fa fa-dice-d20"></i>
                      </span>
                    </a>

                    <TidyTableCell primary={true} class="item-label text-cell">
                      <a
                        class="item-name"
                        role="button"
                        data-keyboard-focus
                        tabindex="0"
                        onclick={(ev) => toggleSummary()}
                      >
                        <span class="cell-text">
                          <span class="cell-name">{item.name}</span>
                        </span>
                        <span class="row-detail-expand-indicator">
                          <i
                            class="fa-solid fa-angle-right expand-indicator"
                            class:expanded
                          >
                          </i>
                        </span>
                      </a>
                    </TidyTableCell>
                    {#each columns.ordered as column}
                      {@const hidden = hiddenColumns.has(column.key)}

                      <TidyTableCell
                        columnWidth="{column.widthRems}rem"
                        class={[column.cellClasses, { hidden }]}
                        attributes={{ ['data-tidy-column-key']: column.key }}
                      >
                        {#if column.cellContent.type === 'callback'}
                          {@html column.cellContent.callback?.(
                            context.document,
                            context,
                          )}
                        {:else if column.cellContent.type === 'component'}
                          <column.cellContent.component
                            rowContext={ctx}
                            rowDocument={item}
                            {section}
                          />
                        {/if}
                      </TidyTableCell>
                    {/each}
                  {/snippet}

                  {#snippet afterInlineActivities(item)}
                    {#if ctx.crew?.length}
                      <VehicleItemCrewAssignments {ctx} {item} />
                    {/if}
                  {/snippet}
                </TidyItemTableRow>
              {/each}
            {/if}
          {/snippet}
        </TidyTable>
      {/if}
    {:else if section.type === 'draft'}
      {@const columns = new ColumnsLoadout(
        VehicleMemberColumnRuntime.getConfiguredColumnSpecifications({
          sheetType: context.document.type,
          tabId: tabId,
          sectionKey: section.key,
          rowActions: section.rowActions,
          section: section,
          sheetDocument: context.document,
        }),
      )}
      {@const hiddenColumns = ItemColumnRuntime.determineHiddenColumns(
        sectionsInlineWidth,
        columns,
      )}
      <TidyTable
        key={section.key}
        data-custom-section={section.custom ? true : null}
      >
        {#snippet header(expanded)}
          <TidyTableHeaderRow class="theme-dark">
            <TidyTableHeaderCell primary={true} class="header-label-cell">
              <h3>
                {localize(section.label)}
              </h3>
              <span class="table-header-count">{section.members.length}</span>
            </TidyTableHeaderCell>
            {#each columns.ordered as column}
              {@const hidden = hiddenColumns.has(column.key)}

              <TidyTableHeaderCell
                class={[column.headerClasses, { hidden }]}
                columnWidth="{column.widthRems}rem"
                data-tidy-column-key={column.key}
              >
                {#if !!column.headerContent}
                  {#if column.headerContent.type === 'callback'}
                    {@html column.headerContent.callback?.(
                      context.document,
                      context,
                    )}
                  {:else if column.headerContent.type === 'component'}
                    <column.headerContent.component
                      sheetContext={context}
                      sheetDocument={context.document}
                      {section}
                    />
                  {:else if column.headerContent.type === 'html'}
                    {@html column.headerContent.html}
                  {/if}
                {/if}
              </TidyTableHeaderCell>
            {/each}
          </TidyTableHeaderRow>
        {/snippet}

        {#snippet body()}
          {#each section.members as member}
            <TidyTableRow
              rowContainerAttributes={{
                ['data-context-menu']:
                  CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER,
                ['data-uuid']: member.actor.uuid,
              }}
            >
              {#snippet children()}
                <div class="highlight"></div>
                <a
                  class={[
                    'tidy-table-row-use-button',
                    { disabled: !context.editable },
                  ]}
                >
                  <img
                    class="item-image"
                    alt={member.actor.name}
                    src={member.actor.img}
                  />
                  <span class="roll-prompt">
                    <i class="fa fa-dice-d20"></i>
                  </span>
                </a>

                <TidyTableCell primary={true} class="item-label text-cell">
                  <a
                    class="item-name"
                    role="button"
                    data-keyboard-focus
                    tabindex="0"
                  >
                    <span class="cell-text">
                      <span class="cell-name">{member.actor.name}</span>
                    </span>
                  </a>
                </TidyTableCell>

                {#each columns.ordered as column}
                  {@const hidden = hiddenColumns.has(column.key)}

                  <TidyTableCell
                    columnWidth="{column.widthRems}rem"
                    class={[column.cellClasses, { hidden }]}
                    attributes={{ ['data-tidy-column-key']: column.key }}
                  >
                    {#if column.cellContent.type === 'callback'}
                      {@html column.cellContent.callback?.(
                        context.document,
                        context,
                      )}
                    {:else if column.cellContent.type === 'component'}
                      <column.cellContent.component
                        rowContext={member}
                        rowDocument={member.actor}
                        {section}
                      />
                    {/if}
                  </TidyTableCell>
                {/each}
              {/snippet}
            </TidyTableRow>
          {:else}
            <div class="inventory-empty empty-state-container">
              <button
                type="button"
                class="button button-tertiary"
                aria-label={localize('TIDY5E.Vehicle.DraftAnimal.EmptyState')}
                data-action="browseActors"
              >
                <i class="fas fa-plus"></i>
                {localize('TIDY5E.Vehicle.DraftAnimal.EmptyState')}
              </button>
            </div>
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/each}
</div>
