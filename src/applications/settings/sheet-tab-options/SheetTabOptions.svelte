<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfigurableSection } from './sheet-tab-options.types';
  import { isNil } from 'src/utils/data';
  import type { TabConfigContextEntry } from 'src/settings/editors/shared/tab-configuration.types';
  import TabVisibilityControls from 'src/applications/settings/sheet/tabs/TabVisibilityControls.svelte';
  import type {
    SheetTabOptionsSettingsEditor,
    SectionOptionGroup,
  } from 'src/settings/editors/sheet-tab-options-settings-editor.svelte';
  import SortableListbox from '../tab-configuration/parts/SortableListbox.svelte';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';

  interface Props {
    optionGroups?: SectionOptionGroup[];
    sections: ConfigurableSection[];
    application: SheetTabOptionsSettingsEditor;
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

    <!-- TODO: Share the item name snippet? -->
    {#snippet listboxItemName(item: ConfigurableSection)}
      <span
        data-section-key={item.key}
        data-testid="section-config-item-label"
        class="section-config-item-label font-label-medium">{item.label}</span
      >
    {/snippet}
    <!-- TODO: Share the item show snippet? -->
    {#snippet listboxItemShow(item: ConfigurableSection)}
      <div class="tab-visibility-switch">
        <FieldToggle
          checked={item.show}
          onchange={(ev) => {
            item.show = (ev.currentTarget as HTMLInputElement).checked;
          }}
        />
      </div>
    {/snippet}

    <SortableListbox
      items={sections}
      columns={[
        {
          title: 'Section',
          titleClasses: 'tabs-label',
          cellSnippet: listboxItemName,
        },
        {
          title: 'Show Section',
          titleClasses: 'visibility-label',
          cellSnippet: listboxItemShow,
        },
      ]}
      key="key"
      listItemClassesFn={(item) => ({ 'marked-as-hidden': !item.show })}
    />
  </fieldset>
</div>
