<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<div class="is-favorite" title={localize('TIDY5E.Favorite')}>
  <i class="fas fa-bookmark icon-fav fa-fw"></i>
</div>

<style lang="less">
  .is-favorite {
    font-size: 0.75rem;
    color: var(--t5e-secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
