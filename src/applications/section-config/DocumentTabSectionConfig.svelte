<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';
  import type { DocumentTabSectionConfigItem } from './section-config.types';

  interface Props {
    sections: DocumentTabSectionConfigItem[];
    onSaveChanges: (
      sections: DocumentTabSectionConfigItem[],
    ) => void | Promise<void>;
    onApply: (sections: DocumentTabSectionConfigItem[]) => void | Promise<void>;
    useDefault: () => void | Promise<void>;
  }

  let {
    sections = $bindable(),
    onSaveChanges,
    onApply,
    useDefault,
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<section class="document-tab-section-config flex-column small-gap full-height">
  <SortingListbox
    bind:items={sections}
    labelProp="label"
    valueProp="key"
    listboxCssClass="scroll-container"
    class="flex-1 overflow-y-hidden"
  >
    {#snippet itemTemplate({ item })}
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
          onclick={() => {
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
          onclick={() => {
            item.show = true;
            sections = sections;
          }}
        >
          <i class="far fa-eye-slash fa-fw"></i>
        </button>
      {/if}
    {/snippet}
  </SortingListbox>

  <div class="flex-row small-gap">
    <button
      type="button"
      class="use-default-btn"
      data-testid="section-config-use-default"
      onclick={(ev) => useDefault()}
    >
      <i class="fas fa-rotate-right"></i>
      {localize('TIDY5E.UseDefault')}
    </button>
    <button
      type="button"
      data-testid="section-config-save-changes"
      onclick={(ev) => onSaveChanges(sections)}
      class="save-changes-btn"
    >
      <i class="fas fa-save"></i>
      {localize('TIDY5E.SaveChanges')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      data-testid="section-config-apply-changes"
      onclick={() => onApply(sections)}
    >
      <i class="fas fa-check"></i>
      {localize('TIDY5E.ApplyChanges')}
    </button>
  </div>
</section>
