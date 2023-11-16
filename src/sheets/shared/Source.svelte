<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let document: any;
  export let keyPath: string;
  export let editable: boolean;

  $: keyPathToCustom = `${keyPath}.custom`;

  $: source = FoundryAdapter.getProperty<any>(document, keyPath);

  const localize = FoundryAdapter.localize;
</script>

<div class="source-container flex-row extra-small-gap align-items-center">
  {#if source?.custom === source?.label}
    <TextInput
      {document}
      field={keyPathToCustom}
      value={source.custom}
      placeholder={localize('DND5E.Source')}
    />
  {:else}
    <div title={source.label ?? ''}>{source.label ?? ''}</div>
  {/if}
  {#if editable}
    <button
      type="button"
      class="inline-icon-button config-button"
      on:click={() => FoundryAdapter.renderSourceConfig(document, keyPath)}
      ><i class="fas fa-cog" /></button
    >
  {/if}
</div>

<style lang="scss">
  .source-container {
    width: 100%;

    > :global(:not(.config-button)) {
      flex: 1;
    }

    &:not(:hover) .config-button:not(:focus-visible) {
      opacity: 0;
      position: absolute;
    }
  }
</style>
