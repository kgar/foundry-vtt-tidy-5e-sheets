<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
    import { CONSTANTS } from 'src/constants';
  import { AttributePins } from 'src/features/attribute-pins/AttributePins';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { AttributeItemPinContext } from 'src/types/types';
  import { EventHelper } from 'src/utils/events';

  interface Props {
    ctx: AttributeItemPinContext;
  }

  let { ctx }: Props = $props();

  let { usesDocument, valueProp, spentProp, maxProp, value, maxText, uses } =
    $derived.by(() => {
      const uses = ctx.document.system.uses;
      return {
        usesDocument: ctx.document,
        uses: uses,
        value: uses.max - uses.spent,
        maxText: uses.max === '' ? '—' : uses.max.toString(),
        valueProp: 'system.uses.value',
        spentProp: 'system.uses.spent',
        maxProp: 'system.uses.max',
      };
    });

  function saveValueChange(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement },
  ): boolean {
    FoundryAdapter.handleItemUsesChanged(
      ev,
      usesDocument,
      valueProp,
      spentProp,
      maxProp,
    );
    return false;
  }

  let context = $derived(getCharacterSheetContext());

  let localize = FoundryAdapter.localize;
</script>

<div
  class="attribute-pin"
  data-item-id={ctx.document.id}
  data-info-card={'item'}
  data-info-card-entity-uuid={ctx.document.uuid}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-attribute-item-pin
>
  <div class="attribute-item-image">
    <ItemUseButton item={ctx.document} />
  </div>
  <div class="attribute-pin-details">
    <div class="attribute-pin-name-container">
      {#if context.unlocked}
        <TextInput
          class="attribute-pin-name"
          document={ctx.document}
          field="name"
          value={ctx.document.name}
          selectOnFocus={true}
        />
      {:else}
        <div class="attribute-pin-name truncate">{ctx.document.name}</div>
      {/if}
    </div>
    <div class="attribute-counter {ctx.resource}">
      {#if ctx.resource === 'limited-uses' && ctx.document.isOnCooldown}
        <RechargeControl document={ctx.document} field={spentProp} {uses} />
      {:else if ctx.resource === 'limited-uses' && ctx.document.hasRecharge}
        {#if value > 1}
          <span>{value}</span>
        {/if}
        <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
      {:else if ctx.resource === 'limited-uses'}
        <TextInput
          document={usesDocument}
          field={spentProp}
          {value}
          onSaveChange={(ev) => saveValueChange(ev)}
          selectOnFocus={true}
        />
        /
        <span>{maxText}</span>
      {:else if ctx.resource === 'quantity'}
        <TextInput
          document={ctx.document}
          field={'system.quantity'}
          value={ctx.document.system.quantity}
          selectOnFocus={true}
        />
      {/if}
    </div>
  </div>
  {#if context.unlocked}
    <a
      class="attribute-pins-menu highlight-on-hover"
      onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-item-id]')}
    >
      <i class="fas fa-ellipsis-vertical"></i>
    </a>
  {/if}
</div>
