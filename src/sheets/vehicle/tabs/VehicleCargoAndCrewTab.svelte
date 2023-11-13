<script lang="ts">
  import ItemTable from 'src/components/item-list/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/ItemTableColumn.svelte';
  import ItemTableRow from 'src/components/item-list/ItemTableRow.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/ItemTableHeaderRow.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CargoOrCrewItem, VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';
  import ItemTableCell from 'src/components/item-list/ItemTableCell.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import ListItemQuantity from '../../actor/ListItemQuantity.svelte';
  import ItemTableFooter from 'src/components/item-list/ItemTableFooter.svelte';
  import Notice from 'src/components/notice/Notice.svelte';
  import Currency from '../../actor/Currency.svelte';
  import EncumbranceBar from '../../actor/EncumbranceBar.svelte';
  import TabFooter from '../../actor/TabFooter.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemDuplicateControl from 'src/components/item-list/controls/ItemDuplicateControl.svelte';
  import ItemEditControl from 'src/components/item-list/ItemEditControl.svelte';
  import ItemControls from 'src/components/item-list/ItemControls.svelte';
  import type { ItemCardContentComponent } from 'src/types/item';
  import InventoryItemCardContent from 'src/components/item-info-card/InventoryItemCardContent.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  $: noCargoOrCrew =
    $context.cargo.some((section: any) => section.items.length > 0) === false;

  let baseWidths: Record<string, string> = {
    quantity: '5rem',
    price: '4.375rem',
    weight: '3.75rem',
  };

  let columnsToSkipForClickableRows = ['system.quantity'];

  const localize = FoundryAdapter.localize;

  async function onItemCreate(type: string) {
    const actor = $context.actor;
    if (type === 'crew' || type === 'passengers') {
      const cargo = foundry.utils.deepClone(actor.system.cargo[type]);
      cargo.push(FoundryAdapter.getNewCargo());
      return actor.update({ [`system.cargo.${type}`]: cargo });
    }
    return FoundryAdapter.createItem({ type }, actor);
  }

  function saveSection(
    ev: Event & { currentTarget: HTMLInputElement },
    index: number,
    field: keyof CargoOrCrewItem,
    section: {
      dataset: { type: 'crew' | 'passenger' };
      items: CargoOrCrewItem[];
    }
  ) {
    const cargo = foundry.utils.deepClone(
      $context.actor.system.cargo[section.dataset.type]
    );

    const value = ev.currentTarget.value;

    const item = cargo[index];

    if (item) {
      item[field] = ev.currentTarget.type === 'number' ? Number(value) : value;

      $context.actor.update({
        [`system.cargo.${section.dataset.type}`]: cargo,
      });
    }

    return false;
  }

  $: classicControlsBaseWidth = $context.editable ? '7.5rem' : '4.375rem';
  $: classicControlsEditableRowBaseWidth = '4.375rem';

  function deleteCrewOrPassenger(section: any, index: number) {
    const cargo = foundry.utils
      .deepClone($context.actor.system.cargo[section.dataset.type])
      .filter((_: unknown, i: number) => i !== index);

    $context.actor.update({
      [`system.cargo.${section.dataset.type}`]: cargo,
    });

    return false;
  }

  const itemCardTemplates: Record<string, ItemCardContentComponent> = {
    loot: InventoryItemCardContent,
  };
</script>

