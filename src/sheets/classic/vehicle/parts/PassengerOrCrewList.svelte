<script lang="ts">
  import ItemTableFooter from 'src/components/item-list/ItemTableFooter.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    CargoOrCrewItem,
    RenderableClassicControl,
    VehicleCargoSection,
  } from 'src/types/types';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    section: VehicleCargoSection;
  }

  let { section }: Props = $props();

  let baseWidths: Record<string, string> = {
    quantity: '5rem',
    price: '4.375rem',
    weight: '3.75rem',
  };

  let context = $derived(getVehicleSheetContext());

  let itemEntries = $derived(
    section.items.map((item) => ({ item, ctx: context.itemContext[item.id] })),
  );

  const classicControlsEditableRowBaseWidth = '1.5rem';

  function saveNonItemSectionData(
    ev: Event & { currentTarget: HTMLInputElement },
    index: number,
    field: string,
    section: VehicleCargoSection,
  ) {
    const cargo = foundry.utils.deepClone(
      context.actor.system.cargo[section.dataset.type],
    );

    const value = ev.currentTarget.value;

    const item = cargo[index];

    if (item) {
      item[field] = ev.currentTarget.type === 'number' ? Number(value) : value;

      context.actor.update({
        [`system.cargo.${section.dataset.type}`]: cargo,
      });
    }

    return false;
  }

  function deleteCrewOrPassenger(section: VehicleCargoSection, index: number) {
    const cargo = foundry.utils
      .deepClone(context.actor.system.cargo[section.dataset.type])
      .filter((_: unknown, i: number) => i !== index);

    context.actor.update({
      [`system.cargo.${section.dataset.type}`]: cargo,
    });

    return false;
  }

  async function onItemCreate(type: string) {
    const actor = context.actor;
    const cargo = foundry.utils.deepClone(actor.system.cargo[type]);
    cargo.push(FoundryAdapter.getNewCargo());
    return actor.update({ [`system.cargo.${type}`]: cargo });
  }

  let controls: RenderableClassicControl<{
    item: CargoOrCrewItem;
    index: number;
    section: VehicleCargoSection;
  }>[] = $derived.by(() => {
    let result: RenderableClassicControl<{
      item: CargoOrCrewItem;
      index: number;
      section: VehicleCargoSection;
    }>[] = [];

    if (context.unlocked) {
      result.push({
        component: ItemDeleteControl,
        props: ({ item, index, section }) => ({
          onDelete: () => deleteCrewOrPassenger(section, index),
          item: item,
        }),
      });
    }

    return result;
  });

  const localize = FoundryAdapter.localize;
</script>

<div style="display: contents;" class="passenger-crew-list-container">
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
        {#if context.editable && context.unlocked}
          <ItemTableColumn baseWidth={classicControlsEditableRowBaseWidth} />
        {/if}
      </ItemTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each itemEntries as { item, ctx }, index (item.id ?? index)}
        <ItemTableRow>
          <ItemTableCell primary={true}>
            <TextInput
              document={item}
              field="name"
              selectOnFocus={true}
              onSaveChange={(ev) =>
                saveNonItemSectionData(ev, index, 'name', section)}
              value={item.name}
              class="editable-name"
              disabled={!context.editable}
              attributes={{ 'data-tidy-item-name': item.name }}
            />
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
                {#if column.editable && !item.id}
                  <TextInput
                    document={item}
                    field={column.property}
                    allowDeltaChanges={isNumber}
                    selectOnFocus={true}
                    {value}
                    onSaveChange={(ev) =>
                      saveNonItemSectionData(
                        ev,
                        index,
                        column.property,
                        section,
                      )}
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
          {#if context.editable && context.unlocked}
            <ItemTableCell baseWidth={classicControlsEditableRowBaseWidth}>
              <ClassicControls
                {controls}
                params={{ item: item, index: index, section: section }}
              />
            </ItemTableCell>
          {/if}
        </ItemTableRow>
      {/each}
      {#if context.unlocked && section.dataset}
        <ItemTableFooter
          actor={context.actor}
          {section}
          create={() => onItemCreate(section.dataset.type)}
          isItem={section.dataset.type !== 'crew' &&
            section.dataset.type !== 'passengers'}
        />
      {/if}
    {/snippet}
  </ItemTable>
</div>

<style lang="less">
  .passenger-crew-list-container :global(input.editable-name) {
    padding: 0 0.25rem;
  }
</style>
