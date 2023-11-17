<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { AccordionCtxType } from './Accordion.svelte';
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';

  export let open: boolean = false;

  const ctx = getContext<AccordionCtxType>('ctx') ?? {};

  const self = {};
  const selected = ctx.selected ?? writable();

  function toggle() {
    selected.set(open ? {} : self);
  }

  onMount(() => {
    return selected.subscribe((x) => (open = x === self));
  });
</script>

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

<div class="accordion-item-content" class:closed={!open}>
  <slot />
</div>

<style lang="scss">
  .accordion-item-content {
    max-height: 100%;
    max-width: 100%;
    transition: max-height 0.3s ease;
    overflow: hidden;

    &.closed {
      max-height: 0;
    }
  }

  .accordion-item-toggle {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .accordion-arrow {
    font-size: 0.75rem;
    transition: transform 0.2s;

    &.open {
      transform: rotate(90deg);
    }
  }
</style>
