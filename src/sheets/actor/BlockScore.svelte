<div class="block-score">
  <slot />
</div>

<style lang="scss">
  .block-score > :global(*) {
    font-size: 1.5rem;
    margin: 0.125rem 0 0.1875rem 0;
    padding: 0.125rem 0 0 0;
    text-align: center;
    font-family: var(--t5e-title-font-family);
    font-weight: 700;
    height: 1.4375rem;
  }
</style>
