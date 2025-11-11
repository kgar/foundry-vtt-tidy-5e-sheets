<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<i
  class="fas fa-bookmark icon-fav no-pointer-events"
  title={localize('TIDY5E.Favorite')}
></i>

<style lang="less">
  .icon-fav {
    position: absolute;
    top: -0.125rem;
    left: 0.25rem;
    color: var(--t5e-grid-pane-favorite-icon-color);
    text-shadow: 0 0 0.125rem var(--t5e-primary-color);
    font-size: 0.625rem;
  }
</style>
