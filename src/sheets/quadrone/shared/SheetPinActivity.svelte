<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
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

  // If the activity is using its default icon, fall back to the item's image instead.
  let img = $derived(
    ctx.document.img ===
      ctx.document.documentConfig?.[ctx.document.type]?.documentClass?.metadata
        ?.img
      ? ctx.document.item.img
      : ctx.document.img,
  );

  let { usesDocument, valueProp, spentProp, maxProp, value, maxText, uses } =
    $derived.by(() => {
      const uses = ctx.document.uses;

      return {
        usesDocument: ctx.document,
        uses: uses,
        value: (uses.max ?? 0) - uses.spent,
        maxText: isNil(uses.max, '') ? '—' : uses.max.toString(),
        valueProp: 'uses.value',
        spentProp: 'uses.spent',
        maxProp: 'uses.max',
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
  role="button"
  tabindex="0"
  class="sheet-pin attribute-pin"
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
  <div class="pin-document-image">
    <a
      role="button"
      tabindex="0"
      class={['tidy-table-row-use-button', { disabled: !context.editable }]}
      onclick={(event) => context.editable && ctx.document.use({ event })}
    >
      <img class="item-image" alt={ctx.document.name} src={img} />
      <span class="roll-prompt">
        <i class="fa fa-dice-d20"></i>
      </span>
    </a>
  </div>
  <div class="pin-details">
    <div
      class="pin-name-container"
      title="{ctx.document.name} | {ctx.document.item.name}"
    >
      {#if context.unlocked}
        <TextInput
          class="pin-name"
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
        <div class="font-label-medium pin-name truncate">
          {coalesce(ctx.alias, ctx.document.name)}
        </div>
      {/if}
    </div>
    <div class="pin-counter {ctx.resource}">
      {#if ctx.resource === 'limited-uses' && ctx.document.isOnCooldown}
        <RechargeControl document={ctx.document} field={spentProp} {uses} />
      {:else if ctx.resource === 'limited-uses' && ctx.document.hasRecharge}
        <span class="charged-text">
          {#if value > 1}
            <span class="">{value}</span>
          {/if}
          <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
        </span>
      {:else if ctx.resource === 'limited-uses'}
        <span class="inline-uses">
          <TextInput
            class={["uninput uses-value", { diminished: value < 1 }]}
            document={usesDocument}
            field={spentProp}
            {value}
            onSaveChange={(ev) => saveValueChange(ev)}
            selectOnFocus={true}
          />
          <span class="divider">/</span>
          <span class="uses-max">{maxText}</span>
        </span>
      {:else if ctx.resource === 'quantity'}
        <TextInput
          class={["uninput uses-value centered", { diminished: value < 1 }]}
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
