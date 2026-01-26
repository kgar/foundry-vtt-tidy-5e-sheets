<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

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

  let context = $derived(getSheetContext());

  let conceal = $derived(
    context.system.identified === false &&
      !FoundryAdapter.isInGmEditMode(context.document),
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="configurable-source">
  {#if !conceal}
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
  {:else}
    <span class="source-text color-text-disabled">
      {localize('DND5E.Unidentified.Value')}
    </span>
  {/if}
</div>
