<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { AccordionCtxType } from './Accordion.svelte';
  import { writable } from 'svelte/store';
  import { settingStore } from 'src/settings/settings';

  export let open: boolean = false;

  const ctx = getContext<AccordionCtxType>('ctx') ?? {};

  const self = {};
  const selected = ctx.selected ?? writable();

  function toggle() {
    selected.set(open ? {} : self);
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
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <span class="accordion-arrow" class:open
        ><i class="fas fa-chevron-right" /></span
      >
      <slot name="header" />
    </button>
  </h2>

  <div
    class="accordion-item-content-animation-wrapper"
    class:open
    role="presentation"
  >
    <div class="accordion-item-content" class:open>
      <slot />
    </div>
  </div>
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

  .accordion-item-content-animation-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    &.open {
      grid-template-rows: 1fr;
    }
    transition: grid-template-rows 0.2s ease;
  }

  .accordion-item-content {
    overflow-y: hidden;
    padding-left: 0.25rem;

    &.hidden {
      display: none;
    }
  }
</style>
