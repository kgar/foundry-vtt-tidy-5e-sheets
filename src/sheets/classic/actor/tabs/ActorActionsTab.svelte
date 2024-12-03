<script lang="ts">
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext, setContext } from 'svelte';
  import { writable, type Readable } from 'svelte/store';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import { Actions } from 'src/features/actions/actions';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import InlineContainerView from 'src/sheets/classic/container/InlineContainerView.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  $: actions = SheetSections.configureActions(
    $context.actions,
    tabId,
    SheetPreferencesService.getByType($context.actor.type),
    TidyFlags.sectionConfig.get($context.actor)?.[tabId],
  );

  let searchCriteria: string = '';

  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext(CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW, itemIdsToShow);

  $: {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: actions,
      tabId: tabId,
    });
  }

  $: utilityBarCommands =
    $context.utilities[tabId]?.utilityToolbarCommands ?? [];

  const localize = FoundryAdapter.localize;

  declareLocation('actions');

  const damageHealingTypeIconMap = Actions.damageAndHealingTypesIconSrcMap;
</script>

<UtilityToolbar class="abilities-toolbar">
  <Search bind:value={searchCriteria} />
  <PinnedFilterToggles
    filterGroupName={tabId}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      $context.filterPins,
      $context.filterData,
      tabId,
    )}
  />
  <FilterMenu {tabId} />
  {#each utilityBarCommands as command (command.title)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      on:execute={(ev) => command.execute?.(ev.detail)}
    />
  {/each}
</UtilityToolbar>

<div class="actions-tab-container scroll-container flex-column small-gap">
  {#each actions as section (section.key)}
    {@const visibleItemCount = ItemVisibility.countVisibleItems(
      section.actions.map((a) => a.item),
      $itemIdsToShow,
    )}
    {#if visibleItemCount > 0 && section.show}
      <ItemTable key={section.key}>
        <svelte:fragment slot="header">
          <ItemTableHeaderRow>
            <ItemTableColumn primary={true}>
              {section.label}
            </ItemTableColumn>
            <ItemTableColumn baseWidth="6.25rem"
              >{localize('DND5E.Range')}</ItemTableColumn
            >
            <ItemTableColumn baseWidth="5rem"
              >{localize('TIDY5E.HitDC')}</ItemTableColumn
            >
            <ItemTableColumn baseWidth="7.5rem"
              >{localize('DND5E.Damage')}</ItemTableColumn
            >
            {#if $context.editable && $context.useClassicControls}
              <ItemTableColumn baseWidth="1.5rem"></ItemTableColumn>
            {/if}
          </ItemTableHeaderRow>
        </svelte:fragment>
        <svelte:fragment slot="body">
          {#each section.actions as actionItem (actionItem.item.id)}
            <ItemTableRow
              item={actionItem.item}
              on:mousedown={(event) =>
                FoundryAdapter.editOnMiddleClick(event.detail, actionItem.item)}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                uuid: actionItem.item.uuid,
              }}
              hidden={!!$itemIdsToShow &&
                !$itemIdsToShow.has(actionItem.item.id)}
              let:toggleSummary
            >
              <ItemTableCell primary={true}>
                <ItemUseButton
                  disabled={!$context.editable}
                  item={actionItem.item}
                />
                {#if 'containerContents' in actionItem && !!actionItem.containerContents}
                  <InlineToggleControl
                    iconClass="fa-lg"
                    entityId={actionItem.item.id}
                    {inlineToggleService}
                  />
                {/if}
                <ItemName
                  item={actionItem.item}
                  on:toggle={() => toggleSummary($context.actor)}
                  useActiveEffectsMarker={false}
                >
                  {@const sourceClassText =
                    $context.actor.spellcastingClasses?.[
                      actionItem.item.system.sourceClass
                    ]?.name ?? ''}
                  <div class="flex-1 min-width-0">
                    <div
                      data-tidy-item-name={actionItem.item.name}
                      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                      class="truncate"
                      title={actionItem.item.name}
                    >
                      {actionItem.item.name}
                    </div>
                    <small>
                      {#if actionItem.item.type !== CONSTANTS.ITEM_TYPE_SPELL}
                        {actionItem.typeLabel}
                      {:else if actionItem.item.system.level !== 0}
                        {actionItem.item.labels?.level ?? ''}
                        {actionItem.item.labels?.school ?? ''}
                        {#if sourceClassText}
                          • {localize(sourceClassText)}
                        {/if}
                      {:else}
                        {actionItem.item.labels?.school ?? ''}
                        {actionItem.item.labels?.level ?? ''}
                        {#if sourceClassText}
                          • {localize(sourceClassText)}
                        {/if}
                      {/if}
                    </small>
                  </div>
                </ItemName>
                {#if actionItem.item.hasRecharge || actionItem.item.hasLimitedUses || ItemUtils.hasSpecificActivationType(actionItem.item, CONSTANTS.ACTIVATION_COST_LEGENDARY)}
                  <div class="item-uses" title={localize('DND5E.Uses')}>
                    {#if actionItem.item.hasRecharge && !actionItem.item.isOnCooldown}
                      <i
                        class="fas fa-bolt"
                        title={localize('DND5E.Charged')}
                      />
                    {:else if actionItem.item.isOnCooldown}
                      <RechargeControl item={actionItem.item} />
                    {:else if actionItem.item.hasLimitedUses}
                      {#if actionItem.item.system.uses?.value === actionItem.item.system.uses?.max && actionItem.item.system.uses?.autoDestroy}
                        <div title={actionItem.item.system.quantity}>
                          {actionItem.item.system.quantity ?? 0}
                        </div>
                        <small>{localize('DND5E.Quantity')}</small>
                      {:else}
                        <div>
                          {actionItem.item.system.uses.value ?? 0} / {actionItem
                            .item.system.uses.max ?? 0}
                        </div>
                        <small>{localize('DND5E.Uses')}</small>
                      {/if}
                    {/if}
                    {#if ItemUtils.hasSpecificActivationType(actionItem.item, CONSTANTS.ACTIVATION_COST_LEGENDARY)}
                      {actionItem.item.system.activation.cost}
                    {/if}
                  </div>
                {/if}
              </ItemTableCell>
              <ItemTableCell
                baseWidth="6.25rem"
                cssClass="truncate flex-column no-gap"
              >
                <!-- Range -->
                {#if actionItem.rangeTitle !== null}
                  <div
                    title={actionItem.rangeTitle}
                    class="flex-column-truncate"
                  >
                    {actionItem.rangeTitle ?? ''}
                  </div>
                {/if}
                {#if actionItem.rangeSubtitle !== null}
                  <small
                    title={actionItem.rangeSubtitle}
                    class="flex-column-truncate"
                  >
                    {actionItem.rangeSubtitle ?? ''}
                  </small>
                {/if}
              </ItemTableCell>
              <ItemTableCell baseWidth="5rem" cssClass="flex-column no-gap">
                <!-- HIT / DC -->
                {#if actionItem.item.labels?.save || actionItem.item.labels?.toHit}
                  {#if actionItem.item.labels?.save !== '' && actionItem.item.labels?.save !== undefined}
                    {@const saveAbilityLabel =
                      FoundryAdapter.lookupAbility(
                        actionItem.item.system.save.ability,
                      )?.label ?? ''}
                    <span
                      title={actionItem.item.labels?.save ?? ''}
                      class="flex-column-truncate"
                    >
                      {localize('DND5E.AbbreviationDC')}
                      {actionItem.item.system.save.dc ?? ''}
                    </span>
                    <small title={saveAbilityLabel} class="flex-column-truncate"
                      >{saveAbilityLabel}</small
                    >
                  {:else}
                    <span title={actionItem.item.labels?.toHit ?? ''}
                      >{actionItem.item.labels?.toHit ?? ''}</span
                    >
                  {/if}
                {/if}
              </ItemTableCell>
              <ItemTableCell
                baseWidth="7.5rem"
                cssClass="flex-wrap flex-row small-gap extra-small-row-gap"
              >
                <!-- Damage -->
                {#each actionItem.calculatedDerivedDamage ?? [] as entry, i}
                  {@const iconSrc = damageHealingTypeIconMap[entry.damageType]}
                  <div
                    title={entry.label ??
                      entry.formula + entry.damageHealingTypeLabel}
                    class="truncate flex-row align-items-flex-end extra-small-gap"
                  >
                    <span>{entry.formula}</span>
                    {#if iconSrc}
                      <Dnd5eIcon src={iconSrc} />
                    {/if}
                  </div>
                {/each}
              </ItemTableCell>
              {#if $context.editable && $context.useClassicControls}
                <ItemTableCell baseWidth="1.5rem">
                  <ActionFilterOverrideControl item={actionItem.item} />
                </ItemTableCell>
              {/if}
            </ItemTableRow>
            {#if 'containerContents' in actionItem && !!actionItem.containerContents}
              <InlineContainerView
                container={actionItem.item}
                containerContents={actionItem.containerContents}
                editable={$context.editable}
                {inlineToggleService}
                lockItemQuantity={$context.lockItemQuantity}
                sheetDocument={$context.actor}
                --t5e-image-size-override="1.5rem"
                unlocked={$context.unlocked}
              />
            {/if}
          {/each}
        </svelte:fragment>
      </ItemTable>
    {/if}
  {/each}
</div>

<style lang="scss">
  .actions-tab-container {
    --t5e-image-size-override: 2rem;
    --icon-fill: var(--t5e-secondary-color);
    --icon-width: 1rem;
    --icon-height: 1rem;

    :global(.item-table-row) {
      min-height: 2rem;
    }
  }

  .flex-column-truncate {
    text-align: center;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-uses {
    align-self: center;
    text-align: center;
    flex-basis: 4.25rem;
  }

  small {
    color: var(--t5e-tertiary-color);
  }
</style>
