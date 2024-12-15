<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    unlocked: boolean;
    sourceText: string;
    document: any;
    keyPath: string;
    buttonClass?: string;
  }

  let {
    unlocked,
    sourceText,
    document,
    keyPath,
    buttonClass = '',
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div class="configurable-source">
  <span class="source-text truncate" title={sourceText ?? ''}>
    {sourceText ?? ''}
  </span>
  {#if unlocked}
    <button
      type="button"
      class="configure-source {buttonClass}"
      onclick={() => FoundryAdapter.renderSourceConfig(document, keyPath)}
      title={localize('DND5E.SOURCE.Action.Configure')}
    >
      <i class="fas fa-cog"></i>
    </button>
  {/if}
</div>
