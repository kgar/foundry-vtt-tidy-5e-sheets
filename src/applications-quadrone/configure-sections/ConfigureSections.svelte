<script lang="ts">
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfigurableSection } from './configure-sections.types';
  import type {
    ConfigureSectionsApplication,
    SectionOptionGroup,
  } from './ConfigureSectionsApplication.svelte';

  interface Props {
    optionGroups?: SectionOptionGroup[];
    sections: ConfigurableSection[];
    application: ConfigureSectionsApplication;
    title: string;
  }

  let {
    optionGroups,
    sections = $bindable(),
    application,
    title,
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<section class="tab-configuration">
  <h1>{title}</h1>
  <div>
    {#if optionGroups?.length}
      <h2>
        {localize('TIDY5E.Options.Title')}
      </h2>
      {#each optionGroups as group}
        <h3>
          {localize(group.title)}
        </h3>
        {#each group.settings as setting}
          {#if setting.type === 'boolean'}
            <label class="checkbox">
              <input type="checkbox" bind:checked={setting.checked} />
              {localize(setting.label)}
            </label>
          {/if}
        {/each}
      {/each}
    {/if}
  </div>
  <h2>
    {localize('TIDY5E.Section.LabelPl')}
  </h2>
  <SortingListbox
    bind:items={sections}
    labelProp="label"
    valueProp="key"
    listboxCssClass="scroll-container"
  >
    {#snippet itemTemplate({ item })}
      <span
        data-section-key={item['key']}
        data-testid="section-config-item-label"
        class="section-config-item-label"
        class:marked-as-hidden={item.show === false}>{item.label}</span
      >
      {#if item.show !== false}
        <button
          type="button"
          class="listbox-option-button option-show"
          title={localize('TIDY5E.Section.ConfigDialog.showTooltip')}
          data-testid="section-config-show"
          onclick={() => {
            item.show = false;
            sections = sections;
          }}
        >
          <i class="far fa-eye fa-fw"></i>
          {localize('TIDY5E.Visible')}
        </button>
      {:else}
        <button
          type="button"
          class="listbox-option-button option-hide"
          title={localize('TIDY5E.Section.ConfigDialog.hideTooltip')}
          data-testid="section-config-hide"
          onclick={() => {
            item.show = true;
            sections = sections;
          }}
        >
          <i class="far fa-eye-slash fa-fw"></i>
          {localize('TIDY5E.Hidden')}
        </button>
      {/if}
    {/snippet}
  </SortingListbox>

  <div class="button-bar">
    <button
      type="button"
      data-testid="section-config-save-changes"
      onclick={(ev) => application.saveChanges()}
      class="active save-changes-btn"
    >
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
