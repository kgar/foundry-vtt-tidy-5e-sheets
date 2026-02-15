<script lang="ts">
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfigurableSection } from './configure-sections.types';
  import type {
    ConfigureSectionsApplication,
    SectionOptionGroup,
  } from './ConfigureSectionsApplication.svelte';
  import { isNil } from 'src/utils/data';

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
<div class="dialog-content-container flexcol">
  <h2>{title}</h2>
  {#if optionGroups?.length}
    <fieldset>
      <legend>
        {localize('TIDY5E.Options.Title')}
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      {#each optionGroups as group}
        <div class="form-group">
          <label for="">
            {localize(group.title)}
          </label>
          <div class="form-fields vertical">
            {#each group.settings as setting}
              {#if setting.type === 'boolean'}
                <label class="checkbox">
                  <input type="checkbox" bind:checked={setting.checked} />
                  {localize(setting.label)}
                </label>
              {:else if setting.type === 'radio'}
                {#each setting.options as option}
                  <label class="radio">
                    <input
                      type="radio"
                      value={option.value}
                      bind:group={setting.selected}
                    />
                    {localize(option.label)}
                  </label>
                {/each}
              {:else if setting.type === 'button'}
                <button
                  type="button"
                  class="button"
                  onclick={(ev) => setting.onclick(ev, application.document)}
                >
                  {#if !isNil(setting.icon)}
                    <i class={setting.icon}></i>
                  {/if}
                  {localize(setting.label ?? '')}
                </button>
              {/if}
            {/each}
          </div>
        </div>
      {/each}
    </fieldset>
  {/if}
  <!-- TODO: make some formal styles for this -->
  <fieldset class="section-config-container">
    <legend>
      {localize('TIDY5E.Section.LabelPl')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>
    <SortingListbox
      bind:items={sections}
      labelProp="label"
      valueProp="key"
      selectedItemClasses="theme-dark"
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
            class="button listbox-option-button option-show"
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
            class="button listbox-option-button option-hide"
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
  </fieldset>
</div>
<div class="button-bar">
  <button
    type="button"
    class="button button-secondary button-large use-default-btn"
    data-testid="section-config-use-default"
    onclick={(ev) => application.useDefault()}
  >
    <i class="fas fa-rotate-left"></i>
    {localize('TIDY5E.UseDefault')}
  </button>
  <button
    type="button"
    class="button button-secondary button-large apply-changes-btn"
    data-testid="section-config-apply-changes"
    onclick={() => application.close()}
  >
    {localize('Cancel')}
  </button>
  <button
    type="button"
    data-testid="section-config-save-changes"
    onclick={(ev) => application.saveChanges()}
    class="button button-primary button-large button-save save-changes-btn"
  >
    <i class="fas fa-save"></i>
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>