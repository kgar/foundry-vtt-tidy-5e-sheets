import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import type { ModuleIntegrationBase } from 'src/integration/integration-classes';
import { DRAKKENHEIM_CORE_CONSTANTS } from './DrakkenheimCoreConstants';
import { registerDrakkenheimContaminationTab } from './drakkenheim-functions';

export class SebastianCrowesGuideToDrakkenheimModuleIntegration
  implements ModuleIntegrationBase
{
  get moduleId(): string {
    return DRAKKENHEIM_CORE_CONSTANTS.SEBASTIAN_CROWE_MODULE_ID;
  }

  init(api: Tidy5eSheetsApi): void {
    registerDrakkenheimContaminationTab(api, this.moduleId);
  }
}
