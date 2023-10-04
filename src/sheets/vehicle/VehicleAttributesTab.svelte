<script lang="ts">
  import { getContext } from 'svelte';
  import Traits from '../actor/Traits.svelte';
  import VehicleAttributes from './parts/VehicleAttributes.svelte';
  import type { Readable } from 'svelte/store';
  import type { VehicleSheetContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTable from 'src/components/items/ItemTable.svelte';
  import ItemTableHeaderRow from 'src/components/items/ItemTableHeaderRow.svelte';
  import ItemTableColumn from 'src/components/items/ItemTableColumn.svelte';
  import ItemTableRow from 'src/components/items/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/items/ItemTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemName from 'src/components/items/ItemName.svelte';
  import ItemUseButton from 'src/components/items/ItemUseButton.svelte';
  import ListItemQuantity from '../actor/ListItemQuantity.svelte';
  import ItemTableFooter from 'src/components/items/ItemTableFooter.svelte';
  import ItemUses from 'src/components/items/ItemUses.svelte';
  import ItemAddUses from 'src/components/items/ItemAddUses.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import ItemControls from 'src/components/items/ItemControls.svelte';
  import ItemDuplicateControl from 'src/components/items/ItemDuplicateControl.svelte';
  import ItemDeleteControl from 'src/components/items/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/items/ItemEditControl.svelte';
  import ItemControl from 'src/components/items/ItemControl.svelte';
  import Notice from 'src/components/shared/Notice.svelte';
  import ItemHpBar from '../item/parts/ItemHpBar.svelte';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  let baseWidths: Record<string, string> = {
    cover: '3.125rem',
    'system.quantity': '4.375rem',
    'system.armor.value': '2.5rem',
    'system.hp.value': '4.375rem',
    threshold: '2.5rem',
  };

  let columnsToSkip = ['system.quantity'];

  let alternateColumnHeaderContent: Record<string, string> = {
    threshold: `<i class="fas fa-heart-crack" title="${localize(
      'DND5E.Threshold'
    )}"></i>`,
  };

  const controlsBaseWidthLocked: string = '5.3125rem';
  const controlsBaseWidthUnlocked: string = '7.5rem';

  $: classicControlsBaseWidth = $store.editable
    ? controlsBaseWidthUnlocked
    : controlsBaseWidthLocked;

  $: noFeatures = !$store.features.some((section: any) => section.items.length);
</script>

<div class="attributes-tab-contents">
  <div class="side-panel">
    <VehicleAttributes />
    <Traits
      toggleable={true}
      useSenses={false}
      enableSpecialTraitsConfiguration={false}
    />
  </div>
  <div class="main-panel flex-column small-gap">
    {#if noFeatures && !$store.editable}
      <Notice>
        {localize('T5EK.EmptySection')}
      </Notice>
    {:else}
      {#each $store.features as section}
        {#if $store.editable || section.items.length}
          <ItemTable>
            <ItemTableHeaderRow>
              <ItemTableColumn primary={true}>
                {localize(section.label)}
              </ItemTableColumn>
              {#if section.hasActions}
                <ItemTableColumn baseWidth="3.125rem">
                  {localize('DND5E.Uses')}
                </ItemTableColumn>
                <ItemTableColumn baseWidth="7.5rem">
                  {localize('DND5E.Usage')}
                </ItemTableColumn>
              {/if}
              {#if section.columns}
                {#each section.columns as column}
                  {#if !columnsToSkip.includes(column.property)}
                    <ItemTableColumn
                      cssClass="items-header-{column.css}"
                      baseWidth={baseWidths[column.property] ?? '3.125rem'}
                    >
                      {#if alternateColumnHeaderContent[column.property]}
                        {@html alternateColumnHeaderContent[column.property]}
                      {:else}
                        {column.label}
                      {/if}
                    </ItemTableColumn>
                  {/if}
                {/each}
              {/if}
              {#if $store.owner}
                <ItemTableColumn baseWidth={classicControlsBaseWidth} />
              {/if}
            </ItemTableHeaderRow>
            {#each section.items as item (item.id)}
              {@const ctx = $store.itemContext[item.id]}
              <ItemTableRow
                let:toggleSummary
                on:mousedown={(event) =>
                  FoundryAdapter.editOnMiddleClick(event.detail, item)}
                contextMenu={{
                  type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                  id: item.id,
                }}
                {item}
                cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
              >
                <ItemTableCell primary={true}>
                  <ItemUseButton {item} />
                  <ItemName
                    on:click={(event) =>
                      toggleSummary(event.detail, $store.actor)}
                    cssClass="extra-small-gap"
                  >
                    <span class="truncate">{item.name}</span>
                    <ListItemQuantity {item} {ctx} />
                  </ItemName>
                </ItemTableCell>
                {#if section.hasActions}
                  <ItemTableCell baseWidth="3.125rem">
                    {#if ctx?.isOnCooldown}
                      <a
                        title={item.labels.recharge}
                        role="button"
                        tabindex="0"
                        on:click={() => item.rollRecharge()}
                      >
                        <i class="fas fa-dice-six" />
                        {item.system.recharge
                          .value}{#if item.system.recharge?.value !== 6}+{/if}</a
                      >
                    {:else if item.system.recharge?.value}
                      <i
                        class="fas fa-bolt"
                        title={localize('DND5E.Charged')}
                      />
                    {:else if ctx?.hasUses}
                      <ItemUses {item} />
                    {:else}
                      <ItemAddUses {item} />
                    {/if}
                  </ItemTableCell>
                  <ItemTableCell baseWidth="7.5rem">
                    {#if item.system.activation.type}
                      <span>{item.labels.activation}</span>
                    {/if}
                  </ItemTableCell>
                {/if}
                {#if section.columns}
                  {#each section.columns as column}
                    {#if column.property === 'system.hp.value'}
                      <!-- TODO: Extract to its own component; formalize this feature of overriding specific columns based on property matching -->
                      <ItemTableCell baseWidth="4.375rem">
                        <div
                          class="item-hp"
                          title={localize('DND5E.HitPoints')}
                        >
                          <ItemHpBar {item} />
                          <TextInput
                            cssClass="hp-min"
                            document={item}
                            field="system.hp.value"
                            value={item.system.hp.value}
                            placeholder="0"
                            title={localize('DND5E.HitPointsCurrent')}
                            dtype="Number"
                            allowDeltaChanges={true}
                            maxlength={5}
                            ariaDescribedBy="tooltip"
                            selectOnFocus={true}
                            disabled={!$store.editable}
                          />
                          <span class="value-seperator sep"> / </span>
                          <TextInput
                            cssClass="hp-max"
                            document={item}
                            field="system.hp.max"
                            value={item.system.hp.max}
                            placeholder="0"
                            title={localize('DND5E.HitPointsMax')}
                            dtype="Number"
                            allowDeltaChanges={true}
                            maxlength={5}
                            ariaDescribedBy="tooltip"
                            selectOnFocus={true}
                            disabled={!$store.editable ||
                              $store.lockSensitiveFields}
                          />
                        </div>
                      </ItemTableCell>
                    {:else if !columnsToSkip.includes(column.property)}
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
                            dtype={column.editable}
                            allowDeltaChanges={isNumber}
                            selectOnFocus={true}
                            {value}
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
                {#if $store.owner}
                  <ItemTableCell baseWidth={classicControlsBaseWidth}>
                    <ItemControls>
                      <ItemControl
                        iconCssClass="fas fa-user-alt {ctx.toggleClass}"
                        title={ctx.toggleTitle}
                        active={ctx.toggleClass === 'active'}
                        on:click={(ev) =>
                          item.update({
                            ['system.crewed']: !item.system.crewed,
                          })}
                      />
                      <ItemEditControl {item} />
                      {#if $store.editable}
                        <ItemDuplicateControl {item} />
                        <ItemDeleteControl {item} />
                      {/if}
                    </ItemControls>
                  </ItemTableCell>
                {/if}
              </ItemTableRow>
            {/each}
            {#if $store.editable && section.dataset}
              <ItemTableFooter actor={$store.actor} dataset={section.dataset} />
            {/if}
          </ItemTable>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  .attributes-tab-contents {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding-right: 0.75rem;
    overflow-y: scroll;
    .side-panel {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 13.75rem;
    }

    .main-panel {
      flex: 1;
    }

    :global(.items-header-item-threshold) {
      align-self: flex-start;
    }

    :global(.item-table-cell .hp-min) {
      text-align: right;
    }

    :global(.item-table-cell .hp-max) {
      text-align: left;
    }

    .item-hp {
      align-self: center;
      position: relative;
      width: calc(100% - 0.25rem);
      margin-left: 0.125rem;
      margin-right: 0.125rem;
      height: 1.325rem;
      z-index: 20;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--t5ek-icon-background);
      box-shadow: 0 0 0.3125rem var(--t5ek-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5ek-icon-outline-color);

      :global(input.hp-min) {
        text-align: right;
      }

      :global(input.hp-max) {
        text-align: left;
      }

      :global(input.hp-max) {
        width: 100%;
      }
    }
  }
</style>
