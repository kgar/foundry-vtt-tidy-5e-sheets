<script lang="ts">
  import { CONSTANTS } from 'src/constants';
</script>

<section
  class="utility-toolbar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.UTILITY_TOOLBAR}
>
  <slot />
</section>

<style lang="scss">
  .utility-toolbar {
    --vertical-padding: 0.375rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    border-bottom: 0.0625rem solid var(--t5e-separator-color);
    margin-bottom: 0.25rem;
    margin-left: -1rem;
    margin-right: -0.25rem;
    margin-top: calc(var(--vertical-padding) - var(--t5e-tab-padding-top));
    padding-bottom: var(--vertical-padding);
    padding-left: 1rem;
    padding-right: 1.75rem;
  }
</style>
