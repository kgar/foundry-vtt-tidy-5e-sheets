<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    title: string;
    tabId: string;
  }

  let { title, tabId }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div class="placeholder-pane">
  <h2>{title}</h2>
  <p class="hint">
    {localize('TIDY5E.SheetSettings.PlaceholderHint', { tabId })}
  </p>
</div>

<style lang="less">
  .placeholder-pane {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
