<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';

  export let document: any;
  export let keyPath: string;
  export let editable: boolean;

  $: keyPathToCustom = `${keyPath}.custom`;

  $: source = FoundryAdapter.getProperty<any>(document, keyPath);

  const localize = FoundryAdapter.localize;
</script>

<div class="source-container flex-row extra-small-gap align-items-center">
  {#if source?.custom === source?.label || source?.label === ''}
    <TextInput
      {document}
      field={keyPathToCustom}
      value={source?.custom}
      placeholder={localize('DND5E.SOURCE.FIELDS.source.label')}
      class="source-custom"
    />
  {:else}
    <span class="source-label truncate" title={source?.label ?? ''}
      >{source?.label ?? ''}</span
    >
  {/if}
  {#if editable}
    <button
      type="button"
      class="inline-icon-button config-button"
      on:click={() => FoundryAdapter.renderSourceConfig(document, keyPath)}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      ><i class="fas fa-cog" /></button
    >
  {/if}
</div>

<style lang="scss">
  .source-container {
    width: 100%;
    line-height: inherit;

    .source-label,
    :global(.source-custom) {
      flex: 1;
      line-height: inherit;
      height: inherit;
    }

    &:not(:hover) .config-button:not(:focus-visible) {
      opacity: 0;
      position: absolute;
    }
  }
</style>
