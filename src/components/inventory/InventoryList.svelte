<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item';
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
  import ItemUses from '../items/ItemUses.svelte';
  import ItemAddUses from '../items/ItemAddUses.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import ItemControls from '../items/ItemControls.svelte';
  import ItemDuplicateControl from '../items/ItemDuplicateControl.svelte';
  import ItemDeleteControl from '../items/ItemDeleteControl.svelte';
  import ItemEditControl from '../items/ItemEditControl.svelte';
  import InventoryEquipControl from './InventoryEquipControl.svelte';
  import InventoryAttuneControl from './InventoryAttuneControl.svelte';
  import type { CharacterSheetContext } from 'src/types/types';

  export let section: any;
  export let items: Item5e[];
  export let context: CharacterSheetContext;

  const localize = FoundryAdapter.localize;
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');
  const classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';

  const hideIconsNextToTheItemName =
    SettingsProvider.settings.hideIconsNextToTheItemName.get();
  const classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();

  function getInventoryRowClasses(item: Item5e, section: any) {
    const itemClasses: string[] = [];

    if (section.css) {
      itemClasses.push(section.css);
    }

    if (
      /* Compatibility: Magic Items https://foundryvtt.com/packages/magicitems/ */
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
        {localize(section.label)} ({items.length})
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
          <ItemTableCell primary={true} title={item.name}>
            <ItemUseButton {item} />
            <ItemName
              on:click={(event) => toggleSummary(event.detail, context.actor)}
            >
              {item.name}
            </ItemName>
            <!-- AMMO <span class="ammo" data-id="{{item._id}}"></span>  -->
            <!-- 
              Quantity (on hover by default; static by setting)  
              <span class="item-quantity{{#if item.isStack}} isStack{{/if}}">
                (<input class="item-count" name="system.quantity" type="text" value="{{item.system.quantity}}" maxlength="3" >)
              </span>
            -->
          </ItemTableCell>
          {#if !hideIconsNextToTheItemName}
            <ItemTableCell>
              {#if ctx.attunement}
                <div class="item-detail attunement">
                  <i
                    class="item-state-icon fas {ctx.attunement.icon} {ctx
                      .attunement.cls}"
                    title={localize(ctx.attunement.title)}
                  />
                </div>
              {/if}
            </ItemTableCell>
            {#if FoundryAdapter.tryGetFlag(item, 'favorite')}
              <div class="item-state-icon" title="Favorite">
                <i class="fas fa-bookmark icon-fav" />
              </div>
            {/if}
          {/if}
          <ItemTableCell
            baseWidth="2.5rem"
            title="{localize('DND5E.Weight')}: {item.system
              .weight} {context.weightUnit}"
          >
            {#if ctx.totalWeight}
              {ctx.totalWeight} {context.weightUnit}
            {:else}
              {item.system.weight} {context.weightUnit}
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="3.125rem" title={localize('DND5E.Uses')}>
            {#if ctx?.hasUses}
              <ItemUses {item} />
            {:else}
              <ItemAddUses {item} />
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="7.5rem" title={localize('DND5E.Usage')}>
            {#if item.system.activation?.type}
              {item.labels.activation}
            {/if}
          </ItemTableCell>
          {#if context.owner && classicControlsEnabled}
            <ItemTableCell baseWidth={classicControlsBaseWidth}>
              <ItemControls>
                {#if ctx.attunement}
                  <InventoryAttuneControl {item} {ctx} />
                {:else}
                  <!-- <span /> -->
                {/if}
                <InventoryEquipControl {item} {ctx} />
                <ItemEditControl {item} />
                {#if allowEdit}
                  <ItemDuplicateControl {item} />
                  <ItemDeleteControl {item} />
                {/if}
              </ItemControls>
            </ItemTableCell>
          {/if}
        </ItemTableRow>
      </ItemContext>
    {/each}
    {#if context.owner && allowEdit}
      <ItemTableFooter actor={context.actor} dataset={section.dataset} />
    {/if}
  </ItemTable>
</section>

<style lang="scss">
  .inventory-list-section {
    :global(.equipped) {
      background: var(--t5e-equipped);
    }

    :global(.magic-item) {
      box-shadow: 0 0 0 1px var(--t5e-faint-magic-accent) inset;
    }

    // TODO: This style is generally applicable across the entire app.
    .not-attuned {
      color: var(--t5e-attunement-required);
    }

    .item-detail.attunement {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.25rem;
    }
  }
</style>
