<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext, untrack } from 'svelte';
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
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import { VehicleMemberColumnRuntime } from 'src/runtime/tables/VehicleCrewMemberColumnRuntime';
  import VehicleItemCrewAssignments from '../vehicle-parts/VehicleItemCrewAssignments.svelte';
  import TidyItemTable from 'src/components/table-quadrone/TidyItemTable.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import ItemsActionBar from '../../shared/ItemsActionBar.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { observeResize } from 'src/features/resize-observation/attachments';

  const localize = FoundryAdapter.localize;

  let context = $derived(getVehicleSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  const loweredSearchCriteria = $derived(
    searchCriteria.toLocaleLowerCase().trim(),
  );

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const itemToggleMap = $derived(inlineToggleService.map);

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  $effect(() => {
    context;
    searchCriteria;

    untrack(() => {
      searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
        criteria: searchCriteria,
        itemContext: context.itemContext,
        sections: sections.filter(
          (s) => s.type === CONSTANTS.SECTION_TYPE_INVENTORY,
        ),
        tabId,
      });

      const draftAnimalSections = sections.filter(
        (s) => s.type === CONSTANTS.SECTION_TYPE_DRAFT_ANIMALS,
      );

      for (const section of draftAnimalSections) {
        for (const member of section.members) {
          if (
            member.actor.name
              .toLocaleLowerCase()
              .includes(loweredSearchCriteria)
          ) {
            searchResults.uuids.add(member.actor.uuid);
          }
        }
      }
    });
  });

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

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

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

  // Count sections that have content
  let sectionsWithContent = $derived(
    sections.filter((s) => {
      return s.type === 'inventory'
        ? s.items.length > 0
        : s.type === 'draft'
          ? s.members.length > 0
          : false;
    }).length,
  );

  // Hide empty states when 2+ sections have content and sheet is locked
  let hideEmptyStates = $derived(sectionsWithContent >= 2 && !context.unlocked);

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

  function resetActions() {
    if (!context.editable) return;
    usedActions = 0;
  }
</script>

<ItemsActionBar bind:searchCriteria {sections} {tabId} {tabOptionGroups} />

<div class="tab-content">
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
                  'color-text-warning':
                    actionsPerTurn === 0 && totalActions > 0,
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
        {#if context.unlocked}
          <button
            type="button"
            class="button button-icon-only button-borderless flexshrink button-reset-actions"
            disabled={usedActions <= 0 || !context.editable}
            onclick={resetActions}
            aria-label={localize('TIDY5E.Reset')}
            data-tooltip={localize('TIDY5E.Reset')}
          >
            <i class="fas fa-rotate-right"></i>
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <div class="tidy-table-container" {@attach observeResize(onResize)}>
    {#each sections as section (section.key)}
      {#if section.type === 'inventory'}
        <!-- 
            Only hide empty tables at the component rendering level, so that 
            the derived hidden state doesn't propagate to the section config window. 
          -->
        {@const emptyAndShouldHide =
          section.key === CONSTANTS.ITEM_TYPE_SPELL &&
          section.items.length === 0}
        {#if section.show && !emptyAndShouldHide}
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

          <TidyItemTable
            {section}
            entries={section.items}
            sheetDocument={context.document}
            entryContext={context.itemContext}
            {sectionsInlineWidth}
            entryToggleMap={itemToggleMap}
            {tabId}
            {columns}
          >
            {#snippet bodyNoEntries()}
              {#if !hideEmptyStates}
                {@const buttonTextKey =
                  section.key === CONSTANTS.ITEM_TYPE_EQUIPMENT
                    ? 'TIDY5E.Vehicle.Equipment.EmptyState'
                    : section.key === CONSTANTS.ITEM_TYPE_FEAT
                      ? 'TIDY5E.Vehicle.Features.EmptyState'
                      : section.key === CONSTANTS.ITEM_TYPE_WEAPON
                        ? 'TIDY5E.Vehicle.Weapons.EmptyState'
                        : null}

                {#if buttonTextKey}
                  <div class="inventory-empty empty-state-container">
                    <button
                      type="button"
                      class="button button-tertiary"
                      onclick={() =>
                        context.document.sheet._addDocument({
                          tabId,
                          data: section.dataset,
                        })}
                    >
                      <i class="fas fa-plus"></i>
                      {localize(buttonTextKey)}
                    </button>
                  </div>
                {/if}
              {/if}
            {/snippet}

            {#snippet afterInlineActivities(item, ctx)}
              {#if ctx.crew?.length}
                <VehicleItemCrewAssignments {ctx} {item} />
              {/if}
            {/snippet}
          </TidyItemTable>
        {/if}
      {:else if section.type === 'draft'}
        {#if section.show}
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
                  <span class="table-header-count"
                    >{section.members.length}</span
                  >
                </TidyTableHeaderCell>

                <TidyTableCustomHeaderCells
                  {columns}
                  {context}
                  {hiddenColumns}
                  {section}
                  {expanded}
                />
              </TidyTableHeaderRow>
            {/snippet}

            {#snippet body()}
              {#if section.members.length === 0}
                {#if !hideEmptyStates}
                  <div class="inventory-empty empty-state-container">
                    <button
                      onclick={() =>
                        context.document.sheet.browseAddActor('draft')}
                      type="button"
                      class="button button-tertiary"
                      title={localize('TIDY5E.Vehicle.DraftAnimals.EmptyState')}
                      aria-label={localize(
                        'TIDY5E.Vehicle.DraftAnimals.EmptyState',
                      )}
                    >
                      <i class="fas fa-plus"></i>
                      {localize('TIDY5E.Vehicle.DraftAnimals.EmptyState')}
                    </button>
                  </div>
                {/if}
              {:else}
                {#each section.members as member}
                  {#if !searchResults.uuids || searchResults.uuids.has(member.actor.uuid)}
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

                        <TidyTableCell
                          primary={true}
                          class="item-label text-cell"
                        >
                          <a
                            class="item-name"
                            role="button"
                            data-keyboard-focus
                            tabindex="0"
                            data-action="showDocument"
                            data-uuid={member.actor.uuid}
                          >
                            <span class="cell-text">
                              <span class="cell-name">{member.actor.name}</span>
                              <span class="cell-context">{member.subtitle}</span
                              >
                            </span>
                          </a>
                        </TidyTableCell>

                        <TidyTableCustomCells
                          {columns}
                          {context}
                          ctx={member}
                          entry={member.actor}
                          {hiddenColumns}
                          {section}
                        />
                      {/snippet}
                    </TidyTableRow>
                  {/if}
                {/each}
              {/if}
            {/snippet}
          </TidyTable>
        {/if}
      {/if}
    {/each}
  </div>
</div>
