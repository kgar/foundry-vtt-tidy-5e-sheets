import type { Tidy5eSheetsApi } from 'src/api';
import { PopoutModuleIntegration } from './modules/PopoutModuleIntegration';
import type { ModuleIntegrationBase } from './ModuleIntegrationBase';
import { error } from 'src/utils/logging';

const moduleIntegrations: ModuleIntegrationBase[] = [
  new PopoutModuleIntegration(),
  // Add other module integrations here
];

export function setupModuleIntegrations(api: Tidy5eSheetsApi) {
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
