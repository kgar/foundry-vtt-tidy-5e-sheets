<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    SheetTabConfigurationContext,
    SheetTabConfigurationQuadroneApplication,
  } from './SheetTabConfigurationQuadroneApplication.svelte';
  import TabConfigurationEntry from './parts/TabConfigurationEntry.svelte';

  interface Props {
    app: SheetTabConfigurationQuadroneApplication;
    config: SheetTabConfigurationContext;
  }

  let { config, app }: Props = $props();

  const localize = FoundryAdapter.localize;

  let title = $derived(
    localize('TIDY5E.TabSelection.Title', {
      documentName: localize(
        `TYPES.${config.entry.documentName}.${config.entry.documentType}`,
      ),
    }),
  );
</script>

<div class="configuration-tab flexcol">
  <h2>
    {title}
  </h2>
  <TabConfigurationEntry entry={config.entry} />
</div>
<div class="flexrow flexgap-1">
  <button
    type="button"
    class="button button-primary save-changes-btn"
    onclick={() => app.save()}
  >
    {localize('TIDY5E.SaveChanges')}
  </button>
  <button
    type="button"
    class="button button-secondary use-default-btn"
    onclick={() => app.useDefault()}
  >
    {localize('TIDY5E.UseDefault')}
  </button>
</div>
