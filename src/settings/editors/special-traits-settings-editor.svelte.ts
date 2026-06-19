import type {
  Actor5e,
  SpecialTraitSectionField,
  SpecialTraits as Flags,
} from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import type { SettingsEditor } from './settings-editors.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type SpecialTraitsContext = {
  flags: Flags;
  originalClass: string | undefined;
};

export type SpecialTraitsSettingsEditor =
  SettingsEditor<SpecialTraitsContext> & {
    document: any;
  };

export function getSpecialTraitsSettingsEditor(
  document: Actor5e,
): SpecialTraitsSettingsEditor {
  const current = $state<SpecialTraitsContext>(getConfig());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  const hasChanges = $derived(
    JSON.stringify(buildDocumentUpdateObject(current)) !== initialSnapshot,
  );

  function snapshotConfig(config: SpecialTraitsContext) {
    return buildDocumentUpdateObject(config);
  }

  function buildDocumentUpdateObject(config: SpecialTraitsContext) {
    const toSave: Record<string, any> = {
      ['system.details.originalClass']: config.originalClass,
    };

    config.flags.sections
      .flatMap((x) => x.fields)
      .forEach((field) => {
        toSave[field.name] = field.value;
      });
    return toSave;
  }

  function getConfig(): SpecialTraitsContext {
    let flags: Flags = {
      classes: [],
      data: [],
      sections: [],
    };
    const sections: Record<string, SpecialTraitSectionField[]> = {};

    // Always show the effective value, after active effects, because Special Traits application
    //  doesn't have a sheet mode mechanism to toggle views.
    const source = document;

    flags.classes = Object.values(document.classes)
      .map((cls: Item5e) => ({ value: cls.id, label: cls.name }))
      .toSorted((lhs, rhs) =>
        lhs.label.localeCompare(rhs.label, game.i18n.lang),
      );

    flags.data = source.flags?.dnd5e ?? {};

    // Character Flags - don't be fooled by the config prop name. It's for PCs and NPCs.
    for (const [key, config] of Object.entries(CONFIG.DND5E.characterFlags)) {
      const fieldOptions = { label: config.name, hint: config.hint };

      const flag: SpecialTraitSectionField = {
        field:
          'type' in config && config.type === Boolean
            ? new foundry.data.fields.BooleanField(fieldOptions)
            : 'type' in config && config.type === Number
              ? new foundry.data.fields.NumberField(fieldOptions)
              : new foundry.data.fields.StringField(fieldOptions),
        ...config,
        name: `flags.dnd5e.${key}`,
        value: foundry.utils.getProperty(flags.data, key),
      };

      sections[config.section] ??= [];
      sections[config.section].push(flag);
    }

    // Global Bonuses
    const globals: SpecialTraitSectionField[] = [];
    const addBonus = (field: any) => {
      if (field === undefined) {
        return;
      }

      if (field instanceof foundry.data.fields.SchemaField) {
        Object.values(field.fields).forEach((f) => addBonus(f));
      } else {
        globals.push({
          field,
          name: field.fieldPath,
          value: foundry.utils.getProperty(source, field.fieldPath),
        });
      }
    };

    addBonus(document.system.schema.fields.bonuses);

    if (globals.length) {
      sections[game.i18n.localize('DND5E.BONUSES.FIELDS.bonuses.label')] =
        globals;
    }

    flags.sections = Object.entries(sections).map(([label, fields]) => ({
      label,
      fields,
    }));

    if (document.system.isNPC) {
      flags.sections.unshift({
        label: game.i18n.localize('DND5E.NPC.Label'),
        fields: [
          {
            field: document.system.schema.fields.traits.fields.important,
            name: 'system.traits.important',
            value: document.system.traits.important,
          },
        ],
      });
    }

    return { flags, originalClass: document.system.details.originalClass };
  }

  return {
    get hasChanges() {
      return hasChanges;
    },

    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    resetToDefault() {
      current.originalClass = undefined;
      current.flags.sections
        .flatMap((section) => section.fields)
        .forEach((field) => {
          current.flags.data[field.name] = field.field.initial;
          field.value = field.field.initial;
        });
    },

    async save() {
      const toSave: Record<string, any> = buildDocumentUpdateObject(current);
      await document.update(toSave);

      initialSnapshot = JSON.stringify(snapshotConfig(this.value));
    },

    undoChanges() {
      this.value = getConfig();
      initialSnapshot = JSON.stringify(snapshotConfig(this.value));
    },

    async useDefault() {
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: {
          title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
        },
        content: `<p>${FoundryAdapter.localize(
          'TIDY5E.UseDefaultDialog.text',
        )}</p>`,
      });

      if (!proceed) {
        return;
      }

      this.resetToDefault();
    },

    get value() {
      return current;
    },

    set value(value) {
      // const flatRecord = buildDocumentUpdateObject(value);
      // current.originalClass = flatRecord['system.details.originalClass'];
      // current.flags.sections
      //   .flatMap((section) => section.fields)
      //   .forEach((field) => {
      //     current.flags.data[field.name] = flatRecord[field.name];
      //     field.value = flatRecord[field.name];
      //   });
      current.flags = value.flags;
      current.originalClass = value.originalClass;
    },

    document,
  };
}
