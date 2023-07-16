<script lang="ts">
  import type { SheetFunctions } from 'src/types/types';

  export let sheetFunctions: SheetFunctions;
  export let setName: string;
  export let filterName: string;
</script>

<li
  role="button"
  class="filter-option"
  class:active={sheetFunctions.isFilterActive(setName, filterName)}
  on:click|preventDefault|stopPropagation={() =>
    sheetFunctions.onToggleFilter(setName, filterName)}
>
  <slot />
</li>

<style lang="scss">
  .filter-option {
    font-size: 0.75rem;
    padding: 0 0.5rem;
    margin-left: 0.125rem;
    flex: unset;
    cursor: pointer;
    border-bottom: 0.1875rem solid var(--t5e-light-color);

    &:hover {
      border-bottom: 0.1875rem solid var(--t5e-tertiary-color);
    }

    &.active {
      border-bottom: 0.1875rem solid var(--t5e-primary-color);
    }
  }
</style>
