<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { SheetPinItemContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { EventHelper } from 'src/utils/events';
  import { coalesce } from 'src/utils/formatting';
  import SpellPip from 'src/components/pips/SpellPip.svelte';

  interface Props {
    ctx: SheetPinItemContext;
  }

  let { ctx }: Props = $props();

  let isEditing = $state(false);

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

  let isSpell = $derived(ctx.document.type === CONSTANTS.ITEM_TYPE_SPELL);
  let spellMethodIcon = $derived(FoundryAdapter.getSpellIcon(ctx.document));
  let spellSlotTrackerMode = $derived(
    context.spellSlotTrackerMode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
      ? 'spell-slots-pips'
      : 'spell-slots',
  );
  let spellcastingSection = $derived(
    ctx.document.parent.system.spells['spell' + ctx.document.system.level],
  );

  let localize = FoundryAdapter.localize;

  function getType() {
    // Check for limited uses with recharge first (applies to any item type including spells)
    if (ctx.resource === 'limited-uses' && ctx.document.isOnCooldown) {
      return 'limited-uses-recharging';
    }
    if (ctx.resource === 'limited-uses' && ctx.document.hasRecharge) {
      return 'limited-uses-recharged';
    }

    // Then handle spell-specific slot tracking
    if (isSpell) {
      let spellMethod = FoundryAdapter.getSpellMethodConfig(ctx.document);

      if (
        spellMethod.key === CONSTANTS.SPELL_PREPARATION_METHOD_INNATE ||
        spellMethod.key === CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL
      ) {
        // If innate/at-will has limited uses, show them
        if (ctx.document.hasLimitedUses === true) {
          return 'limited-uses';
        }
        return 'none';
      }
      if (spellMethod.key === CONSTANTS.SPELL_PREPARATION_METHOD_PACT) {
        return 'spell-slots-pact';
      }
      return 'spell-slots';
    }

    // Handle other item types
    if (ctx.resource === 'quantity') {
      return 'quantity';
    }
    if (ctx.document.hasLimitedUses === true) {
      return 'limited-uses';
    }
    return 'none';
  }
  let pinType = $derived(getType());

  function onPipClick(index: number, section: any, slotKey: string) {
    if (!section) return;

    let isEmpty = index >= (section?.value ?? 0);
    let value = isEmpty ? index + 1 : index;

    context.actor.update({
      [`system.spells.${slotKey}.value`]: value,
    });
  }
</script>

{#snippet spellSlots(section: any, slotKey: string, cssClass: string)}
  {#if spellSlotTrackerMode === 'spell-slots'}
    <span class="inline-uses {cssClass}">
      <span class="{cssClass}-value">{section?.value}</span>
      <span class="divider">/</span>
      <span class="{cssClass}-max">{section?.max}</span>
    </span>
  {:else if spellSlotTrackerMode === 'spell-slots-pips'}
    <div class="pips spell-pips">
      {#each { length: section?.max ?? 0 }, index}
        <SpellPip
          uses={section?.value ?? 0}
          {index}
          temp={index >= section?.max}
          onclick={() =>
            context.editable && onPipClick(index, section, slotKey)}
        />
      {/each}
    </div>
  {/if}
{/snippet}

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
        ev.key === 'Enter' ||
        (ev.key === ' ' &&
          context.editable &&
          FoundryAdapter.actorTryUseItem(ctx.document, ev))}
      data-has-roll-modes
      aria-label={ctx.document.name}
    >
      <img class="item-image" alt={ctx.document.name} src={ctx.document.img} />
      <span class="roll-prompt">
        <i class={[isSpell ? spellMethodIcon : 'fa fa-dice-d20']}></i>
      </span>
    </a>
  </div>
  <!-- TODO: Save alias changes. -->
  <!-- TODO: Drag and drop to the pins list without removing from sections. -->
  <!-- TODO: Figure out layout in edit mode. Bigger cards? -->
  <div class="pin-details">
    {#if context.unlocked && isEditing}
      <div class="pin-name-container flexrow" title={ctx.document.name}>
        <TextInput
          class="pin-name"
          document={ctx.document}
          field="name"
          value={ctx.alias}
          selectOnFocus={true}
          placeholder={ctx.document.name}
          onSaveChange={(ev) => {
            SheetPinsProvider.setAlias(ctx.document, ev.currentTarget.value);
            return false;
          }}
        />
        <button
          type="button"
          class="button button-icon-only flexshrink save-name-button"
          aria-label="Save Alias"
          onclick={(ev) => {
            const input =
              ev.currentTarget.previousElementSibling?.querySelector('input');
            if (input) {
              SheetPinsProvider.setAlias(ctx.document, input.value);
            }
            isEditing = false;
            return false;
          }}
        >
          <i class="fa-solid fa-save"></i>
        </button>
      </div>
    {:else}
      <div class="pin-name-container flexrow" title={ctx.document.name}>
        {#if context.unlocked}
          <span class="font-label-medium pin-name truncate flex1">
            {coalesce(ctx.alias, ctx.document.name)}
          </span>
          <button
            aria-label="Edit Alias"
            class="button button-borderless button-icon-only flexshrink edit-name-button"
            onclick={(ev) => {
              isEditing = true;
              return false;
            }}
          >
            <i class="fa-solid fa-pencil"></i>
          </button>
        {:else}
          <span
            class="font-label-medium pin-name truncate"
            title={ctx.document.name}
          >
            {coalesce(ctx.alias, ctx.document.name)}
          </span>
        {/if}
      </div>
      <!-- TODO:
      * Hide if 0 max charges.
      * Hide if innate/atwill spell slot.
      * Switch to spell slot uses if spell.
      * Switch spell slots to pips if active?
      -->
      {#if pinType !== 'none'}
        <div class="pin-counter {ctx.resource}">
          {#if pinType === 'limited-uses-recharging'}
            <RechargeControl document={ctx.document} field={spentProp} {uses} />
          {:else if pinType === 'limited-uses-recharged'}
            <span class="inline-uses color-text-default charged-text">
              <TextInput
                class={['uninput uses-value', { diminished: value < 1 }]}
                document={usesDocument}
                field={spentProp}
                {value}
                onSaveChange={(ev) => saveValueChange(ev)}
                selectOnFocus={true}
              />
              <span class="divider color-text-gold-emphasis">/</span>
              <span class="uses-max">{maxText}</span>
              <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
            </span>
          {:else if pinType === 'spell-slots'}
            {@render spellSlots(
              spellcastingSection,
              `spell${ctx.document.system.level}`,
              'spell-slots',
            )}
          {:else if pinType === 'spell-slots-pact'}
            {@render spellSlots(
              ctx.document.parent.system.spells['pact'],
              'pact',
              'spell-slots-pact',
            )}
          {:else if pinType === 'limited-uses'}
            <span class="inline-uses color-text-default">
              <TextInput
                class={['uninput uses-value', { diminished: value < 1 }]}
                document={usesDocument}
                field={spentProp}
                {value}
                onSaveChange={(ev) => saveValueChange(ev)}
                selectOnFocus={true}
              />
              <span class="divider color-text-gold-emphasis">/</span>
              <span class="uses-max">{maxText}</span>
            </span>
          {:else if pinType === 'quantity'}
            <TextInput
              class={['uninput uses-value centered', { diminished: value < 1 }]}
              document={ctx.document}
              field={'system.quantity'}
              value={ctx.document.system.quantity}
              selectOnFocus={true}
            />
          {/if}
        </div>
      {:else if ctx.document.system.activities.size > 0}
        <div class="pin-counter {ctx.resource}">
          <span class="subtitle font-default-medium color-text-lighter"
            >{ctx.document.system.activities.size}
            {localize(
              ctx.document.system.activities.size === 1
                ? 'DND5E.ACTIVITY.Title.one'
                : 'DND5E.ACTIVITY.Title.other',
            )}</span
          >
        </div>
      {/if}
    {/if}
  </div>
  {#if context.unlocked && !isEditing}
    <a
      class="button button-icon-only button-borderless highlight-on-hover"
      onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-item-id]')}
    >
      <i class="fas fa-ellipsis-vertical"></i>
    </a>
  {/if}
</div>
