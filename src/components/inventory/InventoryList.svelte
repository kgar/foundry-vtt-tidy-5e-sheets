<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import type { ItemStub } from 'src/types/types';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import ItemTableFooter from '../items/ItemTableFooter.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemContext from '../items/ItemContext.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';
  import ItemUseButton from '../items/ItemUseButton.svelte';
  import ItemName from '../items/ItemName.svelte';
  import { CONSTANTS } from 'src/constants';

  export let section: any;
  export let items: ItemStub[];
  export let context: CharacterSheetContext;

  const localize = FoundryAdapter.localize;
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');
  const classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';

  function getInventoryRowClasses(item: ItemStub, section: any) {
    const itemClasses: string[] = [];

    if (section.css) {
      itemClasses.push(section.css);
    }

    if (
      FoundryAdapter.getProperty(item, 'flags.magicitems.enabled') ||
      FoundryAdapter.getProperty(item, 'system.properties.mgc')
    ) {
      itemClasses.push('magic-item');
    }

    if (item?.attunement?.cls) {
      itemClasses.push(item.attunement.cls);
    }

    if (item?.system?.equipped) {
      itemClasses.push('equipped');
    }

    return itemClasses.join(' ');
  }
</script>

<section class="inventory-list-section">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize(section.label)}
      </ItemTableColumn>
      <ItemTableColumn
        title="{localize('DND5E.Weight')} ({context.weightUnit})"
        baseWidth="2.5rem"
      >
        <i class="fas fa-weight-hanging" />
      </ItemTableColumn>
      <ItemTableColumn title={localize('DND5E.Charges')} baseWidth="3.125rem">
        <i class="fas fa-bolt" />
      </ItemTableColumn>
      <ItemTableColumn baseWidth="7.5rem">
        {localize('DND5E.Usage')}
      </ItemTableColumn>
      <ItemTableColumn baseWidth={classicControlsBaseWidth} />
    </ItemTableHeaderRow>
    {#each items as item}
      <ItemContext {item} itemContext={context.itemContext} let:ctx>
        <ItemTableRow
          {item}
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event.detail, item)}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            id: item.id,
          }}
          let:toggleSummary
          cssClass={getInventoryRowClasses(item, section)}
        >
          <ItemTableCell primary={true}>
            <ItemUseButton {item} />
            <ItemName
              on:click={(event) => toggleSummary(event.detail, context.actor)}
            >
              {item.name}
            </ItemName>
          </ItemTableCell>
          <ItemTableCell baseWidth="2.5rem" />
          <ItemTableCell baseWidth="3.125rem" />
          <ItemTableCell baseWidth="7.5rem" />
          <ItemTableCell baseWidth={classicControlsBaseWidth} />
        </ItemTableRow>
      </ItemContext>
    {/each}
    {#if context.owner && allowEdit}
      <ItemTableFooter actor={context.actor} dataset={section.dataset} />
    {/if}
  </ItemTable>
</section>
