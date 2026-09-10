import type {
  Actor5e,
  SpecialTraitSectionField,
  SpecialTraits as Flags,
} from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import {
  confirmUseDefault,
  type SettingsEditor,
} from './settings-editors.svelte';
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
      .forEach((fieldOrGroup) => {
        const fields =
          'group' in fieldOrGroup ? fieldOrGroup.fields : [fieldOrGroup];
        fields.forEach((field) => {
          toSave[field.name] = field.value;
        });
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

    // Do NOT show the effective value (after active effects), because it will
    // lead to a compounding stacking of bonuses being saved to the source data.
    const source = document.toObject();

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
    const addBonus = (field: any, checkName = false) => {
      if (field instanceof foundry.data.fields.SchemaField) {
        Object.values(field.fields).forEach((f) => addBonus(f, checkName));
      } else if (!checkName || field.name === 'bonus') {
        globals.push({
          field,
          name: field.fieldPath,
          value: foundry.utils.getProperty(source, field.fieldPath),
        });
      }
    };

    addBonus(document.system.schema.fields.bonuses);
    addBonus(document.system.schema.fields.rolls, true);

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
            field: document.system.schema.fields.identifier,
            hint: 'DND5E.IdentifierError',
            name: 'system.identifier',
            placeholder: document.identifier,
            value: source.system.identifier,
          },
          {
            field: document.system.schema.fields.traits.fields.important,
            name: 'system.traits.important',
            value: source.system.traits.important,
          },
          {
            group: {
              label: 'DND5E.NPC.FIELDS.attributes.price.label',
              hint: 'DND5E.NPC.FIELDS.attributes.price.hint',
            },
            fields: [
              {
                classes: 'label-top',
                field:
                  document.system.schema.fields.attributes.fields.price.fields
                    .value,
                name: 'system.attributes.price.value',
                value: source.system.attributes.price.value,
                label:
                  document.system.schema.fields.attributes.fields.price.fields
                    .value.label,
              },
              {
                choices: CONFIG.DND5E.currencies,
                classes: 'label-top',
                field:
                  document.system.schema.fields.attributes.fields.price.fields
                    .denomination,
                name: 'system.attributes.price.denomination',
                value: source.system.attributes.price.denomination,
                label:
                  document.system.schema.fields.attributes.fields.price.fields
                    .denomination.label,
              },
            ],
          },
        ],
      });
    }

    return { flags, originalClass: source.system.details.originalClass };
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
      function resetField(field: SpecialTraitSectionField) {
        current.flags.data[field.name] = field.field.initial;
        field.value = field.field.initial;
      }

      current.originalClass = undefined;
      current.flags.sections
        .flatMap((section) => section.fields)
        .forEach((fieldOrGroup) => {
          if ('group' in fieldOrGroup) {
            fieldOrGroup.fields.forEach(resetField);
          } else {
            resetField(fieldOrGroup);
          }
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
      const proceed = await confirmUseDefault();

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
