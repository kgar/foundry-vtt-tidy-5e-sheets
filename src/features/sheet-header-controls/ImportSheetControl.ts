import type { CustomHeaderControlsEntry } from 'src/api/api.types';

export class ImportSheetControl {
  static actionName = 'importFromCompendium';

  static getSheetControl(): CustomHeaderControlsEntry {
    return {
      action: 'importFromCompendium',
      icon: 'fas fa-download',
      label: 'Import',
      visible(this: any) {
        const document = this.document;
        const inCompendium =
          game.release.generation < 13
            ? document.compendium
            : document.inCompendium;

        return (
          document.constructor.name !== 'Folder' &&
          !document.isEmbedded &&
          inCompendium &&
          document.constructor.canUserCreate(game.user)
        );
      },
      position: 'header',
    };
  }

  static async importFromCompendium(app: any, document: any) {
    await app.close();
    const pack = game.packs.get(document.pack);
    const collection = game.collections.get(document.documentName);
    return collection.importFromCompendium(pack, document.id);
  }
}
