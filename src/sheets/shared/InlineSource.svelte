<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';

  export let document: any;
  export let keyPath: string;
  export let editable: boolean;

  $: source = FoundryAdapter.getProperty<any>(document, keyPath);

  $: text = !isNil(source?.label, '') ? source.label : 'Source';
  $: usePlaceholder = isNil(source?.label, '');
</script>

{#if editable}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a
    class="configure-source inline-transparent-button highlight-on-hover truncate align-self-center"
    class:placeholder={usePlaceholder}
    on:click={() => FoundryAdapter.renderSourceConfig(document, keyPath)}
  >
    {text}
  </a>
{:else}
  <span
    class="source-label truncate"
    title={text}
    class:placeholder={usePlaceholder}>{text}</span
  >
{/if}

<style lang="scss">
  .source-label,
  .configure-source {
    flex: 1;
    line-height: inherit;
    height: inherit;

    &.placeholder:not(:hover, :focus-visible) {
      color: var(--t5e-tertiary-color);
    }
  }
</style>
