<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { FoundryDocument } from 'src/types/document';

  export let element: keyof HTMLElementTagNameMap;
  export let document: FoundryDocument;
  export let field: string;
  export let value: string;
  export let editable: boolean;
  export let cssClass: string = '';
  export let spellcheck: boolean = false;
  export let dataMaxLength: number = 40;
  export let placeholder: string | null = null;
  export let saveAs: 'string' | 'number' = 'string';

  let draftValue: string = value;

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

  function toNumber(str: string) {
    if (str.includes('/')) {
      const pieces = str.split('/');
      return parseInt(pieces[0]) / parseInt(pieces[1]);
    }
    return +str;
  }

  let _el: HTMLElement;

  // [contenteditable] pasting can include HTML
  // Only the text content is appropriate for this component
  function handlePaste() {
    setTimeout(() => {
      value = _el.textContent ?? '';
    }, 0);
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
    role="textbox"
    tabindex="0"
    {spellcheck}
    data-max-length={dataMaxLength}
    data-placeholder={placeholder}
  />
{:else}
  <svelte:element this={element} class={cssClass}>{value}</svelte:element>
{/if}

<style lang="scss">
  [contenteditable] {
    border: none;
    outline: none;
    border-radius: 3px;
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
      color: rebeccapurple;
    }
  }
</style>
