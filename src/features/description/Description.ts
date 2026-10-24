import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { EnrichmentOptions } from 'src/foundry/foundry.types';
import type { ItemDescription } from 'src/types/item.types';

export class Description {
  static async *getCustomItemDescriptions(
    document: any,
    enrichmentOptions: EnrichmentOptions,
  ): AsyncGenerator<ItemDescription> {
    const customDescriptions =
      Object.values(CONFIG.TIDY5E.item.descriptions[document.type] ?? {}) ?? [];

    for (const description of customDescriptions) {
      const visible = description.visible?.(document) ?? true;

      if (!visible) {
        continue;
      }

      const content =
        FoundryAdapter.getProperty<string>(document, description.field) ?? '';

      yield {
        enriched: await foundry.applications.ux.TextEditor.enrichHTML(
          content,
          enrichmentOptions,
        ),
        content,
        editable: description.editable?.(document) ?? true,
        field: description.field,
        label: description.label,
      };
    }
  }
}
