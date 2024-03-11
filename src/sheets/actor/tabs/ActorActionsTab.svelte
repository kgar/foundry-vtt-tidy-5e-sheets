<script lang="ts">
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
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

  let context = getContext<Readable<ActorSheetContext>>('context');

  let searchCriteria: string = '';
  $: utilityBarCommands =
    $context.utilities[CONSTANTS.TAB_ACTOR_ACTIONS]?.utilityToolbarCommands ??
    [];

  const localize = FoundryAdapter.localize;

  declareLocation('actions');

  const damageHealingTypeIconMap = Actions.damageAndHealingTypesIconSrcMap;
</script>

<UtilityToolbar class="abilities-toolbar">
  <Search bind:value={searchCriteria} />
  <FilterMenu tabId={CONSTANTS.TAB_ACTOR_ACTIONS} />
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
  {#each Object.entries($context.actions) as [actionType, itemSet] (actionType)}
    {#if itemSet.size}
      <ItemTable location={actionType}>
        <svelte:fragment slot="header">
          <ItemTableHeaderRow>
            <ItemTableColumn primary={true}>
              {FoundryAdapter.getActivationTypeLabel(actionType)}
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
          {@const filteredActionItems = FoundryAdapter.getFilteredActionItems(
            searchCriteria,
            itemSet,
          )}
          {#each filteredActionItems as actionItem (actionItem.item.id)}
            <ItemTableRow
              item={actionItem.item}
              on:mousedown={(event) =>
                FoundryAdapter.editOnMiddleClick(event.detail, actionItem.item)}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                uuid: actionItem.item.uuid,
              }}
              let:toggleSummary
            >
              <ItemTableCell primary={true}>
                <ItemUseButton
                  disabled={!$context.editable}
                  item={actionItem.item}
                />
                <ItemName
                  item={actionItem.item}
                  on:toggle={() => toggleSummary($context.actor)}
                  useActiveEffectsMarker={false}
                >
                  {@const spellClass = FoundryAdapter.getClassLabel(
                    FoundryAdapter.tryGetFlag(actionItem.item, 'parentClass') ??
                      '',
                  )}
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
                      {:else if actionItem.item.type === 'spell' && actionItem.item.system.level !== 0}
                        {actionItem.item.labels?.level ?? ''}
                        {actionItem.item.labels?.school ?? ''}
                        {#if spellClass}
                          • {localize(spellClass)}
                        {/if}
                      {:else}
                        {actionItem.item.labels?.school ?? ''}
                        {actionItem.item.labels?.level ?? ''}
                        {#if spellClass}
                          • {localize(spellClass)}
                        {/if}
                      {/if}
                    </small>
                  </div>
                </ItemName>
                {#if actionItem.item.system.recharge?.value || actionItem.item.hasLimitedUses || actionItem.item.system.activation?.type === 'legendary'}
                  <div class="item-uses" title={localize('DND5E.Uses')}>
                    {#if actionItem.item.system.recharge?.charged && actionItem.item.system.recharge?.value}
                      <i
                        class="fas fa-bolt"
                        title={localize('DND5E.Charged')}
                      />
                    {:else if actionItem.item.system.recharge?.value}
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
                    {#if actionItem.item.system.activation.type === 'legendary'}
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
          {/each}
        </svelte:fragment>
      </ItemTable>
    {/if}
  {/each}
</div>

<style lang="scss">
  .actions-tab-container {
    --t5e-image-size-override: 2rem;

    :global(.item-table-row) {
      min-height: 2rem;
    }

    --icon-fill: var(--t5e-secondary-color);
    --icon-width: 1rem;
    --icon-height: 1rem;
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
