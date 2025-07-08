<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { PortraitCharmRadiusClass } from 'src/types/types';

  interface Props {
    cssClass?: string;
    radiusClass: PortraitCharmRadiusClass;
    onlyShowOnHover?: boolean;
  }

  let { cssClass = '', radiusClass, onlyShowOnHover = false }: Props = $props();

  let context = $derived(getNpcSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div
  class="loyalty-container {cssClass} {radiusClass}"
  title={localize('DND5E.Loyalty')}
>
  {#if context.editable}
    <TextInput
      document={context.actor}
      field="system.attributes.loyalty.value"
      value={context.source.attributes.loyalty?.value ?? ''}
      class="uninput loyalty-input"
      placeholder="—"
      selectOnFocus={true}
      saveEmptyAsNull={true}
    />
  {:else}
    <span class="loyalty-text">
      {context.system.attributes.loyalty?.value}
    </span>
  {/if}
</div>

<style lang="scss">
  .loyalty-container {
    position: absolute;
    top: 0;
    right: 0;
    height: 2.125rem;
    width: 2.125rem;
    overflow: hidden;
    color: var(--t5e-icon-font-color);
    background: var(--t5e-icon-background);
    display: flex;
    box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5e-icon-outline-color);

    :global(input.uninput) {
      height: 100%;
      width: 100%;
      text-align: center;
      font-size: 1.25rem;
      border-radius: 1.25rem;
      color: var(--t5e-tertiary-color);
      transition: color 0.3s ease;
      font-family: var(--t5e-title-font-family);
      border: 1.5px dashed var(--t5e-secondary-color);

      &:focus {
        color: var(--t5e-primary-font-color);
      }

      &:hover,
      &:focus {
        border: 1.5px dashed var(--t5e-primary-accent-color);
      }
    }
  }
</style>
