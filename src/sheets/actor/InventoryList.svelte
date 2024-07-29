<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import ItemTable from '../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../components/item-list/v1/ItemTableRow.svelte';
  import ItemTableFooter from '../../components/item-list/ItemTableFooter.svelte';
  import ItemTableColumn from '../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableCell from '../../components/item-list/v1/ItemTableCell.svelte';
  import ItemUseButton from '../../components/item-list/ItemUseButton.svelte';
  import ItemName from '../../components/item-list/ItemName.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUses from '../../components/item-list/ItemUses.svelte';
  import ItemAddUses from '../../components/item-list/ItemAddUses.svelte';
  import ItemDeleteControl from '../../components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from '../../components/item-list/controls/ItemEditControl.svelte';
  import EquipControl from '../../components/item-list/controls/EquipControl.svelte';
  import AttuneControl from '../../components/item-list/controls/AttuneControl.svelte';
  import InlineFavoriteIcon from '../../components/item-list/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../../components/item-list/controls/ItemFavoriteControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type {
    CharacterSheetContext,
    InventorySection,
    NpcSheetContext,
    RenderableClassicControl,
  } from 'src/types/types';
  import AmmoSelector from './AmmoSelector.svelte';
  import { settingStore } from 'src/settings/settings';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { coalesce } from 'src/utils/formatting';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ClassicControls from 'src/sheets/shared/ClassicControls.svelte';
  import InlineContainerToggle from '../container/InlineContainerToggle.svelte';
  import { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
  import InlineContainerView from '../container/InlineContainerView.svelte';

  export let primaryColumnName: string;
  export let items: Item5e[];
  export let section: InventorySection;
  export let extraInventoryRowClasses: string = '';
  export let lockControls: boolean = false;
  export let allowFavoriteIconNextToName: boolean = true;
  export let includeWeightColumn: boolean = true;

  let inlineContainerToggleService = getContext<InlineContainerToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_CONTAINER_TOGGLE_SERVICE,
  );

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  const localize = FoundryAdapter.localize;
  const weightUnit = FoundryAdapter.getWeightUnit();

  // TODO: Assign these controls to the inventory prop in `getData()`. Leave room for the API to inject additional controls.
  let controls: RenderableClassicControl<{ item: Item5e; ctx: any }>[] = [];

  $: {
    controls = [];
    controls.push(
      {
        component: AttuneControl,
        props: ({ item, ctx }) => ({
          item,
          ctx,
        }),
        visible: ({ item, ctx }) =>
          ctx?.attunement && !FoundryAdapter.concealDetails(item),
      },
      {
        component: EquipControl,
        props: ({ item, ctx }) => ({
          item,
          ctx,
        }),
        visible: ({ ctx }) => ctx?.canToggle === true,
      },
    );

    if ('favorites' in $context.actor.system) {
      controls.push({
        component: ItemFavoriteControl,
        props: ({ item }) => ({
          item,
        }),
      });
    }

    controls.push({
      component: ItemEditControl,
      props: ({ item }) => ({
        item,
      }),
    });

    if ($context.unlocked) {
      controls.push({
        component: ItemDeleteControl,
        props: ({ item }) => ({
          item,
        }),
      });
    }

    if ($context.useActionsFeature) {
      controls.push({
        component: ActionFilterOverrideControl,
        props: ({ item }) => ({
          item,
        }),
      });
    }
  }

  let classicControlsIconWidth = 1.25;

  $: classicControlsColumnWidth = `${classicControlsIconWidth * controls.length}rem`;

  function getInventoryRowClasses(item: Item5e) {
    const extras: string[] = [];

    if (extraInventoryRowClasses) {
      extras.push(extraInventoryRowClasses);
    }

    return FoundryAdapter.getInventoryRowClasses(
      item,
      $context.itemContext[item.id],
      extras,
    );
  }
</script>

