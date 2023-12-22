<script lang="ts">
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import type { AccordionCtxType } from './Accordion.svelte';
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import { quadInOut } from 'svelte/easing';

  export let open: boolean = false;

  const dispatcher = createEventDispatcher<{
    open: void;
  }>();

  const ctx = getContext<AccordionCtxType>('ctx') ?? {};

  const self = {};
  const selected = ctx.selected ?? writable();

  function toggle() {
    selected.set(open ? {} : self);
    if ($selected === self) {
      dispatcher('open');
    }
  }

  onMount(() => {
    if (open) {
      $selected = self;
    }
    return selected.subscribe((x) => (open = x === self));
  });
</script>

<section class="accordion-item {$$props.class ?? ''}">
  <h2 class="accordion-item-header" class:open>
    <button
      class="accordion-item-toggle transparent-button"
      type="button"
      on:click={() => toggle()}
    >
      <span class="accordion-arrow" class:open
        ><i class="fas fa-chevron-right" /></span
      >
      <slot name="header" />
    </button>
  </h2>

  {#if open}
    <div
      class="accordion-item-content"
      transition:slide={{ duration: 200, easing: quadInOut }}
    >
      <slot />
    </div>
  {:else}
    <div class="accordion-item-content hidden">
      <slot />
    </div>
  {/if}
</section>

<style lang="scss">
  .accordion-item {
    margin-block-end: 0.5rem;
  }

  .accordion-item-header {
    padding: 0.25rem;
    background-color: var(--t5ek-table-header-row-color);
    margin: 0;
    border: 0.0625rem solid var(--t5ek-table-header-row-color);
    border-radius: 0.1875rem;
  }

  .accordion-item-toggle {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    .accordion-arrow {
      font-size: 0.75rem;
      transition: transform 0.2s;

      &.open {
        transform: rotate(90deg);
      }
    }
  }

  .accordion-item-content {
    overflow-y: hidden;
    padding-left: 0.25rem;

    &.hidden {
      display: none;
    }
  }
</style>
