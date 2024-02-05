<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<i class="fas fa-bookmark icon-fav" title={localize('TIDY5E.Favorite')} />

<style lang="scss">
  .icon-fav {
    position: absolute;
    top: -0.125rem;
    left: 0.25rem;
    color: var(--t5ek-grid-pane-favorite-icon-color);
    text-shadow: 0 0 0.125rem var(--t5ek-primary-color);
    font-size: 0.625rem;
  }
</style>
