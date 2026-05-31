<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    WorldHeaderControlConfigContext,
    WorldHeaderControlConfigurationQuadroneApplication,
  } from './WorldHeaderControlConfigurationQuadroneApplication.svelte';
  import VerticalTabs from 'src/components/tabs/VerticalTabs.svelte';
  import SheetHeaderControlConfig from './SheetHeaderControlConfig.svelte';

  interface Props {
    app: WorldHeaderControlConfigurationQuadroneApplication;
    context: WorldHeaderControlConfigContext;
  }

  let { context = $bindable(), app }: Props = $props();

  const localize = FoundryAdapter.localize;

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
      <SheetHeaderControlConfig config={selectedConfig} idPrefix={app.id} />
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