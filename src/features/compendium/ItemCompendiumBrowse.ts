import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class ItemCompendiumBrowse {
  /**
   * Check if any available compendiums return so that we
   * can try to avoid an empty compendium search. This should
   * be just a few ms based on testing at <100 compendiums.
   */
  static canBrowse(types: string[]): boolean {
    if (!types.length) {
      return false;
    }

    const sources =
      dnd5e.applications.settings.CompendiumBrowserSettingsConfig.collateSources();

    return game.packs.some((pack: any) => {
      const packTypes: string[] | undefined = pack.metadata.flags.dnd5e?.types;

      return (
        pack.metadata.type === CONSTANTS.DOCUMENT_NAME_ITEM &&
        pack.visible &&
        sources.has(pack.collection) &&
        (!packTypes || types.some((type) => packTypes.includes(type)))
      );
    });
  }

  /** "Add Item from Compendium" if it's not a single type (like spells) */
  static getLabel(types: string[]): string {
    const name =
      types.length === 1
        ? FoundryAdapter.localize(CONFIG.Item.typeLabels[types[0]])
        : FoundryAdapter.localize('DOCUMENT.Item');

    return FoundryAdapter.localize('TIDY5E.COMMON.Action.AddFromCompendium', {
      name,
    });
  }

  /** Open the compendium browser locked to supported item types. Resolves to the chosen UUID. */
  static selectOne(
    types: string[],
    detachOptions: Record<string, any>,
  ): Promise<string | null> {
    return dnd5e.applications.CompendiumBrowser.selectOne(
      {
        filters: {
          locked: {
            documentClass: CONSTANTS.DOCUMENT_NAME_ITEM,
            types: new Set(types),
          },
        },
      },
      detachOptions,
    );
  }
}
