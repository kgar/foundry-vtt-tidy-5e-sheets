<script lang="ts">
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { CharacterItemContext, InventorySection } from 'src/types/types';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import ItemTableRowV2 from 'src/components/item-list/v2/ItemTableRowV2.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import InlineFavoriteIcon from 'src/components/item-list/InlineFavoriteIcon.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import CapacityBar from 'src/sheets/container/CapacityBar.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
    import { InlineContainerService } from 'src/features/inline-container/InlineContainerService';

  export let inventory: InventorySection[];
  export let item: Item5e;
  export let editable: boolean;
  // TODO: Use context API to generate visible item ID subset based on search criteria and the items this component knows about
  export let itemContext: Record<string, CharacterItemContext>;
  export let inlineContainerService: InlineContainerService;
  export let lockItemQuantity: boolean;

  const classicControls = [
    {
      component: ItemEditControl,
      getProps: (item: Item5e) => ({ item }),
    },
    {
      component: ItemDeleteControl,
      getProps: (item: Item5e) => ({
        item,
        deleteFn: () => item.deleteDialog(),
      }),
    },
  ];

  const weightUnit = FoundryAdapter.getWeightUnit();

  const classicControlWidthRems = 1.5;

  $: useClassicControls = FoundryAdapter.useClassicControls(item);

  $: classicControlsWidth = useClassicControls
    ? `/* Controls */ ${classicControlWidthRems * classicControls.length}rem`
    : '';

  $: gridTemplateColumns = `/* Name */ 1fr /* Weight */ 3rem /* Quantity */ 3rem ${classicControlsWidth}`;

  const localize = FoundryAdapter.localize;
</script>

{#each inventory as section (section.key)}
  {#if section.show}
    <section
      class="container-contents-list-section"
      style="--grid-template-columns: {gridTemplateColumns};"
    >
      <TidyTable key={section.key}>
        <svelte:fragment slot="header">
          <TidyTableHeaderRow>
            <TidyTableHeaderCell primary={true}>
              {localize(section.label)} ({section.items.length})
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
        </svelte:fragment>
        <svelte:fragment slot="body">
          {#each section.items as item (item.id)}
            {@const ctx = itemContext[item.id]}
            {@const weight = ctx?.totalWeight ?? item.system.weight.value}
            <!-- TODO: Figure out how to include container contents (recursively) into search -->
            {@const hidden = false}
            <!-- visibleItemIdSubset !== null &&
                !visibleItemIdSubset.has(item.id)} -->
            <ItemTableRowV2
              {item}
              {hidden}
              rowClass={FoundryAdapter.getInventoryRowClasses(
                item,
                itemContext[item.id],
              )}
              let:toggleSummary
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                uuid: item.uuid,
              }}
            >
              <TidyTableCell class="flex-row extra-small-gap">
                <ItemUseButton
                  disabled={!FoundryAdapter.canUseItem(item)}
                  {item}
                />
                {#if 'containerContents' in ctx && !!ctx.containerContents}
                  <button
                    type="button"
                    class="inline-transparent-button"
                    on:click={() => inlineContainerService.toggle(item.id)}
                  >
                    {#if inlineContainerService.$store.has(item.id)}
                      <i class="fa-solid fa-box-open fa-fw" />
                    {:else}
                      <i class="fa-solid fa-box fa-fw" />
                    {/if}
                  </button>
                {/if}
                <!-- This is generally what we want in Tidy Tables / Item Table V2; consider breaking of ItemNameV2 to propagate and replace the old ItemName gradually. -->
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
                    />
                  {/if}
                {/if}
                {#if !!ctx.favoriteId}
                  <InlineFavoriteIcon />
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
                    <svelte:component
                      this={control.component}
                      {...control.getProps(item)}
                    ></svelte:component>
                  {/each}
                </TidyTableCell>
              {/if}
            </ItemTableRowV2>
            {#if 'containerContents' in ctx && !!ctx.containerContents}
              <ExpandableContainer
                expanded={inlineContainerService.$store.has(item.id)}
              >
                <div
                  style="flex: 1; padding: 0.25rem 0 0.5rem 1rem; margin-left: 1rem; border-left: 0.0625rem dotted var(--t5e-separator-color);"
                  class="flex-column extra-small-gap"
                >
                  <CapacityBar
                    container={item}
                    capacity={ctx.containerContents.capacity}
                  />
                  <!-- <Currency document={item} /> -->
                  <svelte:self
                    inventory={ctx.containerContents?.inventory ?? []}
                    {item}
                    {editable}
                    {itemContext}
                    {lockItemQuantity}
                  />
                </div>
              </ExpandableContainer>
            {/if}
          {/each}
        </svelte:fragment>
      </TidyTable>
    </section>
  {/if}
{/each}
