<script lang="ts">
  import { toNumber } from 'src/utils/numbers';

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
</script>

{#if editable}
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
  />
{:else}
  <svelte:element this={element} class={cssClass} {title}
    >{value}</svelte:element
  >
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
      color: var(--t5ek-tertiary-color);
    }
  }
</style>
