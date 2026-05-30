<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
  import type { TidySheetSettingsQuadroneApplication } from '../TidySheetSettingsQuadroneApplication.svelte';
  import TabVisibilityControls from './TabVisibilityControls.svelte';

  interface Props {
    app: TidySheetSettingsQuadroneApplication;
    title: string;
    tabId: string;
    tabConfigEntry: TabConfigContextEntry;
  }

  let { app, title, tabId, tabConfigEntry }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div class="placeholder-pane dialog-content-container">
  <h2>{title}</h2>
  <TabVisibilityControls entry={tabConfigEntry} {tabId} />
</div>

<div class="button-bar">
  <button
    type="button"
    class="button button-secondary button-large use-default-btn"
    data-testid="placeholder-use-default"
    onclick={() => app.tabDisplaySettingsTab.useDefault()}
  >
    <i class="fas fa-rotate-left"></i>
    {localize('TIDY5E.UseDefault')}
  </button>
  <button
    type="button"
    class="button button-secondary button-large apply-changes-btn"
    data-testid="placeholder-cancel"
    onclick={() => app.cancel()}
  >
    {localize('Cancel')}
  </button>
  <button
    type="button"
    data-testid="placeholder-save-changes"
    onclick={() => app.tabDisplaySettingsTab.apply()}
    class="button button-primary button-large button-save save-changes-btn"
  >
    <i class="fas fa-save"></i>
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>

<style lang="less">
  .placeholder-pane {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
  }
</style>
