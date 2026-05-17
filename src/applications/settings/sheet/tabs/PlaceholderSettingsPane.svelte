<script lang="ts">
    import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
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
    {localize('TIDY5E.TabConfiguration.options.visibility', { tabId })}
  </p>
  <p class="hint">
    {localize('TIDY5E.TabConfiguration.options.viewers', { tabId })}
  </p>
  <SelectQuadrone value={tabId} field="tabId" document={document} />
</div>

<style lang="less">
  .placeholder-pane {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
