import type { SheetTabConfigEntry } from './settings.types';

export const TabConfigurationSchema = new foundry.data.fields.SchemaField(
  {
    selected: new foundry.data.fields.ArrayField(
      new foundry.data.fields.StringField({
        required: true,
        nullable: false,
        blank: false,
      }),
      { initial: [] }
    ),
    visibilityLevels: new foundry.data.fields.TypedObjectField(
      new foundry.data.fields.NumberField({
        required: true,
        nullable: true,
      }),
      { initial: {} }
    ),
    
    // New keyed tab configuration. Populated from `selected`/`visibilityLevels`
    // on load from legacy fields
    // TODO: Migrate off the legacy tab settings.
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
      { initial: {} }
    ),
  },
  { initial: {} },
  { name: 'Tab Configuration' }
);

/**
 * Build the tabs from legacy `selected` + * `visibilityLevels`. Visible tabs 
 * come first in saved order, then any remaining known tabs (hidden), preserving
 * each tab's visibility level.
 * TODO: Migrate off the legacy tab settings.
 */
export function deriveTabsFromLegacyTabConfiguration(
  selected: string[] | undefined | null,
  visibilityLevels: Record<string, number | null> | undefined | null
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

export const HeaderControlConfigurationSchema =
  new foundry.data.fields.SchemaField({
    menu: new foundry.data.fields.ArrayField(
      new foundry.data.fields.StringField({
        required: true,
        nullable: false,
        blank: false,
      }),
      { initial: [] }
    ),
    header: new foundry.data.fields.ArrayField(
      new foundry.data.fields.StringField({
        required: true,
        nullable: false,
        blank: false,
      }),
      { initial: [] }
    ),
  });
