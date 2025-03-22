<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    RenderableClassicControl,
    VehicleCargoSection,
  } from 'src/types/types';
  import { getContext } from 'svelte';
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
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import InlineContainerView from 'src/sheets/classic/container/InlineContainerView.svelte';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    section: VehicleCargoSection;
  }

  let { section }: Props = $props();

  let context = $derived(getVehicleSheetContext());

  let itemEntries = $derived(
    section.items.map((item) => ({ item, ctx: context.itemContext[item.id] })),
  );

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let baseWidths: Record<string, string> = {
    quantity: '5rem',
    price: '4.375rem',
    weight: '3.75rem',
  };

  let controls: RenderableClassicControl<{ item: Item5e }>[] = $derived.by(
    () => {
      let result: RenderableClassicControl<{ item: Item5e }>[] = [
        {
          component: ItemEditControl,
          props: ({ item }) => ({
            item,
          }),
        },
      ];

      if (context.unlocked) {
        result.push({
          component: ItemDeleteControl,
          props: ({ item }) => ({
            item,
          }),
        });
      }

      if (context.useActionsFeature) {
        result.push({
          component: ActionFilterOverrideControl,
          props: ({ item }) => ({
            item,
          }),
        });
      }

      return result;
    },
  );

  let classicControlsIconWidth = 1.25;

  let classicControlsColumnWidth = $derived(
    `${classicControlsIconWidth * controls.length}rem`,
  );

  const localize = FoundryAdapter.localize;
</script>

<ItemTable key={section.key}>
  {#snippet header()}
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize(section.label)}
        <span class="item-table-count">{section.items.length}</span>
      </ItemTableColumn>
      {#each section.columns as column}
        <ItemTableColumn
          cssClass="items-header-{column.css}"
          baseWidth={baseWidths[column.property] ?? '3.125rem'}
        >
          {column.label}
        </ItemTableColumn>
      {/each}
      {#if context.editable && context.useClassicControls}
        <ItemTableColumn baseWidth={classicControlsColumnWidth} />
      {/if}
    </ItemTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each itemEntries as { item, ctx }, index (item.id ?? index)}
      <ItemTableRow
        onMouseDown={(event) => FoundryAdapter.editOnMiddleClick(event, item)}
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
                    disabled={!context.editable ||
                      (column.property === 'quantity' &&
                        context.lockItemQuantity)}
                  />
                {:else}
                  {FoundryAdapter.getProperty(item, column.property) ??
                    FoundryAdapter.getProperty(ctx, column.property) ??
                    fallback}
                {/if}
              </ItemTableCell>
            {/each}
          {/if}
          {#if context.editable && context.useClassicControls}
            <ItemTableCell baseWidth={classicControlsColumnWidth}>
              <ClassicControls {controls} params={{ item: item }} />
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
    {#if context.unlocked && section.dataset}
      <ItemTableFooter
        actor={context.actor}
        {section}
        create={() =>
          FoundryAdapter.createItem(
            { type: section.dataset.type },
            context.actor,
          )}
        isItem={section.dataset.type !== 'crew' &&
          section.dataset.type !== 'passengers'}
      />
    {/if}
  {/snippet}
</ItemTable>
