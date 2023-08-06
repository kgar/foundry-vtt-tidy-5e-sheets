<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<i class="fas fa-bookmark icon-fav" title={localize('T5EK.isFav')} />

<style lang="scss">
  .icon-fav {
    position: absolute;
    top: -0.125rem;
    left: 0.25rem;
    color: rgba(0, 200, 100, 1);
    text-shadow: 0 0 0.125rem var(--t5e-primary-color);
    font-size: 0.625rem;
  }
</style>
