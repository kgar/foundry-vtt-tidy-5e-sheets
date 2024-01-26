<script lang="ts">
  import { getContext } from 'svelte';
  import Traits from '../../actor/Traits.svelte';
  import VehicleAttributes from '../parts/VehicleAttributes.svelte';
  import type { Readable } from 'svelte/store';
  import type { VehicleSheetContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTable from 'src/components/item-list/ItemTable.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/ItemTableHeaderRow.svelte';
  import ItemTableColumn from 'src/components/item-list/ItemTableColumn.svelte';
  import ItemTableRow from 'src/components/item-list/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/item-list/ItemTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ListItemQuantity from '../../actor/ListItemQuantity.svelte';
  import ItemTableFooter from 'src/components/item-list/ItemTableFooter.svelte';
  import ItemUses from 'src/components/item-list/ItemUses.svelte';
  import ItemAddUses from 'src/components/item-list/ItemAddUses.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemControls from 'src/components/item-list/controls/ItemControls.svelte';
  import ItemDuplicateControl from 'src/components/item-list/controls/ItemDuplicateControl.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import ItemControl from 'src/components/item-list/controls/ItemControl.svelte';
  import Notice from 'src/components/notice/Notice.svelte';
  import HpBar from '../../../components/bar/HpBar.svelte';
  import ResourceWithBar from 'src/components/bar/ResourceWithBar.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  let baseWidths: Record<string, string> = {
    cover: '3.125rem',
    'system.quantity': '4.375rem',
    'system.armor.value': '2.5rem',
    'system.hp.value': '4.375rem',
    threshold: '2.5rem',
  };

  let columnsToSkip = ['system.quantity'];

  let alternateColumnHeaderContent: Record<string, string> = {
    threshold: `<i class="fas fa-heart-crack" title="${localize(
      'DND5E.Threshold',
    )}"></i>`,
  };

  const controlsBaseWidthLocked: string = '5.3125rem';
  const controlsBaseWidthUnlocked: string = '7.5rem';

  $: classicControlsBaseWidth = $context.unlocked
    ? controlsBaseWidthUnlocked
    : controlsBaseWidthLocked;

  $: noFeatures = !$context.features.some(
    (section: any) => section.items.length,
  );
</script>

