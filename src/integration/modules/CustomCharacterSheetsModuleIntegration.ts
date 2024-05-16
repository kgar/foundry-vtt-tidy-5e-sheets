import type { ModuleIntegrationBase } from '../ModuleIntegrationBase';

export class CustomCharacterSheetsModuleIntegration
  implements ModuleIntegrationBase
{
  get moduleId(): string {
    return 'custom-character-sheet-sections';
  }
  init(): void {
    Hooks.on(
      'custom-character-sheet-sections.preCustomSectionGetData',
      () => false
    );
  }
}
