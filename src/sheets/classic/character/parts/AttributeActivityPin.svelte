<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ActivityUseButton from 'src/components/item-list/ActivityUseButton.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import { CONSTANTS } from 'src/constants';
  import { AttributePins } from 'src/features/attribute-pins/AttributePins';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { AttributeActivityPinContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { EventHelper } from 'src/utils/events';
  import { coalesce } from 'src/utils/formatting';

  interface Props {
    ctx: AttributeActivityPinContext;
  }

  let { ctx }: Props = $props();

  let img = $derived(
    ctx.document.img ===
      ctx.document.documentConfig?.[ctx.document.type]?.documentClass?.metadata
        ?.img
      ? ctx.document.item.img
      : ctx.document.img,
  );

  let { usesDocument, value, maxText, uses } = $derived.by(() => {
    const uses = ctx.document.uses;

    return {
      usesDocument: ctx.document,
      uses: uses,
      value: (uses.max ?? 0) - uses.spent,
      maxText: isNil(uses.max, '') ? '—' : uses.max.toString(),
    };
  });

  function saveValueChange(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement },
  ): boolean {
    FoundryAdapter.handleDocumentUsesChanged(
      ev,
      usesDocument,
      'uses.value',
      'uses.spent',
      'uses.max',
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
  data-item-id={ctx.document.item.id}
  data-activity-id={ctx.document.id}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
  data-info-card={'activity'}
  data-info-card-entity-uuid={ctx.document.uuid}
  data-configurable="true"
  data-pin-id={ctx.id}
  onmousedown={(ev) => FoundryAdapter.editOnMiddleClick(ev, ctx.document)}
  ondragstart={onDragStart}
>
  <div class="attribute-document-image">
    <ActivityUseButton activity={ctx.document} {img} />
  </div>
  <div class="attribute-pin-details">
    <div
      class="attribute-pin-name-container"
      title="{ctx.document.name} | {ctx.document.item.name}"
    >
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
        <div class="attribute-pin-name truncate">
          {coalesce(ctx.alias, ctx.document.name)}
        </div>
      {/if}
    </div>
    <div class="attribute-counter {ctx.resource}">
      {#if ctx.resource === 'limited-uses' && ctx.document.isOnCooldown}
        <RechargeControl document={ctx.document} field="uses.spent" {uses} />
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
          field="uses.spent"
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
      onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-activity-id]')}
    >
      <i class="fas fa-ellipsis-vertical"></i>
    </a>
  {/if}
</div>
