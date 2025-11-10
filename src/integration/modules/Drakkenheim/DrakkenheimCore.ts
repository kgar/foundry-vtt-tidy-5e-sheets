import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import type { ModuleIntegrationBase } from 'src/integration/integration-classes';
import DrakkenheimCoreContaminationTab from './DrakkenheimCoreContaminationTab.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { DRAKKENHEIM_CORE_CONSTANTS } from './DrakkenheimCoreConstants';

export class DrakkenheimCoreModuleIntegration implements ModuleIntegrationBase {
  get moduleId(): string {
    return DRAKKENHEIM_CORE_CONSTANTS.MODULE_ID;
  }

  init(api: Tidy5eSheetsApi): void {
    // Since the setting requires a reload to toggle, we will simply avoid registering a column if it's disabled.
    if (
      FoundryAdapter.getGameSetting(
        DRAKKENHEIM_CORE_CONSTANTS.MODULE_ID,
        DRAKKENHEIM_CORE_CONSTANTS.SETTING_DISABLE_TAB
      )
    ) {
      return;
    }

    import('./DrakkenheimContaminationTabClassic.less');

    const contaminationTab = new api.models.SvelteTab({
      title: () => FoundryAdapter.localize('DRAKKENHEIM.CONTAMINATION.tab'),
      tabId: 'drakkenheim-contamination-tab',
      component: DrakkenheimCoreContaminationTab,
      getContext(context: Map<string, any>) {
        context ??= new Map<string, any>();
        context.set(
          DRAKKENHEIM_CORE_CONSTANTS.SVELTE_CONTEXT.VERSION,
          FoundryAdapter.getGameSetting(
            DRAKKENHEIM_CORE_CONSTANTS.MODULE_ID,
            DRAKKENHEIM_CORE_CONSTANTS.SETTING_VERSION
          )
        );
        return context;
      },
      iconClass: 'fa-solid fa-meteor',
    });

    api.registerCharacterTab(contaminationTab, {
      layout: ['classic', 'quadrone'],
    });
    api.registerNpcTab(contaminationTab, { layout: ['classic', 'quadrone'] });
  }
}
