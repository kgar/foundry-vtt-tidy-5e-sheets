<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetClassicContext,
    ItemSheetContext,
  } from 'src/types/item.types';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { toNumber } from 'src/utils/numbers';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let element: keyof HTMLElementTagNameMap;
  export let document: any;
  export let field: string;
  export let value: string;
  export let editable: boolean;
  export let cssClass: string = '';
  export let spellcheck: boolean = false;
  export let dataMaxLength: number = 40;
  export let placeholder: string | null = null;
  export let saveAs: 'string' | 'number' = 'string';
  export let title: string | null = null;
  export let selectOnFocus: boolean = false;

  $: draftValue = value;

  async function update() {
    if (draftValue.length > dataMaxLength) {
      draftValue = draftValue.substring(0, dataMaxLength);
    }

    const valueToSave = saveAs === 'number' ? toNumber(draftValue) : draftValue;

    const result = await document.update({ [field]: valueToSave });

    if (!result) {
      draftValue = value;
    }
  }

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      update();
    }
  }

  let _el: HTMLElement;

  // [contenteditable] pasting can include HTML
  // Only the text content is appropriate for this component
  function handlePaste() {
    setTimeout(() => {
      value = _el.textContent ?? '';
    }, 0);
  }

  function onFocus(ev: Event & { currentTarget: HTMLElement }) {
    if (selectOnFocus && window.getSelection) {
      const selection = window.getSelection();
      const range = window.document.createRange();
      range.selectNodeContents(ev.currentTarget);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  const context =
    getContext<
      Readable<
        | CharacterSheetContext
        | NpcSheetContext
        | VehicleSheetContext
        | ContainerSheetClassicContext
        | ItemSheetContext
      >
    >('context');

  $: activeEffectApplied = ActiveEffectsHelper.isActiveEffectAppliedToField(
    document,
    field,
  );

  $: isEnchanted =
    $context.itemOverrides instanceof Set && $context.itemOverrides.has(field);

  $: overrideTooltip = isEnchanted
    ? localize('DND5E.ENCHANTMENT.Warning.Override')
    : localize('DND5E.ActiveEffectOverrideWarning');

  const localize = FoundryAdapter.localize;
</script>

{#if editable && !activeEffectApplied}
  <svelte:element
    this={element}
    bind:this={_el}
    contenteditable="true"
    class={cssClass}
    bind:innerHTML={draftValue}
    on:blur={update}
    on:keypress={submitWhenEnterKey}
    on:paste={handlePaste}
    on:focus={onFocus}
    role="textbox"
    tabindex="0"
    {spellcheck}
    data-max-length={dataMaxLength}
    data-placeholder={placeholder}
    {title}
    data-tidy-field={field}
  />
{:else}
  <svelte:element
    this={element}
    class={cssClass}
    {title}
    data-tidy-field={field}
    data-tooltip={activeEffectApplied ? overrideTooltip : null}
  >
    {value}
  </svelte:element>
{/if}

<style lang="scss">
  [contenteditable] {
    border: none;
    outline: none;
    border-radius: 0.1875rem;
    -moz-user-select: text;
    -khtml-user-select: text;
    -webkit-user-select: text;
    -o-user-select: text;
    user-select: text;

    &:empty::before {
      content: attr(data-placeholder);
      pointer-events: none;
      display: block; // For Firefox
      color: var(--t5e-tertiary-color);
    }
  }
</style>
