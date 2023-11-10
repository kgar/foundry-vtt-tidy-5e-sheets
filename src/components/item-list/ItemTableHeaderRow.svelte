<header class="item-table-header-row">
  <slot />
</header>

<style lang="scss">
  .item-table-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.125rem;
    padding: 0.25rem 0 0.125rem 0.375rem;
    line-height: 0.75rem;
    font-size: 0.75rem;
    background: var(--t5ek-faint-color);
    box-shadow: 0 0 0.1875rem inset var(--t5ek-light-color);
    border-radius: 0.3125rem;
  }
</style>
