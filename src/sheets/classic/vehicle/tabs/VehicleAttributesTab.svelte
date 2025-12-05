<script lang="ts">
  import { type ComponentProps } from 'svelte';
  import Traits from '../../actor/traits/Traits.svelte';
  import VehicleAttributes from '../parts/VehicleAttributes.svelte';
  import type {
    InventorySection,
    RenderableClassicControl,
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
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import Notice from 'src/components/notice/Notice.svelte';
  import HpBar from '../../../../components/bar/HpBar.svelte';
  import ResourceWithBar from 'src/components/bar/ResourceWithBar.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import type { Item5e } from 'src/types/item.types';
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { isItemInActionList } from 'src/features/actions/actions.svelte';
  
  let context = $derived(getVehicleSheetContext());

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

  let noEntries = $derived(
    !context.features.items.length &&
      !context.weaponStations.items.length &&
      !context.equipmentStations.items.length,
  );

  declareLocation('attributes');

  let controls: RenderableClassicControl<{ item: Item5e; ctx: any }>[] =
    $derived.by(() => {
      let result: RenderableClassicControl<{ item: Item5e; ctx: any }>[] = [];
      result.push({
        component: ItemEditControl,
        props: ({ item }) =>
          ({
            item,
          }) satisfies ComponentProps<typeof ItemEditControl>,
      });

      if (context.unlocked) {
        result.push({
          component: ItemDeleteControl,
          props: ({ item }) =>
            ({
              item,
            }) satisfies ComponentProps<typeof ItemDeleteControl>,
        });
      }

      if (context.useActionsFeature) {
        result.push({
          component: ActionFilterOverrideControl,
          props: ({ item }) =>
            ({
              item,
              flagValue: TidyFlags.actionFilterOverride.get(item),
              active: isItemInActionList(item),
            }) satisfies ComponentProps<typeof ActionFilterOverrideControl>,
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
    <Traits useSenses={false} enableSpecialTraitsConfiguration={false} />
  </div>
  <div class="main-panel flex-column small-gap">
    {#if noEntries && !context.unlocked}
      <Notice>
        {localize('TIDY5E.EmptySection')}
      </Notice>
    {:else}
      {@render featuresTable()}
      {@render stationsTable(context.equipmentStations)}
      {@render stationsTable(context.weaponStations)}
    {/if}
  </div>
</div>

{#snippet featuresTable()}
  {@const section = context.features}
  {#if context.unlocked || section.items.length}
    {@const itemEntries = section.items.map((item) => ({
      item,
      ctx: context.itemContext[item.id],
    }))}

    <ItemTable key={section.key}>
      {#snippet header()}
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(section.label)}
            <span class="item-table-count">{section.items.length}</span>
          </ItemTableColumn>
          <ItemTableColumn baseWidth="3.125rem">
            {localize('DND5E.Uses')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Usage')}
          </ItemTableColumn>
          {#if context.editable && context.useClassicControls}
            <ItemTableColumn baseWidth={classicControlsColumnWidth} />
          {/if}
        </ItemTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each itemEntries as { item, ctx } (item.id)}
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
                <ItemUseButton disabled={!context.editable} {item} />
                <ItemName
                  onToggle={() => toggleSummary(context.actor)}
                  cssClass="extra-small-gap"
                  {item}
                >
                  <span
                    class="truncate flex-1"
                    data-tidy-item-name={item.name}
                    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                    >{item.name}</span
                  >
                </ItemName>
              </ItemTableCell>

              <ItemTableCell baseWidth="3.125rem">
                {#if item.isOnCooldown}
                  <RechargeControl
                    document={item}
                    field={'system.uses.spent'}
                    uses={item.system.uses}
                  />
                {:else if item.hasRecharge}
                  {@const remaining =
                    item.system.uses.max - item.system.uses.spent}
                  {#if remaining > 1}
                    <span>{remaining}</span>
                  {/if}
                  <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
                {:else if ctx?.hasUses}
                  <ItemUses {item} />
                {:else}
                  <span class="text-body-tertiary">&mdash;</span>
                {/if}
              </ItemTableCell>
              <ItemTableCell baseWidth="7.5rem">
                {#if ItemUtils.hasActivationType(item)}
                  <span>{item.labels?.activation ?? ''}</span>
                {/if}
              </ItemTableCell>

              {#if context.editable && context.useClassicControls}
                <ItemTableCell baseWidth={classicControlsColumnWidth}>
                  <ClassicControls
                    {controls}
                    params={{ item: item, ctx: ctx }}
                  />
                </ItemTableCell>
              {/if}
            {/snippet}
          </ItemTableRow>
        {/each}
        {#if context.unlocked && section.dataset}
          <ItemTableFooter actor={context.actor} {section} isItem={true} />
        {/if}
      {/snippet}
    </ItemTable>
  {/if}
{/snippet}

{#snippet stationsTable(section: InventorySection)}
  {#if context.unlocked || section.items.length}
    {@const itemEntries = section.items.map((item) => ({
      item,
      ctx: context.itemContext[item.id],
    }))}

    <ItemTable key={section.key}>
      {#snippet header()}
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(section.label)}
            <span class="item-table-count">{section.items.length}</span>
          </ItemTableColumn>
          <ItemTableColumn
            baseWidth="3.125rem"
            cssClass="items-header-item-qty"
          >
            {localize('DND5E.QuantityAbbr')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="3.125rem" cssClass="items-header-item-ac">
            {localize('DND5E.AC')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="5rem" cssClass="items-header-item-hp">
            {localize('DND5E.HP')}
          </ItemTableColumn>
          <ItemTableColumn
            baseWidth="3.125rem"
            cssClass="items-header-item-threshold"
          >
            {localize('DND5E.Threshold')}
          </ItemTableColumn>

          {#if context.editable && context.useClassicControls}
            <ItemTableColumn baseWidth={classicControlsColumnWidth} />
          {/if}
        </ItemTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each itemEntries as { item, ctx } (item.id)}
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
                <ItemUseButton disabled={!context.editable} {item} />
                <ItemName
                  onToggle={() => toggleSummary(context.actor)}
                  cssClass="extra-small-gap"
                  {item}
                >
                  <span
                    class="truncate flex-1"
                    data-tidy-item-name={item.name}
                    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                    >{item.name}</span
                  >
                </ItemName>
              </ItemTableCell>

              <!-- QTY -->
              <ItemTableCell baseWidth="3.125rem">
                <TextInput
                  document={item}
                  field="system.quantity"
                  allowDeltaChanges={true}
                  selectOnFocus={true}
                  value={item.system.quantity}
                  disabled={!context.editable}
                />
              </ItemTableCell>

              <!-- AC -->
              <ItemTableCell baseWidth="3.125rem">
                {item.system.armor.value}
              </ItemTableCell>

              <!-- HP -->
              <ItemTableCell baseWidth="5rem">
                <div class="item-hp" title={localize('DND5E.HitPoints')}>
                  <ResourceWithBar
                    document={item}
                    value={item.system.hp?.value}
                    valueField="system.hp.value"
                    valueTitle={localize('DND5E.HitPointsCurrent')}
                    valueDisabled={!context.editable}
                    max={item.system.hp?.max}
                    maxField="system.hp.max"
                    maxTitle={localize('DND5E.HitPointsMax')}
                    maxDisabled={!context.editable ||
                      context.lockSensitiveFields}
                    Bar={HpBar}
                  />
                </div>
              </ItemTableCell>

              <!-- Threshold -->
              <ItemTableCell baseWidth="3.125rem">
                {ctx.threshold}
              </ItemTableCell>

              {#if context.editable && context.useClassicControls}
                <ItemTableCell baseWidth={classicControlsColumnWidth}>
                  <ClassicControls
                    {controls}
                    params={{ item: item, ctx: ctx }}
                  />
                </ItemTableCell>
              {/if}
            {/snippet}
          </ItemTableRow>
        {/each}
        {#if context.unlocked && section.dataset}
          <ItemTableFooter actor={context.actor} {section} isItem={true} />
        {/if}
      {/snippet}
    </ItemTable>
  {/if}
{/snippet}

<style lang="less">
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
