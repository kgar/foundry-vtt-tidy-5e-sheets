import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class ItemCompendiumBrowse {
  /** Compendium item types, `undefined` = any */
  private static browsableCompendiumTypes: (string[] | undefined)[] | null = null;

  /**
   * Find all compendiums the browser would search (`CompendiumBrowser.fetch`).
   * This should keep the result available so that it's not run 20 times for
   * a tab with 20 sections.
   */
  private static getBrowsableCompendiumTypes(): (string[] | undefined)[] {
    if (this.browsableCompendiumTypes) {
      return this.browsableCompendiumTypes;
    }

    const sources =
      dnd5e.applications.settings.CompendiumBrowserSettingsConfig.collateSources();

    this.browsableCompendiumTypes = game.packs
      .filter(
        (pack: any) =>
          pack.metadata.type === CONSTANTS.DOCUMENT_NAME_ITEM &&
          pack.visible &&
          sources.has(pack.collection),
      )
      .map((pack: any) => pack.metadata.flags.dnd5e?.types);

    setTimeout(() => (this.browsableCompendiumTypes = null));

    return this.browsableCompendiumTypes!;
  }

  /**
   * Check if any available compendiums can contain these types so that
   * we can try to avoid an empty compendium search.
   */
  static canBrowse(types: string[]): boolean {
    if (!types.length) {
      return false;
    }

    return this.getBrowsableCompendiumTypes().some(
      (packTypes) =>
        !packTypes || types.some((type) => packTypes.includes(type)),
    );
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
