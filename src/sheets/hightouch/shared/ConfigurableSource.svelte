<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let unlocked: boolean;
  export let sourceText: string;
  export let document: any;
  export let keyPath: string;
  export let buttonClass: string = '';

  const localize = FoundryAdapter.localize;
</script>

<div class="configurable-source">
  <span class="source-text">
    {sourceText ?? ''}
  </span>
  {#if unlocked}
    <button
      type="button"
      class="configure-source {buttonClass}"
      on:click={() => FoundryAdapter.renderSourceConfig(document, keyPath)}
      title={localize('DND5E.SOURCE.Action.Configure')}
    >
      <i class="fas fa-cog"></i>
    </button>
  {/if}
</div>
