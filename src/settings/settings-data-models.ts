import type {
  SheetTabConfigEntry,
  SheetTabsConfiguration,
} from './settings.types';

export const TabConfigurationSchema = new foundry.data.fields.SchemaField(
  {
    tabs: new foundry.data.fields.TypedObjectField(
      new foundry.data.fields.SchemaField({
        key: new foundry.data.fields.StringField({
          required: true,
          nullable: false,
          blank: false,
        }),
        order: new foundry.data.fields.NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 0,
        }),
        show: new foundry.data.fields.BooleanField({
          required: true,
          nullable: false,
          initial: true,
        }),
        visibilityLevel: new foundry.data.fields.NumberField({
          required: false,
          nullable: true,
          initial: null,
        }),
      }),
      { initial: {} },
    ),
  },
  { initial: {} },
  { name: 'Tab Configuration' },
);

/**
 * Build the tabs from legacy `selected` + * `visibilityLevels`. Visible tabs
 * come first in saved order, then any remaining known tabs (hidden), preserving
 * each tab's visibility level.
 * TODO: Migrate off the legacy tab settings.
 */
export function deriveTabsFromLegacyTabConfiguration(
  selected: string[] | undefined | null,
  visibilityLevels: Record<string, number | null> | undefined | null,
): Record<string, SheetTabConfigEntry> {
  const result: Record<string, SheetTabConfigEntry> = {};
  let order = 0;

  for (const key of selected ?? []) {
    if (result[key]) {
      continue;
    }
    result[key] = {
      key,
      order: order++,
      show: true,
      visibilityLevel: visibilityLevels?.[key] ?? null,
    };
  }

  for (const key of Object.keys(visibilityLevels ?? {})) {
    if (result[key]) {
      continue;
    }
    result[key] = {
      key,
      order: order++,
      show: false,
      visibilityLevel: visibilityLevels?.[key] ?? null,
    };
  }

  return result;
}

/**
 * Visible tab IDs in display order. Use the new `tabs` map first then
 * fall back to the legacy `selected` array.
 * TODO: Migrate off the legacy tab settings, then drop the fallback.
 */
export function getSelectedTabIds(
  config: SheetTabsConfiguration | undefined | null
): string[] {
  const tabs = config?.tabs;
  if (tabs && Object.keys(tabs).length) {
    return Object.values(tabs)
      .filter((t) => t.show)
      .sort((a, b) => a.order - b.order)
      .map((t) => t.key);
  }
  return [];
}

/**
 * Per-tab viewer visibility levels by tab ID. Use the new `tabs` map first
 * then fall back to `visibilityLevels`
 * TODO: Migrate off the legacy tab settings, then drop the fallback.
 */
export function getTabVisibilityLevels(
  config: SheetTabsConfiguration | undefined | null
): Record<string, number | null> {
  const tabs = config?.tabs;
  if (tabs && Object.keys(tabs).length) {
    return Object.values(tabs).reduce<Record<string, number | null>>(
      (prev, t) => {
        prev[t.key] = t.visibilityLevel;
        return prev;
      },
      {},
    );
  }
  return {};
}

export const HeaderControlConfigurationSchema =
  new foundry.data.fields.SchemaField({
    menu: new foundry.data.fields.ArrayField(
      new foundry.data.fields.StringField({
        required: true,
        nullable: false,
        blank: false,
      }),
      { initial: [] },
    ),
    header: new foundry.data.fields.ArrayField(
      new foundry.data.fields.StringField({
        required: true,
        nullable: false,
        blank: false,
      }),
      { initial: [] },
    ),
  });
