<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';
  import type { DocumentTabSectionConfigItem } from './section-config.types';

  export let sections: DocumentTabSectionConfigItem[];
  export let onSaveChanges: (
    sections: DocumentTabSectionConfigItem[],
  ) => void | Promise<void>;
  export let onApply: (
    sections: DocumentTabSectionConfigItem[],
  ) => void | Promise<void>;
  export let useDefault: () => void | Promise<void>;

  const localize = FoundryAdapter.localize;
</script>

<section class="flex-column small-gap">
  <SortingListbox
    bind:items={sections}
    labelProp="label"
    valueProp="key"
    listboxCssClass="scroll-container"
    class="flex-1"
  >
    <svelte:fragment slot="itemTemplate" let:item>
      <span
        data-section-key={item['key']}
        data-testid="section-config-item-label"
        class="flex-1"
        class:marked-as-hidden={item.show === false}>{item.label}</span
      >
      {#if item.show !== false}
        <button
          type="button"
          class="inline-icon-button"
          title={localize('TIDY5E.Section.ConfigDialog.hideTooltip')}
          data-testid="section-config-hide"
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
          data-testid="section-config-show"
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
      data-testid="section-config-use-default"
      on:click={(ev) => useDefault()}
    >
      <i class="fas fa-rotate-right" />
      {localize('TIDY5E.UseDefault')}
    </button>
    <button
      type="button"
      data-testid="section-config-save-changes"
      on:click={(ev) => onSaveChanges(sections)}
      class="save-changes-btn"
    >
      <i class="fas fa-save" />
      {localize('TIDY5E.SaveChanges')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      data-testid="section-config-apply-changes"
      on:click={() => onApply(sections)}
    >
      <i class="fas fa-check" />
      {localize('TIDY5E.ApplyChanges')}
    </button>
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
