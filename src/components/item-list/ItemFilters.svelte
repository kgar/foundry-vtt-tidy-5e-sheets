<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<!-- 
  TODO: Rework ItemFilters to be conceptually the TabContentToolbar 
  It should 
  - Provide a search (input[type="search"]) on the left that flexes to consume all unused space
  - various commands after the search (extendable by modules via API, gradually shrinking search)
  - Expand All / Collapse All
  - Filter funnel w/ menu for filters in A5e style; start with initial set of filters but also with exclude as an option; cycle forward with left click and backward with right click
  - Grid layout toggle

  The controls should all be data-driven. There should be some internal flag to denote the module-provided ones.
-->
<div class="item-filters flex-row justify-content-space-between {$$props.class ?? ''}">
  <div class="left-side-controls flex-row small-gap">
    <slot name="left-side-controls" />
  </div>
  <ul class="filter-list">
    <li class="filter-title" title={localize('DND5E.Filter')}>
      <i class="fas fa-filter" />
    </li>
    <slot />
  </ul>
</div>

<style lang="scss">
  .item-filters {
    margin: 0 0.875rem 0.5rem 0;
    flex: 0 0 1.1875rem;
    border-bottom: 0.0625rem solid var(--t5ek-separator-color);

    .filter-list {
      max-width: initial;
      display: flex;
      justify-content: flex-end;

      .filter-title {
        font-size: 0.75rem;
        line-height: 1.125rem;
        color: var(--t5ek-secondary-color);
        align-self: center;
      }
    }
  }
</style>
