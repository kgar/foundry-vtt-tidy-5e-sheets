<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    SheetTabConfigurationContext,
    SheetTabConfigurationQuadroneApplication,
  } from './SheetTabConfigurationQuadroneApplication.svelte';
  import TabbedTabConfig from './parts/TabbedTabConfig.svelte';

  interface Props {
    app: SheetTabConfigurationQuadroneApplication;
    config: SheetTabConfigurationContext;
    title: string;
  }

  let { config, app, title }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div class="dialog-content-container flexcol">
  <h2>{title}</h2>
  <TabbedTabConfig entry={config.entry} />
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
