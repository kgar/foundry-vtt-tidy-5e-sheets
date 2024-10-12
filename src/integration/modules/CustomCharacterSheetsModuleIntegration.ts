import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import type { ModuleIntegrationBase } from '../integration-classes';

export class CustomCharacterSheetsModuleIntegration
  implements ModuleIntegrationBase
{
  get moduleId(): string {
    return 'custom-character-sheet-sections';
  }
  init(api: Tidy5eSheetsApi): void {
    Hooks.on(
      'custom-character-sheet-sections.preCustomSectionGetData',
      (data: any) => {
        return !api.isTidy5eSheet(data.actor.sheet);
      }
    );
  }
}
