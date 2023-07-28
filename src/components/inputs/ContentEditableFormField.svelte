<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import { afterUpdate, getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let element: keyof HTMLElementTagNameMap;
  export let fieldName: string;
  export let value: string;
  export let editable: boolean;
  export let cssClass: string = '';
  export let spellcheck: boolean = false;
  export let dataMaxLength: number = 40;

  let store = getContext<Readable<ActorSheetContext>>('store');

  function update() {
    $store.actor.update({ [fieldName]: value });
  }

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      update();
    }
  }
</script>

{#if editable}
  <svelte:element
    this={element}
    contenteditable="true"
    class={cssClass}
    bind:textContent={value}
    on:blur={update}
    on:keypress={submitWhenEnterKey}
    role="textbox"
    tabindex="0"
    {spellcheck}
    data-max-length={dataMaxLength}
  />
{:else}
  <svelte:element this={element} class={cssClass} />
{/if}
