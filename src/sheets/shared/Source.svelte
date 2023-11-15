<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let document: any;
  export let keyPath: string;
  export let editable: boolean;

  $: keyPathToCustom = `${keyPath}.custom`;

  $: source = FoundryAdapter.getProperty<any>(document, keyPath);

  const localize = FoundryAdapter.localize;

  $: {
    console.warn({
      document,
      keyPath,
      keyPathToCustom,
      source,
    });
  }
</script>

<!-- {{#if (eq system.details.source.custom system.details.source.label)}}
      <input type="text" name="system.details.source.custom" value="{{system.details.source.custom}}"
                   placeholder="{{ localize 'DND5E.Source' }}">
  {{else}}
      <span data-tooltip="{{system.details.source.label}}">{{system.details.source.label}}</span>
  {{/if}}
  {{#if editable}}
      <a class="config-button" data-action="source" data-tooltip="DND5E.SourceConfig">
          <i class="fas fa-cog"></i>
      </a>
  {{/if}} -->

<div class="source-container flex-row no-gap">
  {#if source?.custom === source?.label}
    <TextInput
      {document}
      field={keyPathToCustom}
      value={source.custom}
      placeholder={localize('DND5E.Source')}
    />
  {:else}
    <span title={source.label} class="truncate">{source.label}</span>
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
    &:not(:hover) .config-button:not(:focus-visible) {
      opacity: 0;
      position: absolute;
    }
  }
</style>
