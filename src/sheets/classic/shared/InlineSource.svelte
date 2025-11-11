<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { isNil } from 'src/utils/data';

  interface Props {
    document: any;
    keyPath: string;
    editable: boolean;
  }

  let { document, keyPath, editable }: Props = $props();

  let source = $derived(FoundryAdapter.getProperty<any>(document, keyPath));

  let text = $derived(!isNil(source?.label, '') ? source.label : 'Source');
  let usePlaceholder = $derived(isNil(source?.label, ''));
</script>

{#if editable}
  <button
    type="button"
    class="configure-source inline-transparent-button highlight-on-hover truncate"
    class:placeholder={usePlaceholder}
    onclick={() => FoundryAdapter.renderSourceConfig(document, keyPath)}
    tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
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

<style lang="less">
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
