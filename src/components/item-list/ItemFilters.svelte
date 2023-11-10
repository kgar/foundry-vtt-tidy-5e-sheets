<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<div class="item-filters">
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
    border-bottom: 0.0625rem solid var(--t5ek-light-color);

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
