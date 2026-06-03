<script lang="ts">
  import { untrack } from 'svelte';
  import SortableListbox, {
    type SortableListboxItem,
  } from 'src/applications/tab-configuration/parts/SortableListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfigurableSection } from './configure-sections.types';
  import type {
    ConfigureSectionsApplication,
    SectionOptionGroup,
  } from './ConfigureSectionsApplication.svelte';
  import { isNil } from 'src/utils/data';
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

  // Sections use {key,label,show}. Edits save to `sections`.
  let sectionItems = $state<SortableListboxItem[]>(
    sections.map((s) => ({ id: s.key, label: s.label, show: s.show })),
  );

  // Rebuild local items if undo/reset changes.
  let trackedSections = sections;
  $effect(() => {
    if (sections !== trackedSections) {
      trackedSections = sections;
      sectionItems = sections.map((s) => ({
        id: s.key,
        label: s.label,
        show: s.show,
      }));
    }
  });

  $effect(() => {
    const next = sectionItems.map((it) => ({
      key: it.id,
      label: it.label,
      show: it.show,
    }));
    // Make sure effect doesn't re-trigger
    untrack(() => {
      sections.splice(0, sections.length, ...next);
    });
  });
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
    <SortableListbox
      bind:items={sectionItems}
      showUserVisibility={false}
      headerLabels={{ primary: 'Section', show: 'Show Section' }}
    />
  </fieldset>
</div>