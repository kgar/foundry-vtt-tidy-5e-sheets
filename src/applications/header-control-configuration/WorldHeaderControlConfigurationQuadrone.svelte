<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    WorldHeaderControlConfigContext,
    WorldHeaderControlConfigurationQuadroneApplication,
  } from './WorldHeaderControlConfigurationQuadroneApplication.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Tab } from 'src/types/types';
  import VerticalTabs from 'src/components/tabs/VerticalTabs.svelte';

  interface Props {
    app: WorldHeaderControlConfigurationQuadroneApplication;
    context: WorldHeaderControlConfigContext;
  }

  let { context = $bindable(), app }: Props = $props();

  const localize = FoundryAdapter.localize;

  const menuOptionText = localize(
    'TIDY5E.HeaderControlConfiguration.LocationMenu',
  );
  const headerOptionText = localize(
    'TIDY5E.HeaderControlConfiguration.LocationHeader',
  );

  let tabs = $derived(
    context.map((config) => ({
      id: `${config.documentName}-${config.documentType}`,
      title: config.title,
      content: {
        type: 'template' as const,
        html: '',
      },
    }))
  );

  let selectedTabId = $state('');
  
  $effect(() => {
    if (!selectedTabId && tabs[0]) {
      selectedTabId = tabs[0].id;
    }
  });

  let selectedConfig = $derived(
    context.find(
      (c) => `${c.documentName}-${c.documentType}` === selectedTabId
    )
  );
</script>

<div class="dialog-content-container flexrow">
  <div class="flexcol noflex">
    <VerticalTabs {tabs} bind:selectedTabId class="flex1" />
  </div>

  {#if selectedConfig}
    <div
      class={[
        'tidy-tab', 
        selectedTabId, 
        'flexcol',
        'configuration-tab',
        'dialog-content',
        { active: true },
      ]}
      data-tab-contents-for={selectedTabId}
      role="tabpanel"
    >
      <div class="flexrow">
        <h2>{localize('TIDY5E.SettingsMenu.HeaderControlConfiguration.label')}: {selectedConfig.title}</h2>
      </div>
      <div class="flexrow flex1" style="gap: 0.75rem; justify-content: end; margin-top: 0.5rem;">
        <h3 class="flex1">{localize('TIDY5E.SettingsMenu.HeaderControlConfiguration.name')}</h3>
        <button type="button" class="button button-borderless flexshrink" style="padding: 0;" onclick={() => {
            selectedConfig.controlSettings.forEach(setting => {
              setting.location = 'menu';
            });
          }}>
          <i class="fas fa-square-list"></i>
          {localize('TIDY5E.Listbox.MoveAllLeft')}
        </button>
        <button type="button" class="button button-borderless flexshrink" style="padding: 0;" onclick={() => {
            selectedConfig.controlSettings.forEach(setting => {
              setting.location = 'header';
            });
          }}>
          <i class="fas fa-ellipsis"></i>
          {localize('TIDY5E.Listbox.MoveAllRight')}
        </button>
      </div>
      <tidy-gold-header-underline style="margin-bottom: 0.5rem;"></tidy-gold-header-underline>
      <fieldset>
        {#each selectedConfig.controlSettings as setting, i}
          {@const formControlId = `${app.id}-${setting.title.slugify()}`}
          <div class="form-group">
            <label for={formControlId}>
              <i class={setting.icon}></i>
              {setting.title}
            </label>
            <div
              class="form-fields"
              style="flex-start; gap: 1.5rem; flex-grow: 0;"
            >
              <label class="radio">
                <input
                  type="radio"
                  checked={setting.location === 'menu'}
                  onclick={(ev) => {
                    setting.location = 'menu';
                  }}
                />
                {menuOptionText}
              </label>
              <label class="radio">
                <input
                  type="radio"
                  checked={setting.location === 'header'}
                  onclick={(ev) => {
                    setting.location = 'header';
                  }}
                />
                {headerOptionText}
              </label>
            </div>
          </div>
        {/each}
      </fieldset>
    </div>
  {/if}
</div>

<div class="button-bar">
  <button
    type="button"
    class="button button-secondary button-large use-default-btn"
    onclick={() => app.useDefault()}
  >
    <i class="fas fa-rotate-left"></i>
    {localize('TIDY5E.UseDefault')}
  </button>
  <button
    type="button"
    class="button button-primary button-large button-save save-changes-btn"
    onclick={() => app.save()}
  >
    <i class="fas fa-save"></i>
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>