{#if noCargoOrCrew && !$context.editable}
  <Notice>
    {localize('T5EK.EmptySection')}
  </Notice>
{/if}

<div class="scroll-container flex-column small-gap">
  {#each $context.cargo as section}
    {@const cardTemplate = itemCardTemplates[section.dataset.type] ?? null}
    {#if $context.editable || section.items.length}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(section.label)}
          </ItemTableColumn>
          {#each section.columns as column}
            {#if section.editableName || !columnsToSkipForClickableRows.includes(column.property)}
              <ItemTableColumn
                cssClass="items-header-{column.css}"
                baseWidth={baseWidths[column.property] ?? '3.125rem'}
              >
                {column.label}
              </ItemTableColumn>
            {/if}
          {/each}
          {#if $context.owner && ((!section.editableName && $context.classicControlsEnabled) || ($context.editable && section.editableName))}
            <ItemTableColumn
              baseWidth={section.editableName
                ? classicControlsEditableRowBaseWidth
                : classicControlsBaseWidth}
            />
          {/if}
        </ItemTableHeaderRow>
        {#each section.items as item, index (item.id ?? index)}
          {@const ctx = $context.itemContext[item.id]}
          <ItemTableRow
            let:toggleSummary
            on:mousedown={(event) =>
              FoundryAdapter.editOnMiddleClick(event.detail, item)}
            contextMenu={section.editableName
              ? null
              : {
                  type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                  id: item.id,
                }}
            {item}
            cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
            itemCardContentTemplate={cardTemplate}
          >
            <ItemTableCell primary={true}>
              {#if section.editableName}
                <TextInput
                  document={item}
                  field="name"
                  selectOnFocus={true}
                  onSaveChange={(ev) => saveSection(ev, index, 'name', section)}
                  value={item.name}
                  cssClass="editable-name"
                  disabled={!$context.owner}
                />
              {:else}
                <ItemUseButton {item} />
                <ItemName
                  on:toggle={() => toggleSummary($context.actor)}
                  cssClass="extra-small-gap"
                  {item}
                >
                  <span class="truncate">{item.name}</span>
                  <ListItemQuantity {item} {ctx} />
                </ItemName>
              {/if}
            </ItemTableCell>
            {#if section.columns}
              {#each section.columns as column}
                {#if section.editableName || !columnsToSkipForClickableRows.includes(column.property)}
                  {@const isNumber = column.editable === 'Number'}
                  {@const fallback = isNumber ? '0' : ''}
                  {@const value =
                    FoundryAdapter.getProperty(
                      item,
                      column.property
                    )?.toString() ??
                    FoundryAdapter.getProperty(
                      ctx,
                      column.property
                    )?.toString() ??
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
                        onSaveChange={(ev) =>
                          saveSection(ev, index, column.property, section)}
                        disabled={!$context.owner ||
                          (column.property === 'quantity' &&
                            $context.lockItemQuantity)}
                      />
                    {:else}
                      {FoundryAdapter.getProperty(item, column.property) ??
                        FoundryAdapter.getProperty(ctx, column.property) ??
                        fallback}
                    {/if}
                  </ItemTableCell>
                {/if}
              {/each}
            {/if}
            {#if $context.owner && ((!section.editableName && $context.classicControlsEnabled) || ($context.editable && section.editableName))}
              <ItemTableCell
                baseWidth={section.editableName
                  ? classicControlsEditableRowBaseWidth
                  : classicControlsBaseWidth}
              >
                <ItemControls>
                  {#if !section.editableName}
                    <ItemEditControl {item} />
                  {/if}

                  {#if $context.editable && !section.editableName}
                    <ItemDuplicateControl {item} />
                  {/if}

                  {#if $context.editable}
                    <ItemDeleteControl
                      onDelete={() =>
                        !section.editableName ||
                        deleteCrewOrPassenger(section, index)}
                      {item}
                    />
                  {/if}
                </ItemControls>
              </ItemTableCell>
            {/if}
          </ItemTableRow>
        {/each}
        {#if $context.editable && section.dataset}
          <ItemTableFooter
            actor={$context.actor}
            dataset={section.dataset}
            create={() => onItemCreate(section.dataset.type)}
          />
        {/if}
      </ItemTable>
    {/if}
  {/each}
</div>

<TabFooter mode="vertical">
  <div class="currency">
    <Currency actor={$context.actor} />
  </div>

  {#if $settingStore.useVehicleEncumbranceBar}
    <EncumbranceBar />
  {/if}
</TabFooter>

<style lang="scss">
  :global(.tidy5e-kgar.vehicle input.editable-name) {
    padding: 0 0.25rem;
  }
</style>
