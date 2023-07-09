<script lang="ts">
  import type { SheetFunctions } from 'src/types/types';

  export let element: keyof HTMLElementTagNameMap;
  export let fieldName: string;
  export let value: string;
  export let editable: boolean;
  export let sheetFunctions: SheetFunctions;
  export let cssClass: string = '';
  export let spellcheck: boolean = false;
  export let dataMaxLength: number = 40;

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      sheetFunctions.submit();
    }
  }
</script>

{#if editable}
  <svelte:element
    this={element}
    contenteditable="true"
    class={cssClass}
    bind:textContent={value}
    on:blur={sheetFunctions.submit}
    on:keypress={submitWhenEnterKey}
    role="textbox"
    tabindex="0"
    {spellcheck}
    data-max-length={dataMaxLength}
  />
  <input type="hidden" name={fieldName} {value} />
{:else}
  <svelte:element this={element} class={cssClass} />
{/if}
