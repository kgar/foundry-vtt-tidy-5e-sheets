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
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getContext, type ComponentType } from 'svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import type { Readable } from 'svelte/store';
  import InlineActivitiesList from '../../shared/InlineActivitiesList.svelte';
  import InlineContainerView from './InlineContainerView.svelte';
  import { isNil } from 'src/utils/data';
  import TidyTableToggleIcon from 'src/components/table/TidyTableToggleIcon.svelte';

  export let contents: InventorySection[];
  export let container: Item5e;
  export let editable: boolean;
  export let itemContext: Record<string, ContainerItemContext>;
  export let inlineToggleService: InlineToggleService;
  export let lockItemQuantity: boolean;
  /** The sheet which is rendering this recursive set of container contents. */
  export let sheetDocument: Actor5e | Item5e;
  export let unlocked: boolean = true;

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  $: configuredContents = SheetSections.configureInventory(
    contents.filter((i) => i.items.length),
    tabId,
    SheetPreferencesService.getByType(sheetDocument.type),
    TidyFlags.sectionConfig.get(container)?.[CONSTANTS.TAB_CONTAINER_CONTENTS],
  );

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  let classicControls: {
    component: ComponentType;
    getProps: (item: Item5e) => any;
  }[] = [];

  $: {
    classicControls = [];

    classicControls.push({
      component: ItemEditControl,
      getProps: (item: Item5e) => ({ item }),
    });

    if (unlocked) {
      classicControls.push({
        component: ItemDeleteControl,
        getProps: (item: Item5e) => ({
          item,
          deleteFn: () => item.deleteDialog(),
        }),
      });
    }
  }

  const weightUnit = FoundryAdapter.getWeightUnit();

  const classicControlWidthRems = 1.5;

  $: useClassicControls = FoundryAdapter.useClassicControls(container);

  $: classicControlsWidth = useClassicControls
    ? `/* Controls */ ${classicControlWidthRems * classicControls.length}rem`
    : '';

  $: gridTemplateColumns = `/* Name */ 1fr /* Weight */ 3rem /* Quantity */ 3rem ${classicControlsWidth}`;

  $: inlineContainerToggleServiceStore = inlineToggleService.store;

  let quantityBaseWidth = '4.125rem';
  let weightBaseWidth = '2.25rem';
  $: actionsBaseWidth = unlocked ? '4.5rem' : '1.5rem';

  const localize = FoundryAdapter.localize;
</script>

{#each configuredContents as section (section.key)}
  {#if section.show}
    <TidyTable
      key={section.key}
      data-custom-section={section.custom ? true : null}
    >
      <svelte:fragment slot="header">
        <TidyTableHeaderRow>
          <TidyTableHeaderCell primary={true}>
            {localize(section.label)}
            <span class="count">{section.items.length}</span>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell baseWidth={quantityBaseWidth}>
            {localize('DND5E.Quantity')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell baseWidth={weightBaseWidth}>
            {localize('DND5E.Weight')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell baseWidth={actionsBaseWidth} class="item-actions">
            <!-- Actions -->
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      </svelte:fragment>
      <svelte:fragment slot="body">
        {@const lastItemIndex = section.items.length - 1}
        {#each section.items as item, i (item.id)}
          {@const ctx = itemContext[item.id]}
          {@const weight = ctx?.totalWeight ?? item.system.weight.value}
          {@const itemBorderColor = item.system.rarity
            ? `var(--t5e-color-rarity-${item.system.rarity.slugify()})`
            : 'var(--t5e-color-gold)'}
          {@const showRarityBoxShadow = [
            'veryRare',
            'legendary',
            'artifact',
          ].includes(item.system.rarity)}
          <ItemTableRowV2
            {item}
            hidden={!!$itemIdsToShow && !$itemIdsToShow.has(item.id)}
            rowClass={FoundryAdapter.getInventoryRowClasses(
              item,
              itemContext[item.id]?.attunement,
            )}
            let:toggleSummary
            contextMenu={{
              type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
              uuid: item.uuid,
            }}
          >
            <TidyTableCell primary={true} class="truncate">
              <button
                class="item-image"
                style="--item-img: url({item.img}); --item-border-color: {itemBorderColor};"
                class:special-rarity={showRarityBoxShadow}
              >
                <span class="roll-prompt">
                  <i class="fa fa-dice-d20" />
                </span>
              </button>
              {#if ('containerContents' in ctx && !!ctx.containerContents) || item?.system.activities?.contents.length > 1}
                <button
                  type="button"
                  class="expand-indicator-button"
                  on:click={() => inlineToggleService.toggle(tabId, item.id)}
                >
                  <i
                    class="fa-solid fa-angle-right expand-indicator"
                    class:expanded={$inlineContainerToggleServiceStore
                      .get(tabId)
                      ?.has(item.id)}
                  >
                  </i>
                </button>
              {/if}
              <button
                type="button"
                class="item-name truncate"
                on:click={(ev) => toggleSummary()}
              >
                <span class="truncate">{item.name}</span>
              </button>
            </TidyTableCell>
            <TidyTableCell baseWidth={quantityBaseWidth}>
              {item.system.quantity}
            </TidyTableCell>
            <TidyTableCell baseWidth={weightBaseWidth}>
              {weight}
            </TidyTableCell>
            <TidyTableCell baseWidth={actionsBaseWidth} class="item-actions">
              {#if unlocked}
                <button type="button" class="item-action inline-icon-button">
                  <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="item-action inline-icon-button">
                  <i class="fas fa-trash"></i>
                </button>
              {/if}
              <button type="button" class="item-action inline-icon-button">
                <i class="fas fa-ellipsis-vertical"></i>
              </button>
            </TidyTableCell>
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

          {#if i !== lastItemIndex}
            <hr class="table-row-divider" />
          {/if}
        {/each}
      </svelte:fragment>
    </TidyTable>
  {/if}
{/each}
