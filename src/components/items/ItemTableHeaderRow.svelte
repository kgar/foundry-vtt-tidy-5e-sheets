<header class="item-table-header-row">
  <slot />
</header>

<style lang="scss">
  .item-table-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0 2px;
    padding: 4px 0 2px 6px;
    line-height: 12px;
    font-size: 12px;
    background: var(--t5e-faint-color);
    box-shadow: 0 0 3px inset var(--t5e-light-color);
    border-radius: 0.3125rem;
  }
</style>
