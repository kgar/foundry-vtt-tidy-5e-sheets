import type { ApplicationHeaderControlsEntry } from 'src/types/application.types';
import { createHeaderButton, insertHeaderButton } from './header-controls';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class ImportSheetControl {
  static actionName = 'importFromCompendium';

  static getSheetControl() {
    return {
      action: 'importFromCompendium',
      icon: 'fas fa-download',
      label: 'Import',
    };
  }

  static canImport(document: any) {
    return (
      document.constructor.name !== 'Folder' &&
      !document.isEmbedded &&
      document.compendium &&
      document.constructor.canUserCreate(game.user)
    );
  }

  static removeImportControl(controls: ApplicationHeaderControlsEntry[]) {
    const index = controls.findIndex(
      (c: ApplicationHeaderControlsEntry) => c.action === 'importFromCompendium'
    );

    if (index < 0) {
      return;
    }

    controls.splice(index, 1);
  }

  static async importFromCompendium(app: any, document: any) {
    await app.close();
    return document.collection.importFromCompendium(
      document.compendium,
      document.id
    );
  }

  static injectImportButton(app: any, frame: HTMLElement) {
    if (ImportSheetControl.canImport(app.document)) {
      const control = ImportSheetControl.getSheetControl();
      const label = FoundryAdapter.localize(control.label);

      const importFromCompendium = createHeaderButton(
        label,
        ImportSheetControl.actionName,
        control.icon
      );

      insertHeaderButton(app, frame, importFromCompendium);
    }
  }
}
