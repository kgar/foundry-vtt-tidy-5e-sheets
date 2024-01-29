<div class="section-header-tab {$$props.class ?? ''}">
  <slot />
</div>

<style lang="scss">
  .section-header-tab {
    display: flex;
    align-items: center;
    padding: 0.125rem 0.5rem 0.125rem 0.5rem;
    border-radius: 0.3125rem 0.3125rem 0 0;
    font-weight: 400;
    line-height: 1.125rem;
    border: none;
    font-size: 0.75rem;
    background: var(--t5ek-faintest-color);
    color: var(--t5ek-secondary-color);
    min-height: 1.25rem;
  }
</style>
