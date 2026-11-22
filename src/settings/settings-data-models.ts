import type { SheetTabsConfiguration } from './settings.types';
import type { DataSchema } from 'foundry-types';

export const TabConfigurationSchema = new foundry.data.fields.SchemaField(
  {
    // TODO: Determine if we want to commit to this approach
    // version: new foundry.data.fields.StringField({
    //   required: true,
    //   nullable: false,
    //   blank: false,
    //   initial: "1"
    // }),
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
 * Visible tab IDs in display order. Use the new `tabs` map first then
 * fall back to the legacy `selected` array.
 */
export function getSelectedTabIds(
  config: SheetTabsConfiguration | undefined | null,
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
 */
export function getTabVisibilityLevels(
  config: SheetTabsConfiguration | undefined | null,
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

export class ThemeSettingModel extends foundry.abstract.DataModel {
  static defineSchema(): DataSchema {
    return {
      accentColor: new fields.StringField({
        required: false,
        nullable: true,
      }),
      useBasicTheme: new fields.BooleanField({
        required: false,
      }),
      useHeaderBackground: new fields.BooleanField({
        required: false,
      }),
      headerColor: new fields.StringField({
        required: false,
        nullable: true,
      }),
      actorHeaderBackground: new fields.StringField({
        required: false,
        nullable: true,
      }),
      headerBackgroundColor: new fields.StringField({
        required: false,
        nullable: true,
      }),
      itemSidebarBackground: new fields.StringField({
        required: false,
        nullable: true,
      }),
      portraitShape: new fields.StringField({
        required: false,
        nullable: true,
      }),
      rarityColors: new fields.TypedObjectField(
        new fields.StringField({ required: true, nullable: false }),
        { required: false },
      ),
      spellPreparationMethodColors: new fields.TypedObjectField(
        new fields.StringField({ required: true, nullable: false }),
        { required: false },
      ),
    };
  }
}

export class WorldThemeSettingsModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      id: new fields.StringField({
        required: true,
        nullable: false,
        blank: false,
      }),
      name: new fields.StringField({
        required: true,
        nullable: false,
        blank: true,
        initial: '',
      }),
      documentNames: new fields.ArrayField(
        new fields.StringField({
          required: true,
          nullable: false,
          blank: false,
        }),
        {
          required: false,
          nullable: true,
        },
      ),
      types: new fields.ArrayField(
        new fields.StringField({
          required: true,
          nullable: false,
          blank: false,
        }),
        {
          required: false,
          nullable: true,
        },
      ),
      sort: new fields.NumberField({
        required: true,
        nullable: false,
        initial: Number.MAX_SAFE_INTEGER,
      }),
      settings: new fields.EmbeddedDataField(ThemeSettingModel, {
        required: true,
        nullable: false,
      }),
      filter: new fields.StringField({
        required: false,
        nullable: true,
        blank: true,
        trim: false,
      }),
      filterMode: new fields.StringField({
        required: true,
        nullable: false,
        blank: false,
        choices: ['basic', 'advanced'],
        initial: 'basic',
      }),
    };
  }
}

const fields = foundry.data.fields;

export function getWorldThemesSettingsDataModel() {
  return new fields.TypedObjectField(
    new fields.EmbeddedDataField(WorldThemeSettingsModel),
    {
      hint: 'The keys are the IDs of the various theme settings.',
      required: true,
      nullable: false,
      initial: () => ({}),
    },
  );
}
