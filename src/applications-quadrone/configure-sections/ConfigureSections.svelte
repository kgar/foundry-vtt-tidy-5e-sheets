<script lang="ts">
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfigurableSection } from './configure-sections.types';
  import type {
    ConfigureSectionsApplication,
    SectionOptionGroup,
  } from './ConfigureSectionsApplication.svelte';
  import { isNil } from 'src/utils/data';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
  import TabVisibilityControls from 'src/applications/settings/sheet/tabs/TabVisibilityControls.svelte';

  interface Props {
    optionGroups?: SectionOptionGroup[];
    sections: ConfigurableSection[];
    application: ConfigureSectionsApplication;
    title: string;
    tabConfigEntry?: TabConfigContextEntry;
    tabId: string;
  }

  let {
    optionGroups,
    sections = $bindable(),
    application,
    title,
    tabConfigEntry,
    tabId,
  }: Props = $props();

  const localize = FoundryAdapter.localize;
  let isBasicTheme = $derived(ThemeQuadrone.getSheetThemeSettings({ doc: application.document }).useBasicTheme ?? false);
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
              {:else if setting.type === 'navigationButton'}
                <button
                  type="button"
                  class="button"
                  onclick={(ev) => setting.onclick(ev, application)}
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
  {#if tabConfigEntry}
    <TabVisibilityControls entry={tabConfigEntry} {tabId} />
  {/if}
  
  <fieldset class="section-config-container">
    <legend>
      {localize('TIDY5E.Section.LabelPl')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>
    <SortingListbox
      bind:items={sections}
      labelProp="label"
      valueProp="key"
      selectedItemClasses={!isBasicTheme ? 'theme-dark' : ''}
    >
      {#snippet itemTemplate({ item })}
        <span
          data-section-key={item['key']}
          data-testid="section-config-item-label"
          class="section-config-item-label font-label-medium"
          class:marked-as-hidden={item.show === false}>{item.label}</span
        >
          <button
            type="button"
            class="button listbox-option-button option-{item.show ? 'show' : 'hide'}"
            title={item.show ? localize('TIDY5E.Section.ConfigDialog.hideTooltip') : localize('TIDY5E.Section.ConfigDialog.showTooltip')}
            data-testid="section-config-show"
            onclick={() => {
              item.show = !item.show;
              sections = sections;
            }}
          >
            <i class="{item.show ? 'fas fa-eye' : 'far fa-eye-slash'} fa-fw"></i>
            {item.show ? localize('TIDY5E.Visible') : localize('TIDY5E.Hidden')}
          </button>
      {/snippet}
    </SortingListbox>
  </fieldset>
</div>