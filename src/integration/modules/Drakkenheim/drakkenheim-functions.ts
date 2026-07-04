import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import DrakkenheimCoreContaminationTab from './DrakkenheimCoreContaminationTab.svelte';
import { DRAKKENHEIM_CORE_CONSTANTS } from './DrakkenheimCoreConstants';
import { SettingsProvider } from 'src/settings/settings.svelte';
import { loadConditionalStyles } from 'src/utils/css-loading';

function getDrakkenheimModuleScope(): string | undefined {
  for (const moduleId of DRAKKENHEIM_CORE_CONSTANTS.PRIORITIZED_SCOPE_MODULE_IDS) {
    // Gets the first active module in the priority order
    if (game.modules.get(moduleId)?.active) {
      return moduleId;
    }
  }

  return undefined;
}

function getOptionalGameSetting<T>(
  namespace: string,
  settingName: string,
): T | undefined {
  if (!FoundryAdapter.hasGameSetting(namespace, settingName)) {
    return undefined;
  }

  return FoundryAdapter.getGameSetting<T>(namespace, settingName);
}

export function registerDrakkenheimContaminationTab(
  api: Tidy5eSheetsApi,
  moduleId: string,
): void {
  const scope = getDrakkenheimModuleScope();

  // Drakkenheim registers settings on a single module based on the getScope() priority order
  if (!scope || moduleId !== scope) {
    return;
  }

  if (!SettingsProvider.settings.hideClassic.get()) {
    import('./DrakkenheimContaminationTabClassic.less');
    loadConditionalStyles('DrakkenheimContaminationTabClassic');
  }
  import('./DrakkenheimContaminationTab.css');
  loadConditionalStyles('DrakkenheimContaminationTab');

  // Since the setting requires a reload to toggle, we will simply avoid registering a column if it's disabled.
  if (
    getOptionalGameSetting<boolean>(
      scope,
      DRAKKENHEIM_CORE_CONSTANTS.SETTING_DISABLE_TAB,
    )
  ) {
    return;
  }

  const contaminationTab = new api.models.SvelteTab({
    title: () => FoundryAdapter.localize('DRAKKENHEIM.CONTAMINATION.tab'),
    tabId: 'drakkenheim-contamination-tab',
    component: DrakkenheimCoreContaminationTab,
    getContext(context: Map<string, any>) {
      context ??= new Map<string, any>();
      context.set(
        DRAKKENHEIM_CORE_CONSTANTS.SVELTE_CONTEXT.VERSION,
        getOptionalGameSetting<string>(
          scope,
          DRAKKENHEIM_CORE_CONSTANTS.SETTING_VERSION,
        ) ?? DRAKKENHEIM_CORE_CONSTANTS.VERSION_MODERN,
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
