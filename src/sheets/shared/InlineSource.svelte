<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
    import { settingStore } from 'src/settings/settings';

  export let document: any;
  export let keyPath: string;
  export let editable: boolean;

  $: source = FoundryAdapter.getProperty<any>(document, keyPath);

  $: text = source.label !== '' ? source.label : 'Source';
  $: usePlaceholder = source.label === '';
</script>

{#if editable}
  <button
    type="button"
    class="configure-source inline-transparent-button highlight-on-hover truncate"
    class:placeholder={usePlaceholder}
    on:click={() => FoundryAdapter.renderSourceConfig(document, keyPath)}
    tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  >
    {text}
  </button>
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
      color: var(--t5ek-tertiary-color);
    }
  }
</style>
