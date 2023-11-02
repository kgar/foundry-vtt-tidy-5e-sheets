<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<div class="is-favorite" title={localize('T5EK.isFav')}>
  <i class="fas fa-bookmark icon-fav" />
</div>

<style lang="scss">
  .is-favorite {
    font-size: 0.75rem;
    color: var(--t5ek-secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
  }
</style>
