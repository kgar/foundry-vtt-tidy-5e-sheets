<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import ItemTable from '../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemTableFooter from '../../../components/item-list/ItemTableFooter.svelte';
  import ItemTableColumn from '../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableCell from '../../../components/item-list/v1/ItemTableCell.svelte';
  import ItemUseButton from '../../../components/item-list/ItemUseButton.svelte';
  import ItemName from '../../../components/item-list/ItemName.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUses from '../../../components/item-list/ItemUses.svelte';
  import ItemDeleteControl from '../../../components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from '../../../components/item-list/controls/ItemEditControl.svelte';
  import EquipControl from '../../../components/item-list/controls/EquipControl.svelte';
  import AttuneControl from '../../../components/item-list/controls/AttuneControl.svelte';
  import InlineFavoriteIcon from '../../../components/item-list/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../../../components/item-list/controls/ItemFavoriteControl.svelte';
  import { getContext, type ComponentProps, type Snippet } from 'svelte';
  import type {
    CharacterSheetContext,
    InventorySection,
    NpcSheetContext,
    RenderableClassicControl,
  } from 'src/types/types';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import { coalesce } from 'src/utils/formatting';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import InlineContainerView from '../container/InlineContainerView.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { isItemInActionList } from 'src/features/actions/actions.svelte';

  interface Props {
    primaryColumnName?: string;
    primaryColumn?: Snippet;
    section: InventorySection;
    extraInventoryRowClasses?: string;
    lockControls?: boolean;
    allowFavoriteIconNextToName?: boolean;
    includeWeightColumn?: boolean;
    allowAttuneControl?: boolean;
    allowEquipControl?: boolean;
  }

  let {
    primaryColumnName,
    primaryColumn,
    section,
    extraInventoryRowClasses = '',
    lockControls = false,
    allowFavoriteIconNextToName = true,
    includeWeightColumn = true,
    allowAttuneControl = true,
    allowEquipControl = true,
  }: Props = $props();

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  let itemEntries = $derived(
    section.items.map((item) => ({
      item: item,
      ctx: context.itemContext[item.id],
      // TODO: Determine if this is needed any longer
      itemName:
        item.system.identified === false
          ? coalesce(
              item.system.unidentified.name,
              localize('DND5E.Unidentified.Title'),
            )
          : item.name,
    })),
  );

  const searchResults = getSearchResultsContext();

  const localize = FoundryAdapter.localize;
  const weightUnit = FoundryAdapter.getWeightUnit();

  // TODO: Assign these controls to the inventory prop in `getData()`. Leave room for the API to inject additional controls.
  let controls: RenderableClassicControl<{ item: Item5e; ctx: any }>[] =
    $derived.by(() => {
      let result: RenderableClassicControl<{ item: Item5e; ctx: any }>[] = [];

      if (allowAttuneControl) {
        result.push({
          component: AttuneControl,
          props: ({ item, ctx }) =>
            ({
              item,
              title: ctx?.attunement?.title,
              class: ctx?.attunement?.cls,
              attuned: item.system.attuned,
            }) satisfies ComponentProps<typeof AttuneControl>,
          visible: ({ item, ctx }) =>
            ctx?.attunement && !FoundryAdapter.concealDetails(item),
        });
      }

      if (allowEquipControl) {
        result.push({
          component: EquipControl,
          props: ({ item, ctx }) =>
            ({
              item,
              title: ctx?.toggleTitle,
              equipped: item.system.equipped,
            }) satisfies ComponentProps<typeof EquipControl>,
          visible: ({ item, ctx }) => 'equipped' in item.system,
        });
      }

      if ('favorites' in context.actor.system) {
        result.push({
          component: ItemFavoriteControl,
          props: ({ item }) =>
            ({
              item,
              favorited: FoundryAdapter.isItemFavorited(item),
            }) satisfies ComponentProps<typeof ItemFavoriteControl>,
        });
      }

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

  function getInventoryRowClasses(item: Item5e) {
    const extras: string[] = [];

    if (extraInventoryRowClasses) {
      extras.push(extraInventoryRowClasses);
    }

    return FoundryAdapter.getInventoryRowClasses(
      item,
      context.itemContext[item.id],
      extras,
    );
  }
</script>

<section class="inventory-list-section">
  <ItemTable
    key={section.key}
    data-custom-section={section.custom ? true : null}
  >
    {#snippet header()}
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          {primaryColumnName}
          {#if primaryColumn}
            {@render primaryColumn()}
          {/if}
        </ItemTableColumn>
        {#if includeWeightColumn}
          <ItemTableColumn
            title="{localize('DND5E.Weight')} ({weightUnit})"
            baseWidth="4rem"
          >
            <i class="fas fa-weight-hanging"></i>
          </ItemTableColumn>
        {/if}
        <ItemTableColumn title={localize('DND5E.Charges')} baseWidth="3.125rem">
          <i class="fas fa-bolt"></i>
        </ItemTableColumn>
        <ItemTableColumn baseWidth="7.5rem">
          {localize('DND5E.Usage')}
        </ItemTableColumn>
        <ItemTableColumn baseWidth="3rem">
          {localize('DND5E.QuantityAbbr')}
        </ItemTableColumn>
        {#if context.editable && context.useClassicControls && !lockControls}
          <ItemTableColumn baseWidth={classicControlsColumnWidth} />
        {/if}
      </ItemTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each itemEntries as { item, ctx, itemName } (item.id)}
        <ItemTableRow
          {item}
          onMouseDown={(event) => FoundryAdapter.editOnMiddleClick(event, item)}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            uuid: item.uuid,
          }}
          cssClass={getInventoryRowClasses(item)}
          hidden={!searchResults.show(item.uuid)}
          favoriteId={'favoriteId' in ctx ? ctx.favoriteId : null}
        >
          {#snippet children({ toggleSummary })}
            <ItemTableCell primary={true}>
              <ItemUseButton disabled={!context.editable} {item} />
              {#if 'containerContents' in ctx && !!ctx.containerContents}
                <InlineToggleControl entityId={item.id} {inlineToggleService} />
              {/if}
              <ItemName
                onToggle={() => toggleSummary(context.actor)}
                cssClass="extra-small-gap"
                {item}
              >
                <span
                  class="truncate flex-1"
                  data-tidy-item-name={itemName}
                  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                  >{itemName}</span
                >
              </ItemName>
              <div class="primary-cell-extras">
                {#if !context.useClassicControls}
                  {#if ctx?.attunement && !FoundryAdapter.concealDetails(item)}
                    <div class="item-detail attunement">
                      <i
                        class="item-state-icon fas {ctx.attunement.icon} {ctx
                          .attunement.cls}"
                        title={localize(ctx.attunement.title)}
                      ></i>
                    </div>
                  {/if}

                  {#if 'favoriteId' in ctx && !!ctx.favoriteId && allowFavoriteIconNextToName}
                    <InlineFavoriteIcon />
                  {/if}
                {/if}
              </div>
            </ItemTableCell>
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
                <span class="text-body-tertiary">&mdash;</span>
              {/if}
            </ItemTableCell>
            <ItemTableCell baseWidth="7.5rem" title={localize('DND5E.Usage')}>
              {#if ItemUtils.hasActivationType(item)}
                {item.labels?.activation ?? ''}
              {/if}
            </ItemTableCell>
            <ItemTableCell baseWidth="3rem">
              <TextInput
                document={item}
                field="system.quantity"
                value={item.system.quantity}
                selectOnFocus={true}
                disabled={!context.editable || context.lockItemQuantity}
                placeholder="0"
                allowDeltaChanges={true}
                class="text-align-center"
              />
            </ItemTableCell>
            {#if context.editable && context.useClassicControls && !lockControls}
              <ItemTableCell baseWidth={classicControlsColumnWidth}>
                <ClassicControls {controls} params={{ item: item, ctx: ctx }} />
              </ItemTableCell>
            {/if}
          {/snippet}
        </ItemTableRow>

        {#if 'containerContents' in ctx && !!ctx.containerContents}
          <InlineContainerView
            container={item}
            containerContents={ctx.containerContents}
            editable={context.editable}
            {inlineToggleService}
            lockItemQuantity={context.lockItemQuantity}
            sheetDocument={context.actor}
            unlocked={context.unlocked}
          />
        {/if}
      {/each}
      {#if context.unlocked && section.canCreate}
        <ItemTableFooter actor={context.actor} {section} isItem={true} />
      {/if}
    {/snippet}
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
