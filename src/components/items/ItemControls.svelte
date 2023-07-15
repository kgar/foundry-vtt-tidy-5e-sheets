<div class="tidy5e-item-controls">
  <slot />
</div>

<style lang="scss">
  .tidy5e-item-controls {
    align-self: stretch;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    min-width: 5.3125rem;
    font-size: 0.75rem;
    gap: 0.125rem;

    :global(> *) {
      flex: 1;
    }
  }
</style>
