<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { Actor5e, InventorySection } from 'src/types/types';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getContext, type Component, type ComponentProps } from 'svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import InlineContainerView from './InlineContainerView.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import InlineItemQuantityTracker from 'src/components/trackers/InlineItemQuantityTracker.svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

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

  const searchResults = getSearchResultsContext();

  // TODO: File away
  type TidyTableAction<T extends Component<any>> = {
    component: T;
    props: (doc: any) => ComponentProps<T>;
  };

  let itemActions: TidyTableAction<any>[] = $derived.by(() => {
    let result: TidyTableAction<any>[] = [];

    if (unlocked) {
      result.push({
        component: EditButton,
        props: (doc: any) => ({ doc }),
      } satisfies TidyTableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (doc: any) => ({
          doc,
          deleteFn: () => doc.deleteDialog(),
        }),
      } satisfies TidyTableAction<typeof DeleteButton>);
    }

    return result;
  });

  let columnSpecs = $derived({
    charges: {
      columnWidth: '5rem',
    },
    price: {
      columnWidth: '5rem',
      hideUnder: 550,
    },
    quantity: {
      columnWidth: '5rem',
      hideUnder: 400,
    },
    weight: {
      columnWidth: '5rem',
      hideUnder: 500,
    },
    actions: {
      columnWidth: `calc(var(--t5e-table-button-width) * ${1 + itemActions.length})`,
    },
  });

  let containerToggleMap = $derived(inlineToggleService.map);

  const localize = FoundryAdapter.localize;
</script>

{#each configuredContents as section (section.key)}
  {@const itemEntries = section.items.map((item) => ({
    item,
    ctx: itemContext[item.id],
  }))}

  {#if section.show}
    <TidyTable
      key={section.key}
      data-custom-section={section.custom ? true : null}
    >
      {#snippet header()}
        <TidyTableHeaderRow class="dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            <span class="table-header-count">{section.items.length}</span>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell {...columnSpecs.charges}>
            {localize('DND5E.Charges')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell {...columnSpecs.price}>
            {localize('DND5E.Price')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell {...columnSpecs.quantity}>
            {localize('DND5E.Quantity')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell {...columnSpecs.weight}>
            {localize('DND5E.Weight')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            class="header-cell-actions"
            {...columnSpecs.actions}
          >
            <!-- Actions -->
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each itemEntries as { item, ctx }, i (item.id)}
          {@const weight = ctx?.totalWeight ?? item.system.weight.value}
          {@const itemBorderColor = item.system.rarity
            ? `var(--t5e-color-rarity-${item.system.rarity.slugify()})`
            : 'var(--t5e-color-gold)'}
          {@const showRarityBoxShadow = [
            'veryRare',
            'legendary',
            'artifact',
          ].includes(item.system.rarity)}

          <TidyItemTableRow
            {item}
            hidden={!searchResults.show(item.uuid)}
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
              <a
                class="tidy-table-button item-use-button"
                style="--item-border-color: {itemBorderColor};"
                class:special-rarity={showRarityBoxShadow}
                onclick={(ev) => FoundryAdapter.actorTryUseItem(item, ev)}
              >
                {#if item.img?.endsWith('.svg')}
                  <Dnd5eIcon class="item-image" src={item.img} />
                {:else}
                  <img class="item-image" alt="" src={item.img} />
                {/if}
                <span class="roll-prompt">
                  <i class="fa fa-dice-d20"></i>
                </span>
              </a>
              <TidyTableCell primary={true} class="item-label text-cell">
                {#if 'containerContents' in ctx && !!ctx.containerContents}
                  <a
                    class="expand-indicator-button"
                    onclick={() => inlineToggleService.toggle(tabId, item.id)}
                  >
                    <i
                      class="fa-solid fa-angle-right expand-indicator"
                      class:expanded={containerToggleMap
                        .get(tabId)
                        ?.has(item.id)}
                    >
                    </i>
                  </a>
                {/if}
                <a class="item-name" onclick={(ev) => toggleSummary()}>
                  <span class="cell-name">{item.name}</span>
                </a>
              </TidyTableCell>
              <TidyTableCell {...columnSpecs.charges}
                >Charges here</TidyTableCell
              >
              <TidyTableCell {...columnSpecs.price}>Price here</TidyTableCell>
              <TidyTableCell {...columnSpecs.quantity}>
                <InlineItemQuantityTracker {item} disabled={!item.isOwner} />
              </TidyTableCell>
              <TidyTableCell {...columnSpecs.weight}>
                {weight}
              </TidyTableCell>
              <TidyTableCell
                class="tidy-table-actions"
                {...columnSpecs.actions}
              >
                {#if unlocked}
                  {#each itemActions as action}
                    {@const props = action.props(item)}
                    <action.component {...props} />
                  {/each}
                {/if}
                <MenuButton targetSelector="[data-item-id]" />
              </TidyTableCell>
            {/snippet}
          </TidyItemTableRow>

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
          {/if}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}
{/each}
