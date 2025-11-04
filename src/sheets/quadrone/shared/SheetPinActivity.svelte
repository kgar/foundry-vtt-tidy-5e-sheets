<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { SheetPinActivityContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { EventHelper } from 'src/utils/events';
  import { coalesce } from 'src/utils/formatting';

  interface Props {
    ctx: SheetPinActivityContext;
  }

  let { ctx }: Props = $props();

  let isEditing = $state(false);

  // If the activity is using its default icon, fall back to the item's image instead.
  let img = $derived(
    ctx.document.img ===
      ctx.document.documentConfig?.[ctx.document.type]?.documentClass?.metadata
        ?.img
      ? ctx.document.item.img
      : ctx.document.img,
  );

  let { usesDocument, value, maxText } = $derived.by(() => {
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

  let isSpell = $derived(ctx.document.type === CONSTANTS.ITEM_TYPE_SPELL);
  let spellMethodIcon = $derived(FoundryAdapter.getSpellIcon(ctx.document));

  function getType() {
    if (isSpell) {
      let spellMethod = FoundryAdapter.getSpellMethodConfig(ctx.document);

      if (
        spellMethod.key !== CONSTANTS.SPELL_PREPARATION_METHOD_INNATE &&
        spellMethod.key !== CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL
      ) {
        return 'spell-slots';
      }
      return 'none';
    }
    if (ctx.document.uses.max) {
      return 'limited-uses';
    }
    return 'none';
  }
  let pinType = $derived(getType());

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
      data-has-roll-modes
    >
      <img class="item-image" alt={ctx.document.name} src={img} />
      <span class="roll-prompt">
        <i class="fa fa-dice-d20"></i>
      </span>
    </a>
  </div>
  <div class="pin-details">
    {#if context.unlocked && isEditing}
      <div
        class="pin-name-container flexrow"
        title="{ctx.document.name} | {ctx.document.item.name}"
      >
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
      <div
        class="pin-name-container flexrow"
        title="{ctx.document.name} | {ctx.document.item.name}"
      >
        {#if context.unlocked}
          <span class="font-label-medium pin-name truncate flex1">
            {coalesce(ctx.alias, ctx.document.name)}
          </span>
          <button
            class="button button-borderless button-icon-only flexshrink edit-name-button"
            onclick={(ev) => {
              isEditing = true;
              return false;
            }}
          >
            <i class="fa-solid fa-pencil"></i>
          </button>
        {:else}
          <span class="font-label-medium pin-name truncate">
            {coalesce(ctx.alias, ctx.document.name)}
          </span>
        {/if}
      </div>
      <div class="pin-context {ctx.resource}">
        {#if pinType === 'limited-uses'}
          <span class="inline-uses">
            <TextInput
              class={['uninput uses-value', { diminished: value < 1 }]}
              document={usesDocument}
              field="uses.spent"
              {value}
              onSaveChange={(ev) => saveValueChange(ev)}
              selectOnFocus={true}
            />
            <span class="divider">/</span>
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
        {:else if pinType === 'none'}
          <span class="subtitle font-default-medium color-text-lighter"
            >{ctx.document.parent.parent.name}</span
          >
        {/if}
      </div>
    {/if}
  </div>
  {#if context.unlocked && !isEditing}
    <a
      class="button button-icon-only button-borderless"
      onclick={(ev) => EventHelper.triggerContextMenu(ev, '[data-activity-id]')}
    >
      <i class="fas fa-ellipsis-vertical"></i>
    </a>
  {/if}
</div>
