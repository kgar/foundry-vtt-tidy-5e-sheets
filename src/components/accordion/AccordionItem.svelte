<script lang="ts">
  import { getContext, onMount, type Snippet } from 'svelte';
  import type { AccordionCtxType } from './Accordion.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    open?: boolean;
    header?: Snippet;
    children?: Snippet;
    [key: string]: any;
  }

  let { open = $bindable(false), header, children, ...rest }: Props = $props();

  // kgar-migration-task - accordion items are not registering as open when initializing. Figure this one out.
  const ctx = getContext<AccordionCtxType>(
    CONSTANTS.SVELTE_CONTEXT.ACCORDION_CONTEXT,
  );

  const self = foundry.utils.randomID();

  function toggle() {
    ctx.selected = open ? {} : self;
  }

  $effect(() => {
    if (!ctx.multiple) {
      return;
    }

    open = ctx.selected === self;
  });

  onMount(() => {
    if (open) {
      ctx.selected = self;
    }
  });
</script>

<section class="accordion-item {rest.class ?? ''}">
  <h2 class="accordion-item-header" class:open>
    <button
      class="accordion-item-toggle transparent-button"
      type="button"
      onclick={() => toggle()}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
      tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <span class="accordion-arrow" class:open
        ><i class="fas fa-chevron-right"></i></span
      >
      {@render header?.()}
    </button>
  </h2>

  <ExpandableContainer expanded={open}>
    <div class="accordion-item-content">
      {@render children?.()}
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
