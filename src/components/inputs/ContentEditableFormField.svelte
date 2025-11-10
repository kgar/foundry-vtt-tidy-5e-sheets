<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
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

  interface Props {
    element: keyof HTMLElementTagNameMap;
    document: any;
    field: string;
    value: string;
    editable: boolean;
    cssClass?: string;
    spellcheck?: boolean;
    dataMaxLength?: number;
    placeholder?: string | null;
    saveAs?: 'string' | 'number';
    title?: string | null;
    selectOnFocus?: boolean;
  }

  let {
    element,
    document,
    field,
    value,
    editable,
    cssClass = '',
    spellcheck = false,
    dataMaxLength = 40,
    placeholder = null,
    saveAs = 'string',
    title = null,
    selectOnFocus = false,
  }: Props = $props();

  let draftValue = $state('');

  $effect(() => {
    draftValue = value;
  });

  async function update() {
    draftValue =
      new DOMParser().parseFromString(draftValue, 'text/html').body
        .textContent ?? '';

    if (draftValue.length > dataMaxLength) {
      draftValue = draftValue.substring(0, dataMaxLength)?.replaceAll('\n', '');
    }

    const valueToSave = saveAs === 'number' ? toNumber(draftValue) : draftValue;

    await document.update({ [field]: valueToSave });
  }

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      update();
    }
  }

  // svelte-ignore non_reactive_update
  let _el: HTMLElement;

  // [contenteditable] pasting can include HTML
  // Only the text content is appropriate for this component
  function handlePaste(ev: ClipboardEvent) {
    setTimeout(() => {
      value = _el.textContent?.replaceAll('\n', '') ?? '';
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
    $derived(
      getSheetContext<
        | CharacterSheetContext
        | NpcSheetContext
        | VehicleSheetContext
        | ContainerSheetClassicContext
        | ItemSheetContext
      >(),
    );

  const localize = FoundryAdapter.localize;

  let activeEffectApplied = $derived(
    ActiveEffectsHelper.isActiveEffectAppliedToField(document, field),
  );
  let isEnchanted = $derived(
    'itemOverrides' in context &&
      context.itemOverrides instanceof Set &&
      context.itemOverrides.has(field),
  );
  let overrideTooltip = $derived(
    isEnchanted
      ? localize('DND5E.ENCHANTMENT.Warning.Override')
      : localize('DND5E.ActiveEffectOverrideWarning'),
  );
</script>

{#if editable && !activeEffectApplied}
  <svelte:element
    this={element}
    bind:this={_el}
    contenteditable="true"
    class={cssClass}
    bind:innerHTML={draftValue}
    onblur={update}
    onkeypress={submitWhenEnterKey}
    onpaste={handlePaste}
    onfocus={onFocus}
    role="textbox"
    tabindex="0"
    {spellcheck}
    data-max-length={dataMaxLength}
    data-placeholder={placeholder}
    {title}
    data-tidy-field={field}
  ></svelte:element>
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

<style lang="less">
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