<div class="attributes-tab-contents" data-tidy-track-scroll-y>
  <div class="side-panel">
    <VehicleAttributes />
    <Traits
      toggleable={true}
      useSenses={false}
      enableSpecialTraitsConfiguration={false}
    />
  </div>
  <div class="main-panel flex-column small-gap">
    {#if noFeatures && !$context.unlocked}
      <Notice>
        {localize('T5EK.EmptySection')}
      </Notice>
    {:else}
      {#each $context.features as section}
        {#if $context.unlocked || section.items.length}
          <ItemTable>
            <ItemTableHeaderRow>
              <ItemTableColumn primary={true}>
                {localize(section.label)}
              </ItemTableColumn>
              {#if section.hasActions}
                <ItemTableColumn baseWidth="3.125rem">
                  {localize('DND5E.Uses')}
                </ItemTableColumn>
                <ItemTableColumn baseWidth="7.5rem">
                  {localize('DND5E.Usage')}
                </ItemTableColumn>
              {/if}
              {#if section.columns}
                {#each section.columns as column}
                  {#if !columnsToSkip.includes(column.property)}
                    <ItemTableColumn
                      cssClass="items-header-{column.css}"
                      baseWidth={baseWidths[column.property] ?? '3.125rem'}
                    >
                      {#if alternateColumnHeaderContent[column.property]}
                        {@html alternateColumnHeaderContent[column.property]}
                      {:else}
                        {column.label}
                      {/if}
                    </ItemTableColumn>
                  {/if}
                {/each}
              {/if}
              {#if $context.editable && $context.useClassicControls}
                <ItemTableColumn baseWidth={classicControlsBaseWidth} />
              {/if}
            </ItemTableHeaderRow>
            {#each section.items as item (item.id)}
              {@const ctx = $context.itemContext[item.id]}
              <ItemTableRow
                let:toggleSummary
                on:mousedown={(event) =>
                  FoundryAdapter.editOnMiddleClick(event.detail, item)}
                contextMenu={{
                  type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                  id: item.id,
                }}
                {item}
                cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
              >
                <ItemTableCell primary={true}>
                  <ItemUseButton disabled={!$context.editable} {item} />
                  <ItemName
                    on:toggle={() => toggleSummary($context.actor)}
                    cssClass="extra-small-gap"
                    {item}
                  >
                    <span
                      class="truncate"
                      data-tidy-item-name={item.name}
                      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                      >{item.name}</span
                    >
                    <ListItemQuantity {item} {ctx} />
                  </ItemName>
                </ItemTableCell>
                {#if section.hasActions}
                  <ItemTableCell baseWidth="3.125rem">
                    {#if ctx?.isOnCooldown}
                      <RechargeControl {item} />
                    {:else if item.system.recharge?.value}
                      <i
                        class="fas fa-bolt"
                        title={localize('DND5E.Charged')}
                      />
                    {:else if ctx?.hasUses}
                      <ItemUses {item} />
                    {:else}
                      <ItemAddUses {item} />
                    {/if}
                  </ItemTableCell>
                  <ItemTableCell baseWidth="7.5rem">
                    {#if item.system.activation.type}
                      <span>{item.labels.activation}</span>
                    {/if}
                  </ItemTableCell>
                {/if}
                {#if section.columns}
                  {#each section.columns as column}
                    {#if column.property === 'system.hp.value'}
                      <!-- TODO: Extract to its own component; formalize this feature of overriding specific columns based on property matching -->
                      <ItemTableCell baseWidth="4.375rem">
                        <div
                          class="item-hp"
                          title={localize('DND5E.HitPoints')}
                        >
                          <ResourceWithBar
                            document={item}
                            value={item.system.hp.value}
                            valueField="system.hp.value"
                            valueTitle={localize('DND5E.HitPointsCurrent')}
                            valueDisabled={!$context.editable}
                            max={item.system.hp.max}
                            maxField="system.hp.max"
                            maxTitle={localize('DND5E.HitPointsMax')}
                            maxDisabled={!$context.editable ||
                              $context.lockSensitiveFields}
                            Bar={HpBar}
                          />
                        </div>
                      </ItemTableCell>
                    {:else if !columnsToSkip.includes(column.property)}
                      {@const isNumber = column.editable === 'Number'}
                      {@const fallback = isNumber ? '0' : ''}
                      {@const value =
                        FoundryAdapter.getProperty(
                          item,
                          column.property,
                        )?.toString() ??
                        FoundryAdapter.getProperty(
                          ctx,
                          column.property,
                        )?.toString() ??
                        fallback}
                      <ItemTableCell
                        baseWidth={baseWidths[column.property] ?? '3.125rem'}
                      >
                        {#if column.editable}
                          <TextInput
                            document={item}
                            field={column.property}
                            allowDeltaChanges={isNumber}
                            selectOnFocus={true}
                            {value}
                            disabled={!$context.editable}
                          />
                        {:else}
                          {FoundryAdapter.getProperty(item, column.property) ??
                            FoundryAdapter.getProperty(ctx, column.property) ??
                            fallback}
                        {/if}
                      </ItemTableCell>
                    {/if}
                  {/each}
                {/if}
                {#if $context.editable && $context.useClassicControls}
                  <ItemTableCell baseWidth={classicControlsBaseWidth}>
                    <ItemControls>
                      <ItemControl
                        iconCssClass="fas fa-user-alt {ctx?.toggleClass}"
                        title={ctx?.toggleTitle}
                        active={ctx?.toggleClass === 'active'}
                        on:click={(ev) =>
                          item.update({
                            ['system.crewed']: !item.system.crewed,
                          })}
                      />
                      <ItemEditControl {item} />
                      {#if $context.unlocked}
                        <ItemDuplicateControl {item} />
                        <ItemDeleteControl {item} />
                      {/if}
                      {#if $context.useActionsFeature}
                        <ActionFilterOverrideControl {item} />
                      {/if}
                    </ItemControls>
                  </ItemTableCell>
                {/if}
              </ItemTableRow>
            {/each}
            {#if $context.unlocked && section.dataset}
              <ItemTableFooter actor={$context.actor} {section} isItem={true} />
            {/if}
          </ItemTable>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  .attributes-tab-contents {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding-right: 0.75rem;
    overflow-y: scroll;
    .side-panel {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 13.75rem;
    }

    .main-panel {
      flex: 1;
    }

    :global(.items-header-item-threshold) {
      align-self: flex-start;
    }

    .item-hp {
      align-self: center;
      position: relative;
      width: calc(100% - 0.25rem);
      margin-left: 0.125rem;
      margin-right: 0.125rem;
      height: 1.325rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
