import type { Tidy5eSheetsApi } from 'src/api';
import type { ModuleIntegrationBase } from 'src/integration/ModuleIntegrationBase';
import DrakkenheimCoreContaminationTab from './DrakkenheimCoreContaminationTab.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class DrakkenheimCoreModuleIntegration implements ModuleIntegrationBase {
  get moduleId(): string {
    return 'drakkenheim-core';
  }
  init(api: Tidy5eSheetsApi): void {
    import('./DrakkenheimContaminationTabClassic.scss');

    const contaminationTab = new api.models.SvelteTab({
      title: () => FoundryAdapter.localize('DRAKKENHEIM.Contamination'),
      tabId: 'drakkenheim-contamination-tab',
      component: DrakkenheimCoreContaminationTab,
      getContext(context) {
        return context;
      },
    });

    api.registerCharacterTab(contaminationTab, { layout: 'classic' });
    api.registerNpcTab(contaminationTab, { layout: 'classic' });
  }
}