<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<span class="ae-marker" title={localize('TIDY5E.ActiveEffectsMarkerTitle')}>
  Æ
</span>

<style lang="less">
  .ae-marker {
    display: inline-block;
    padding: 0.0625rem 0.1875rem 0 0.1875rem;
    font-size: 0.75rem;
    line-height: 0.9375rem;
    font-weight: 600;
    background: var(--t5e-warning-accent-color);
    color: var(--t5e-warning-accent-contrast-color);
    border-radius: 0.1875rem;
    flex: 0;
    align-self: center;
    margin: 0 0.25rem;
  }
</style>
