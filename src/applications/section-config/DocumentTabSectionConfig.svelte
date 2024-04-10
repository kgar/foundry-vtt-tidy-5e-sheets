<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';
  import type { DocumentTabSectionConfigItem } from './document-tab-section-config.types';

  export let sections: DocumentTabSectionConfigItem[];
  export let onConfirm: (
    sections: DocumentTabSectionConfigItem[],
  ) => void | Promise<void>;
  export let useDefault: () => void | Promise<void>;

  const localize = FoundryAdapter.localize;
</script>

<section class="flex-column">
  <SortingListbox
    bind:items={sections}
    labelProp="label"
    valueProp="key"
    listboxCssClass="scroll-container"
    class="flex-1"
  >
    <svelte:fragment let:item>
      <span class="flex-1" class:marked-as-hidden={item.show === false}
        >{item.label}</span
      >
      {#if item.show !== false}
        <button
          type="button"
          class="inline-icon-button"
          title={localize('TIDY5E.Section.ConfigDialog.hideTooltip')}
          on:click={() => {
            item.show = false;
            sections = sections;
          }}
        >
          <i class="far fa-eye fa-fw"></i>
        </button>
      {:else}
        <button
          type="button"
          class="inline-icon-button"
          title={localize('TIDY5E.Section.ConfigDialog.showTooltip')}
          on:click={() => {
            item.show = true;
            sections = sections;
          }}
        >
          <i class="far fa-eye-slash fa-fw"></i>
        </button>
      {/if}
    </svelte:fragment>
  </SortingListbox>

  <div class="flex-row small-gap">
    <button
      type="button"
      class="use-default-btn"
      on:click={(ev) => useDefault()}
    >
      <i class="fas fa-rotate-right" />
      {localize('TIDY5E.UseDefault')}
    </button>
    <button type="button" on:click={(ev) => onConfirm(sections)}
      >{localize('TIDY5E.ButtonConfirm.Text')}</button
    >
  </div>
</section>

<style lang="scss">
  section {
    height: 100%;
    display: flex;
    flex-direction: column;

    :global(> :not(button)) {
      overflow: hidden;
    }
  }

  .marked-as-hidden {
    font-style: italic;
    color: var(--t5e-tertiary-color);
  }
</style>
