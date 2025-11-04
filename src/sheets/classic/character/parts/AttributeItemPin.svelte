<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { AttributePins } from 'src/features/attribute-pins/AttributePins';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { AttributeItemPinContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { EventHelper } from 'src/utils/events';
  import { coalesce } from 'src/utils/formatting';

  interface Props {
    ctx: AttributeItemPinContext;
  }

  let { ctx }: Props = $props();

  let { usesDocument, valueProp, spentProp, maxProp, value, maxText, uses } =
    $derived.by(() => {
      if (ctx.linkedUses) {
        return {
          usesDocument: ctx.linkedUses.doc,
          maxProp: ctx.linkedUses.maxProp,
          maxText: isNil(ctx.linkedUses.max, '')
            ? '—'
            : ctx.linkedUses.max.toString(),
          spentProp: ctx.linkedUses.spentProp,
          uses: ctx.linkedUses,
          value: ctx.linkedUses.value,
          valueProp: ctx.linkedUses.valueProp,
        };
      }

      const primaryActivity = ctx.document.system.activities?.contents[0];
      const usePrimaryActivity =
        ctx.document.system.uses.max === '' &&
        !isNil(primaryActivity?.uses?.max, '');
      const uses = usePrimaryActivity
        ? primaryActivity.uses
        : ctx.document.system.uses;

      return {
        usesDocument: usePrimaryActivity ? primaryActivity : ctx.document,
        uses: uses,
        value: (uses.max ?? 0) - uses.spent,
        maxText: isNil(uses.max, '') ? '—' : uses.max.toString(),
        valueProp: usePrimaryActivity ? 'uses.value' : 'system.uses.value',
        spentProp: usePrimaryActivity ? 'uses.spent' : 'system.uses.spent',
        maxProp: usePrimaryActivity ? 'uses.max' : 'system.uses.max',
      };
    });

  function saveValueChange(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement },
  ): boolean {
    FoundryAdapter.handleDocumentUsesChanged(
      ev,
      usesDocument,
      valueProp,
      spentProp,
      maxProp,
    );
    return false;
  }

  function onDragStart(event: DragEvent) {
    const dragData = ctx.document.toDragData?.();

    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
  }

  let context = $derived(getCharacterSheetContext());

  let localize = FoundryAdapter.localize;
</script>

<div
  class="attribute-pin"
  data-tidy-draggable
  data-item-id={ctx.document.id}
  data-info-card={'item'}
  data-info-card-entity-uuid={ctx.document.uuid}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-pin-id={ctx.id}
  onmousedown={(ev) => FoundryAdapter.editOnMiddleClick(ev, ctx.document)}
  ondragstart={onDragStart}
>
  <div class="attribute-document-image">
    <ItemUseButton item={ctx.document} />
  </div>
  <div class="attribute-pin-details">
    <div class="attribute-pin-name-container" title={ctx.document.name}>
      {#if context.unlocked}
        <TextInput
          class="attribute-pin-name"
          document={ctx.document}
          field="name"
          value={ctx.alias}
          selectOnFocus={true}
          placeholder={ctx.document.name}
          onSaveChange={(ev) => {
            AttributePins.setAlias(ctx.document, ev.currentTarget.value);
            return false;
          }}
        />
        {#if !isNil(ctx.alias?.trim(), '')}
          <i class="fa-solid fa-pencil"></i>
        {/if}
      {:else}
        <div class="attribute-pin-name truncate" title={ctx.document.name}>
          {coalesce(ctx.alias, ctx.document.name)}
        </div>
      {/if}
    </div>
    <div class="attribute-counter {ctx.resource}">
      {#if ctx.resource === 'limited-uses' && ctx.document.isOnCooldown}
        <RechargeControl document={ctx.document} field={spentProp} {uses} />
      {:else if ctx.resource === 'limited-uses' && ctx.document.hasRecharge}
        <span class="charged-text">
          {#if value > 1}
            <span>{value}</span>
          {/if}
          <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
        </span>
      {:else if ctx.resource === 'limited-uses'}
        <TextInput
          document={usesDocument}
          field={spentProp}
          {value}
          onSaveChange={(ev) => saveValueChange(ev)}
          selectOnFocus={true}
        />
        <span class="divider">/</span>
        <span class="max">{maxText}</span>
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
