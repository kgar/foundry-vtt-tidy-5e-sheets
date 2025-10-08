<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    SheetTabConfigurationContext,
    SheetTabConfigurationQuadroneApplication,
  } from './SheetTabConfigurationQuadroneApplication.svelte';
  import TabConfigurationEntry from './parts/TabConfigurationEntry.svelte';
    import type { Tab } from 'src/types/types';
    import SheetTabInclusionTab from './tabs/SheetTabInclusionTab.svelte';

  interface Props {
    app: SheetTabConfigurationQuadroneApplication;
    config: SheetTabConfigurationContext;
    title: string;
  }

  let { config, app, title }: Props = $props();

  const localize = FoundryAdapter.localize;

  let tabs: Tab[] = [
    {
      id: 'inclusion',
      content: {
        type: 'svelte',
        component: SheetTabInclusionTab,
        getProps(data) {
          return {
            title: localize('')
          }
        }
      }
    }
  ]

</script>

<div class="dialog-content-container flexcol">
  <h2>{title}</h2>
  <TabConfigurationEntry bind:entry={config.entry} />
</div>
<div class="button-bar">
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
