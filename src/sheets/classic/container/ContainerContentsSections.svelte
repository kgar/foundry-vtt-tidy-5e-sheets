<script lang="ts">
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { Actor5e, InventorySection } from 'src/types/types';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import ItemTableRowV2 from 'src/components/item-list/v2/ItemTableRowV2.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import InlineFavoriteIcon from 'src/components/item-list/InlineFavoriteIcon.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getContext, type Component } from 'svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import type { Readable } from 'svelte/store';
  import InlineContainerView from './InlineContainerView.svelte';
  import InlineActivitiesList from 'src/components/item-list/InlineActivitiesList.svelte';
  import ItemUses from 'src/components/item-list/ItemUses.svelte';
  import ItemAddUses from 'src/components/item-list/ItemAddUses.svelte';

  interface Props {
    contents: InventorySection[];
    container: Item5e;
    editable: boolean;
    itemContext: Record<string, ContainerItemContext>;
    inlineToggleService: InlineToggleService;
    lockItemQuantity: boolean;
    /** The sheet which is rendering this recursive set of container contents. */
    sheetDocument: Actor5e | Item5e;
    unlocked?: boolean;
  }

  let {
    contents,
    container,
    editable,
    itemContext,
    inlineToggleService,
    lockItemQuantity,
    sheetDocument,
    unlocked = true,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let configuredContents = $derived(
    SheetSections.configureInventory(
      contents.filter((i) => i.items.length),
      tabId,
      SheetPreferencesService.getByType(sheetDocument.type),
      TidyFlags.sectionConfig.get(container)?.[
        CONSTANTS.TAB_CONTAINER_CONTENTS
      ],
    ),
  );

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  let classicControls: {
    component: Component<any>;
    getProps: (item: Item5e) => any;
  }[] = $derived.by(() => {
    let result: {
      component: Component<any>;
      getProps: (item: Item5e) => any;
    }[] = [];

    result.push({
      component: ItemEditControl,
      getProps: (item: Item5e) => ({ item }),
    });

    if (unlocked) {
      result.push({
        component: ItemDeleteControl,
        getProps: (item: Item5e) => ({
          item,
          deleteFn: () => item.deleteDialog(),
        }),
      });
    }

    return result;
  });

  const weightUnit = FoundryAdapter.getWeightUnit();

  const classicControlWidthRems = 1.5;

  let useClassicControls = $derived(
    FoundryAdapter.useClassicControls(container),
  );

  let classicControlsWidth = $derived(
    useClassicControls
      ? `/* Controls */ ${classicControlWidthRems * classicControls.length}rem`
      : '',
  );

  let gridTemplateColumns = $derived(
    `/* Name */ 1fr /* Uses */ 3.125rem /* Weight */ 3rem /* Quantity */ 3rem ${classicControlsWidth}`,
  );

  const localize = FoundryAdapter.localize;
</script>

{#each configuredContents as section (section.key)}
  {#if section.show}
    <section class="container-contents-list-section">
      <TidyTable
        key={section.key}
        data-custom-section={section.custom ? true : null}
        {gridTemplateColumns}
      >
        {#snippet header()}
          <TidyTableHeaderRow>
            <TidyTableHeaderCell primary={true}>
              {localize(section.label)} ({section.items.length})
            </TidyTableHeaderCell>
            <TidyTableHeaderCell title={localize('DND5E.Charges')}>
              <i class="fas fa-bolt"></i>
            </TidyTableHeaderCell>
            <TidyTableHeaderCell>
              {localize('DND5E.Weight')}
            </TidyTableHeaderCell>
            <TidyTableHeaderCell>
              {localize('DND5E.QuantityAbbr')}
            </TidyTableHeaderCell>
            {#if editable && useClassicControls}
              <TidyTableHeaderCell></TidyTableHeaderCell>
            {/if}
          </TidyTableHeaderRow>
        {/snippet}
        {#snippet body()}
          {#each section.items as item (item.id)}
            {@const ctx = itemContext[item.id]}
            {@const weight = ctx?.totalWeight ?? item.system.weight.value}

            <ItemTableRowV2
              {item}
              hidden={!!$itemIdsToShow && !$itemIdsToShow.has(item.id)}
              rowClass={FoundryAdapter.getInventoryRowClasses(
                item,
                itemContext[item.id]?.attunement,
              )}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                uuid: item.uuid,
              }}
            >
              {#snippet children({ toggleSummary })}
                <TidyTableCell class="flex-row extra-small-gap">
                  <ItemUseButton
                    disabled={!FoundryAdapter.canUseItem(item)}
                    {item}
                  />
                  {#if ('containerContents' in ctx && !!ctx.containerContents) || item?.system.activities?.contents.length > 1}
                    <InlineToggleControl
                      entityId={item.id}
                      {inlineToggleService}
                    />
                  {/if}
                  <!-- This is generally what we want in Tidy Tables / Item Table V2; consider breaking off ItemNameV2 to propagate and replace the old ItemName gradually. -->
                  <ItemName
                    on:toggle={() => toggleSummary()}
                    cssClass="align-self-stretch flex-row align-items-center"
                    {item}
                  >
                    <span
                      class="truncate"
                      data-tidy-item-name={item.name}
                      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                      >{item.name}</span
                    >
                  </ItemName>

                  {#if !FoundryAdapter.concealDetails(item)}
                    {@const attunementContext =
                      FoundryAdapter.getAttunementContext(item)}

                    {#if attunementContext}
                      <i
                        style="margin-left: auto; align-self: center;"
                        class="item-state-icon fas {attunementContext.icon} {attunementContext.cls} fa-fw"
                        title={localize(attunementContext.title)}
                      ></i>
                    {/if}
                  {/if}
                  {#if !!ctx.favoriteId}
                    <InlineFavoriteIcon />
                  {/if}
                </TidyTableCell>
                <TidyTableCell>
                  {#if item.hasLimitedUses}
                    <ItemUses {item} />
                  {:else}
                    <ItemAddUses {item} />
                  {/if}
                </TidyTableCell>
                <TidyTableCell
                  title={localize('TIDY5E.Inventory.Weight.Text', {
                    weight: weight,
                    weightUnit: weightUnit,
                  })}
                >
                  <span class="truncate">
                    {weight}
                  </span>
                </TidyTableCell>
                <TidyTableCell>
                  <!-- Qty -->
                  <TextInput
                    document={item}
                    field="system.quantity"
                    value={item.system.quantity}
                    selectOnFocus={true}
                    disabled={!editable || lockItemQuantity}
                    placeholder="0"
                    allowDeltaChanges={true}
                  />
                </TidyTableCell>
                {#if editable && useClassicControls}
                  <TidyTableCell>
                    {#each classicControls as control}
                      <control.component
                        {...control.getProps(item)}
                        class="tidy-table-control"
                      ></control.component>
                    {/each}
                  </TidyTableCell>
                {/if}
              {/snippet}
            </ItemTableRowV2>
            {#if 'containerContents' in ctx && !!ctx.containerContents}
              <InlineContainerView
                container={item}
                containerContents={ctx.containerContents}
                {editable}
                {inlineToggleService}
                {lockItemQuantity}
                {sheetDocument}
                {unlocked}
              />
            {:else if item.system.activities?.contents.length > 1}
              <InlineActivitiesList {item} {inlineToggleService} />
            {/if}
          {/each}
        {/snippet}
      </TidyTable>
    </section>
  {/if}
{/each}