<section class="inventory-list-section">
  <ItemTable
    key={section.key}
    data-custom-section={section.custom ? true : null}
  >
    <svelte:fragment slot="header">
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          {primaryColumnName}
        </ItemTableColumn>
        {#if includeWeightColumn}
          <ItemTableColumn
            title="{localize('DND5E.Weight')} ({weightUnit})"
            baseWidth="4rem"
          >
            <i class="fas fa-weight-hanging" />
          </ItemTableColumn>
        {/if}
        <ItemTableColumn title={localize('DND5E.Charges')} baseWidth="3.125rem">
          <i class="fas fa-bolt" />
        </ItemTableColumn>
        <ItemTableColumn baseWidth="7.5rem">
          {localize('DND5E.Usage')}
        </ItemTableColumn>
        <ItemTableColumn baseWidth="3rem">
          {localize('DND5E.QuantityAbbr')}
        </ItemTableColumn>
        {#if $context.editable && $context.useClassicControls && !lockControls}
          <ItemTableColumn baseWidth={classicControlsColumnWidth} />
        {/if}
      </ItemTableHeaderRow>
    </svelte:fragment>
    <svelte:fragment slot="body">
      {#each items as item (item.id)}
        {@const ctx = $context.itemContext[item.id]}
        {@const itemName =
          item.system.identified === false
            ? coalesce(
                item.system.unidentified.name,
                localize('DND5E.Unidentified.Title'),
              )
            : item.name}
        <ItemTableRow
          {item}
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event.detail, item)}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            uuid: item.uuid,
          }}
          let:toggleSummary
          cssClass={getInventoryRowClasses(item)}
          hidden={!!$itemIdsToShow && !$itemIdsToShow.has(item.id)}
          favoriteId={'favoriteId' in ctx ? ctx.favoriteId : null}
        >
          <ItemTableCell primary={true}>
            <ItemUseButton disabled={!$context.editable} {item} />
            {#if 'containerContents' in ctx && !!ctx.containerContents}
              <InlineContainerToggle {item} {inlineContainerToggleService} />
            {/if}
            <ItemName
              on:toggle={() => toggleSummary($context.actor)}
              cssClass="extra-small-gap"
              {item}
            >
              <span
                class="truncate"
                data-tidy-item-name={itemName}
                data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                >{itemName}</span
              >
              {#if item.system?.properties?.has('amm')}
                <span class="ammo">
                  <AmmoSelector {item} />
                </span>
              {/if}
            </ItemName>
          </ItemTableCell>
          {#if $settingStore.showIconsNextToTheItemName}
            <ItemTableCell cssClass="no-border">
              {#if ctx?.attunement && !FoundryAdapter.concealDetails(item)}
                <div class="item-detail attunement">
                  <i
                    class="item-state-icon fas {ctx.attunement.icon} {ctx
                      .attunement.cls}"
                    title={localize(ctx.attunement.title)}
                  />
                </div>
              {/if}
            </ItemTableCell>
            {#if 'favoriteId' in ctx && !!ctx.favoriteId && allowFavoriteIconNextToName}
              <InlineFavoriteIcon />
            {/if}
          {/if}
          {#if includeWeightColumn}
            {@const weight = ctx?.totalWeight ?? item.system.weight.value}
            <ItemTableCell
              baseWidth="4rem"
              title={localize('TIDY5E.Inventory.Weight.Tooltip', {
                weight: weight,
                weightUnit: weightUnit,
              })}
            >
              <span class="truncate">
                {localize('TIDY5E.Inventory.Weight.Text', {
                  weight: weight,
                  weightUnit: weightUnit,
                })}
              </span>
            </ItemTableCell>
          {/if}
          <ItemTableCell baseWidth="3.125rem" title={localize('DND5E.Uses')}>
            {#if ctx?.hasUses}
              <ItemUses {item} />
            {:else}
              <ItemAddUses {item} />
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="7.5rem" title={localize('DND5E.Usage')}>
            {#if item.system.activation?.type}
              {item.labels?.activation ?? ''}
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="3rem">
            <TextInput
              document={item}
              field="system.quantity"
              value={item.system.quantity}
              selectOnFocus={true}
              disabled={!$context.editable || $context.lockItemQuantity}
              placeholder="0"
              allowDeltaChanges={true}
              cssClass="text-align-center"
            />
          </ItemTableCell>
          {#if $context.editable && $context.useClassicControls && !lockControls}
            <ItemTableCell baseWidth={classicControlsColumnWidth}>
              <ClassicControls {controls} params={{ item: item, ctx: ctx }} />
            </ItemTableCell>
          {/if}
        </ItemTableRow>
        {#if 'containerContents' in ctx && !!ctx.containerContents}
          <InlineContainerView
            container={item}
            containerContents={ctx.containerContents}
            editable={$context.editable}
            {inlineContainerToggleService}
            lockItemQuantity={$context.lockItemQuantity}
            sheetDocument={$context.actor}
          />
        {/if}
      {/each}
      {#if $context.unlocked && section.canCreate}
        <ItemTableFooter actor={$context.actor} {section} isItem={true} />
      {/if}
    </svelte:fragment>
  </ItemTable>
</section>

<style lang="scss">
  .inventory-list-section {
    .item-detail.attunement {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.25rem;
    }
  }
</style>
