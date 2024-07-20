<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { AccordionCtxType } from './Accordion.svelte';
  import { writable } from 'svelte/store';
  import { settingStore } from 'src/settings/settings';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { CONSTANTS } from 'src/constants';

  export let open: boolean = false;

  const ctx = getContext<AccordionCtxType>(CONSTANTS.SVELTE_CONTEXT.ACCORDION_CONTEXT) ?? {};

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
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <span class="accordion-arrow" class:open
        ><i class="fas fa-chevron-right" /></span
      >
      <slot name="header" />
    </button>
  </h2>

  <ExpandableContainer expanded={open}>
    <div class="accordion-item-content">
      <slot />
    </div>
  </ExpandableContainer>
</section>

<style lang="scss">
  .accordion-item {
    margin-block-end: 0.5rem;
  }

  .accordion-item-header {
    padding: 0.25rem;
    background-color: var(--t5e-table-header-row-color);
    margin: 0;
    border: 0.0625rem solid var(--t5e-table-header-row-color);
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
    padding-left: 0.25rem;

    &.hidden {
      display: none;
    }
  }
</style>
