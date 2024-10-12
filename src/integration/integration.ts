import { PopoutModuleIntegration } from './modules/PopoutModuleIntegration';
import type {
  ModuleIntegrationBase,
  SystemIntegrationBase,
} from './integration-classes';
import { error } from 'src/utils/logging';
import { CustomCharacterSheetsModuleIntegration } from './modules/CustomCharacterSheetsModuleIntegration';
import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { DrakkenheimCoreModuleIntegration } from './modules/Drakkenheim/DrakkenheimCore';
import { TidyCustomSectionsInDefaultItemSheetIntegration } from './system/TidyCustomSectionsInDefaultItemSheetIntegration';

export function setupIntegrations(api: Tidy5eSheetsApi) {
  setupSystemIntegrations(api);
  setupModuleIntegrations(api);
}

/* System Integrations */

const systemIntegrations: SystemIntegrationBase[] = [
  new TidyCustomSectionsInDefaultItemSheetIntegration(),
  // Add other system integrations here
];

function setupSystemIntegrations(api: Tidy5eSheetsApi) {
  systemIntegrations.forEach((systemIntegration) => {
    try {
      systemIntegration.init(api);
    } catch (e) {
      error(`System integration failed`, false, e);
    }
  });
}

/* Module Integrations */

const moduleIntegrations: ModuleIntegrationBase[] = [
  new PopoutModuleIntegration(),
  new CustomCharacterSheetsModuleIntegration(),
  new DrakkenheimCoreModuleIntegration(),
  // Add other module integrations here
];

function setupModuleIntegrations(api: Tidy5eSheetsApi) {
  moduleIntegrations.forEach((m) => {
    try {
      if (game.modules.get(m.moduleId)?.active) {
        m.init(api);
      }
    } catch (e) {
      error(`Module integration failed for ${m.moduleId}`, false, e);
    }
  });
}