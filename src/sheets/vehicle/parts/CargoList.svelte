<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    RenderableClassicControl,
    VehicleCargoSection,
    VehicleSheetContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import ItemTableFooter from 'src/components/item-list/ItemTableFooter.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import ActionFilterOverrideControl from 'src/components/item-list/controls/ActionFilterOverrideControl.svelte';
  import type { Item5e } from 'src/types/item.types';
  import ClassicControls from 'src/sheets/shared/ClassicControls.svelte';
  import type { InlineContainerService } from 'src/features/inline-container/InlineContainerService';
  import InlineContainerToggle from 'src/sheets/container/InlineContainerToggle.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import CapacityBar from 'src/sheets/container/CapacityBar.svelte';
  import ContainerContentsSections from 'src/sheets/container/ContainerContentsSections.svelte';

  export let section: VehicleCargoSection;

  let context = getContext<Readable<VehicleSheetContext>>('context');

  let inlineContainerService = getContext<InlineContainerService>(
    'inlineContainerService',
  );

  $: inlineContainerServiceStore = inlineContainerService.store;

  let baseWidths: Record<string, string> = {
    quantity: '5rem',
    price: '4.375rem',
    weight: '3.75rem',
  };

  let controls: RenderableClassicControl<{ item: Item5e }>[] = [];

  $: {
    controls = [
      {
        component: ItemEditControl,
        props: ({ item }) => ({
          item,
        }),
      },
    ];

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

  const localize = FoundryAdapter.localize;
</script>

<ItemTable key={section.key}>
  <svelte:fragment slot="header">
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize(section.label)}
      </ItemTableColumn>
      {#each section.columns as column}
        <ItemTableColumn
          cssClass="items-header-{column.css}"
          baseWidth={baseWidths[column.property] ?? '3.125rem'}
        >
          {column.label}
        </ItemTableColumn>
      {/each}
      {#if $context.editable && $context.useClassicControls}
        <ItemTableColumn baseWidth={classicControlsColumnWidth} />
      {/if}
    </ItemTableHeaderRow>
  </svelte:fragment>
  <svelte:fragment slot="body">
    {#each section.items as item, index (item.id ?? index)}
      {@const ctx = $context.itemContext[item.id]}
      <ItemTableRow
        let:toggleSummary
        on:mousedown={(event) =>
          FoundryAdapter.editOnMiddleClick(event.detail, item)}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
          uuid: item.uuid,
        }}
        {item}
        cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
      >
        <ItemTableCell primary={true}>
          <ItemUseButton disabled={!$context.editable} {item} />
          {#if 'containerContents' in ctx && !!ctx.containerContents}
            <InlineContainerToggle {item} {inlineContainerService} />
          {/if}
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
          </ItemName>
        </ItemTableCell>
        {#if section.columns}
          {#each section.columns as column}
            {@const isNumber = column.editable === 'Number'}
            {@const fallback = isNumber ? '0' : ''}
            {@const value =
              FoundryAdapter.getProperty(item, column.property)?.toString() ??
              FoundryAdapter.getProperty(ctx, column.property)?.toString() ??
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
                  disabled={!$context.editable ||
                    (column.property === 'quantity' &&
                      $context.lockItemQuantity)}
                />
              {:else}
                {FoundryAdapter.getProperty(item, column.property) ??
                  FoundryAdapter.getProperty(ctx, column.property) ??
                  fallback}
              {/if}
            </ItemTableCell>
          {/each}
        {/if}
        {#if $context.editable && $context.useClassicControls}
          <ItemTableCell baseWidth={classicControlsColumnWidth}>
            <ClassicControls {controls} params={{ item: item }} />
          </ItemTableCell>
        {/if}
      </ItemTableRow>
      {#if 'containerContents' in ctx && !!ctx.containerContents}
        <ExpandableContainer
          expanded={$inlineContainerServiceStore.has(item.id)}
        >
          <!-- TODO: Make sure this container contents shell gets reused -->
          <!-- TODO: For drag and drop, use the data-tidy-container-id to determine if an item drop also represents a container change -->
          <div
            style="flex: 1; padding: 0.25rem 0 0 1rem; margin-left: 1rem; border-left: 0.0625rem dotted var(--t5e-separator-color);"
            class="flex-column extra-small-gap"
            data-tidy-container-id={item.id}
          >
            <CapacityBar
              container={item}
              capacity={ctx.containerContents.capacity}
            />
            <!-- <Currency document={item} /> -->
            <ContainerContentsSections
              contents={ctx.containerContents.contents}
              container={item}
              editable={$context.editable}
              itemContext={ctx.containerContents.itemContext}
              lockItemQuantity={$context.lockItemQuantity}
              {inlineContainerService}
              sheetDocument={$context.actor}
            />
          </div>
        </ExpandableContainer>
      {/if}
    {/each}
    {#if $context.unlocked && section.dataset}
      <ItemTableFooter
        actor={$context.actor}
        {section}
        create={() =>
          FoundryAdapter.createItem(
            { type: section.dataset.type },
            $context.actor,
          )}
        isItem={section.dataset.type !== 'crew' &&
          section.dataset.type !== 'passengers'}
      />
    {/if}
  </svelte:fragment>
</ItemTable>
