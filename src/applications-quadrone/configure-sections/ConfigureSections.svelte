<script lang="ts">
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfigurableSection } from './configure-sections.types';
  import type { ConfigureSectionsApplication } from './ConfigureSectionsApplication.svelte';

  interface Props {
    sections: ConfigurableSection[];
    application: ConfigureSectionsApplication;
  }

  let { sections = $bindable(), application }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<section class="tab-configuration">
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
          {localize('')}
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
      data-testid="section-config-save-changes"
      onclick={(ev) => application.saveChanges(sections)}
      class="save-changes-btn"
    >
      <i class="fas fa-save"></i>
      {localize('TIDY5E.SaveChanges')}
    </button>
    <button
      type="button"
      class="use-default-btn"
      data-testid="section-config-use-default"
      onclick={(ev) => application.useDefault()}
    >
      <i class="fas fa-rotate-left"></i>
      {localize('TIDY5E.UseDefault')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      data-testid="section-config-apply-changes"
      onclick={() => application.close()}
    >
      {localize('Cancel')}
    </button>
  </div>
</section>
