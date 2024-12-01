<script lang="ts">
  import { getContext } from 'svelte';
  import Traits from '../../actor/traits/Traits.svelte';
  import VehicleAttributes from '../parts/VehicleAttributes.svelte';
  import type { Readable } from 'svelte/store';
  import type {
    RenderableClassicControl,
    VehicleFeatureSection,
    VehicleSheetContext,
  } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ItemTableFooter from 'src/components/item-list/ItemTableFooter.svelte';
  import ItemUses from 'src/components/item-list/ItemUses.svelte';
  import ItemAddUses from 'src/components/item-list/ItemAddUses.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import Notice from 'src/components/notice/Notice.svelte';
  import HpBar from '../../../../components/bar/HpBar.svelte';
  import ResourceWithBar from 'src/components/bar/ResourceWithBar.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import ItemCrewedControl from 'src/sheets/classic/vehicle/parts/ItemCrewedControl.svelte';
  import type { Item5e } from 'src/types/item.types';
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import InlineActivitiesList from 'src/components/item-list/InlineActivitiesList.svelte';

  let context = getContext<Readable<VehicleSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const localize = FoundryAdapter.localize;

  let baseWidths: Record<string, string> = {
    cover: '3.125rem',
    'system.quantity': '4.375rem',
    'system.armor.value': '2.5rem',
    'system.hp.value': '4.375rem',
    threshold: '2.5rem',
  };

  let alternateColumnHeaderContent: Record<string, string> = {
    threshold: `<i class="fas fa-heart-crack" title="${localize(
      'DND5E.Threshold',
    )}"></i>`,
  };

  let noFeatures = $derived(
    !$context.features.some(
      (section: VehicleFeatureSection) => section.items.length,
    ),
  );

  declareLocation('attributes');

  let controls: RenderableClassicControl<{ item: Item5e; ctx: any }>[] =
    $derived.by(() => {
      let result: RenderableClassicControl<{ item: Item5e; ctx: any }>[] = [];
      result.push(
        {
          component: ItemCrewedControl,
          props: ({ item, ctx }) => ({
            item,
            ctx,
          }),
        },
        {
          component: ItemEditControl,
          props: ({ item }) => ({
            item,
          }),
        },
      );

      if ($context.unlocked) {
        result.push({
          component: ItemDeleteControl,
          props: ({ item }) => ({
            item,
          }),
        });
      }

      if ($context.useActionsFeature) {
        result.push({
          component: ActionFilterOverrideControl,
          props: ({ item }) => ({
            item,
          }),
        });
      }

      return result;
    });

  let classicControlsIconWidth = 1.25;

  let classicControlsColumnWidth = $derived(
    `${classicControlsIconWidth * controls.length}rem`,
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
        {localize('TIDY5E.EmptySection')}
      </Notice>
    {:else}
      {#each $context.features as section (section.key)}
        {#if $context.unlocked || section.items.length}
          <ItemTable key={section.key}>
            {#snippet header()}
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
                  {/each}
                {/if}
                {#if $context.editable && $context.useClassicControls}
                  <ItemTableColumn baseWidth={classicControlsColumnWidth} />
                {/if}
              </ItemTableHeaderRow>
            {/snippet}
            {#snippet body()}
              {#each section.items as item (item.id)}
                {@const ctx = $context.itemContext[item.id]}
                <ItemTableRow
                  onMouseDown={(event) =>
                    FoundryAdapter.editOnMiddleClick(event, item)}
                  contextMenu={{
                    type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                    uuid: item.uuid,
                  }}
                  {item}
                  cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
                >
                  {#snippet children({ toggleSummary })}
                    <ItemTableCell primary={true}>
                      <ItemUseButton disabled={!$context.editable} {item} />
                      {#if item?.system.activities?.contents.length > 1}
                        <InlineToggleControl
                          entityId={item.id}
                          {inlineToggleService}
                        />
                      {/if}
                      <ItemName
                        onToggle={() => toggleSummary($context.actor)}
                        cssClass="extra-small-gap"
                        {item}
                      >
                        <span
                          class="truncate"
                          data-tidy-item-name={item.name}
                          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                          >{item.name}</span
                        >
                      </ItemName>
                    </ItemTableCell>
                    {#if section.hasActions}
                      <ItemTableCell baseWidth="3.125rem">
                        {#if item.isOnCooldown}
                          <RechargeControl {item} />
                        {:else if item.hasRecharge}
                          <i
                            class="fas fa-bolt"
                            title={localize('DND5E.Charged')}
                          ></i>
                        {:else if ctx?.hasUses}
                          <ItemUses {item} />
                        {:else}
                          <!-- TODO: Figure out how to make this work in a custom section. -->
                          <ItemAddUses {item} />
                        {/if}
                      </ItemTableCell>
                      <ItemTableCell baseWidth="7.5rem">
                        {#if ItemUtils.hasActivationType(item)}
                          <span>{item.labels?.activation ?? ''}</span>
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
                        {:else}
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
                            baseWidth={baseWidths[column.property] ??
                              '3.125rem'}
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
                              {FoundryAdapter.getProperty(
                                item,
                                column.property,
                              ) ??
                                FoundryAdapter.getProperty(
                                  ctx,
                                  column.property,
                                ) ??
                                fallback}
                            {/if}
                          </ItemTableCell>
                        {/if}
                      {/each}
                    {/if}
                    {#if $context.editable && $context.useClassicControls}
                      <ItemTableCell baseWidth={classicControlsColumnWidth}>
                        <ClassicControls
                          {controls}
                          params={{ item: item, ctx: ctx }}
                        />
                      </ItemTableCell>
                    {/if}
                  {/snippet}
                </ItemTableRow>
                {#if item?.system.activities?.contents.length > 1}
                  <InlineActivitiesList {item} {inlineToggleService} />
                {/if}
              {/each}
              {#if $context.unlocked && section.dataset}
                <ItemTableFooter
                  actor={$context.actor}
                  {section}
                  isItem={true}
                />
              {/if}
            {/snippet}
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
