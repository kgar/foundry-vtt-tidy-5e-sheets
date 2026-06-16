<script lang="ts">
  import SortableListbox from 'src/applications/tab-configuration/parts/SortableListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfigurableSection } from './configure-sections.types';
  import { isNil } from 'src/utils/data';
  import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
  import TabVisibilityControls from 'src/applications/settings/sheet/tabs/TabVisibilityControls.svelte';
  import type {
    ConfigureSectionsSettingsEditor,
    SectionOptionGroup,
  } from 'src/settings/editors/configure-sections-settings-editor.svelte';

  interface Props {
    optionGroups?: SectionOptionGroup[];
    sections: ConfigurableSection[];
    application: ConfigureSectionsSettingsEditor;
    title: string;
    tabConfigEntry?: TabConfigContextEntry;
    tabId: string;
  }

  let {
    optionGroups,
    sections = $bindable(),
    application,
    title,
    tabConfigEntry = $bindable(),
    tabId,
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
    <TabVisibilityControls bind:entry={tabConfigEntry} {tabId} />
  {/if}

  <fieldset class="section-config-container">
    <legend>
      {localize('TIDY5E.Section.LabelPl')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>
    <SortableListbox
      bind:items={sections}
      showUserVisibility={false}
      headerLabels={{ primary: 'Section', show: 'Show Section' }}
    />
  </fieldset>
</div>
