<script lang="ts">
  import { type Snippet } from 'svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    open?: boolean;
    header?: Snippet;
    children?: Snippet;
    [key: string]: any;
  }

  let { open = $bindable(false), header, children, ...rest }: Props = $props();
</script>

<section class="accordion-item {rest.class ?? ''}">
  <h2 class="accordion-item-header" class:open>
    <a
      class="accordion-item-toggle"
      type="button"
      onclick={() => (open = !open)}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
    >
      <span class="accordion-arrow" class:open
        ><i class="fas fa-chevron-right"></i></span
      >
      {@render header?.()}
    </a>
  </h2>

  <ExpandableContainer expanded={open}>
    <div class="accordion-item-content">
      {@render children?.()}
    </div>
  </ExpandableContainer>
</section>
