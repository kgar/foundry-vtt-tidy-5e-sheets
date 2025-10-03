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

  let isSpell = $derived(ctx.document.type === CONSTANTS.ITEM_TYPE_SPELL);
  let spellMethod = $derived(FoundryAdapter.getSpellMethodConfig(ctx.document));
  let spellMethodIcon = $derived(FoundryAdapter.getSpellIcon(ctx.document));

  let localize = FoundryAdapter.localize;
</script>

<div
  role="button"
  tabindex="0"
  class="sheet-pin"
  data-tidy-draggable
  data-item-id={ctx.document.id}
  data-info-card={'item'}
  data-info-card-entity-uuid={ctx.document.uuid}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-pin-id={ctx.id}
  onmousedown={(ev) => FoundryAdapter.editOnMiddleClick(ev, ctx.document)}
  ondragstart={onDragStart}
>
  <div class="pin-document-image">
    <a
      role="button"
      tabindex="0"
      class={['tidy-table-row-use-button', { disabled: !context.editable }]}
      onclick={(ev) =>
        context.editable && FoundryAdapter.actorTryUseItem(ctx.document, ev)}
      onkeydown={(ev) =>
        ev.key === 'Enter' || ev.key === ' ' && context.editable && FoundryAdapter.actorTryUseItem(ctx.document, ev)}
      aria-label={ctx.document.name}
    >
      <img class="item-image" alt={ctx.document.name} src={ctx.document.img} />
      <span class="roll-prompt">
        <i class={[isSpell ? spellMethodIcon : "fa fa-dice-d20"]}></i>
      </span>
    </a>
  </div>
  <!-- TODO: Save alias changes. -->
  <!-- TODO: Drag and drop to the pins list without removing from sections. -->
  <!-- TODO: Figure out layout in edit mode. Bigger cards? -->
  <div class="pin-details">
    <div class="pin-name-container" title={ctx.document.name}>
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
        <div class="font-label-medium pin-name truncate" title={ctx.document.name}>
          {coalesce(ctx.alias, ctx.document.name)}
        </div>
      {/if}
    </div>
    <!-- TODO: 
     * Hide if 0 max charges.
     * Hide if innate/atwill spell slot.
     * Switch to spell slot uses if spell.
     * Switch spell slots to pips if active?
    -->
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
      {:else if isSpell}
        {#if spellMethod.key !== CONSTANTS.SPELL_PREPARATION_METHOD_INNATE && spellMethod.key !== CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL}
        <span class="inline-uses spell-slots">
          <span class="spell-slots-value">{value}</span>
            <span class="divider">/</span>
            <span class="spell-slots-max">{maxText}</span>
          </span>
        {/if}
      {:else if ctx.resource === 'limited-uses'}
        <span class="inline-uses">
          <TextInput
            class={["uninput uses-value", { diminished: value < 1 }, { centered: isSpell }]}
            document={usesDocument}
            field={spentProp}
            {value}
            onSaveChange={(ev) => saveValueChange(ev)}
            selectOnFocus={true}
          />
          {#if !isSpell}
            <span class="divider">/</span>
            <span class="uses-max">{maxText}</span>
          {/if}
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
      class="sheet-pins-menu highlight-on-hover"
      onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-item-id]')}
    >
      <i class="fas fa-ellipsis-vertical"></i>
    </a>
  {/if}
</div>
