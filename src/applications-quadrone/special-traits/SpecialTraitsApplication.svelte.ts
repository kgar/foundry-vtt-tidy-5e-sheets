import { CONSTANTS } from 'src/constants';
import { DocumentSheetDialog } from '../DocumentSheetDialog.svelte';
import type {
  ApplicationConfiguration,
  DocumentSheetApplicationConfiguration,
} from 'src/types/application.types';
import { mount } from 'svelte';
import type {
  Actor5e,
  SpecialTraitSectionField,
  SpecialTraits as Flags,
} from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import SpecialTraits from './SpecialTraits.svelte';

export type SpecialTraitsContext = {
  actor: Actor5e;
  flags: Flags;
};

export class SpecialTraitsApplication extends DocumentSheetDialog<DocumentSheetApplicationConfiguration>() {
  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application',
      'quadrone',
      'special-traits',
      'scrollable-window-content',
    ],
    tag: 'div',
    id: 'special-traits-{id}',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      contentClasses: [],
    },
    position: {
      width: 360,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(
    node: HTMLElement,
    context: SpecialTraitsContext
  ): Record<string, any> {
    this._context.data = context;

    const component = mount(SpecialTraits, {
      target: node,
      context: new Map<string, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
      ]),
    });

    return component;
  }

  async _prepareContext(options = {}): Promise<SpecialTraitsContext> {
    return {
      actor: this.document,
      flags: await this._prepareSpecialTraitsContext(),
    };
  }

  /**
   * Prepare rendering context for the special traits tab.
   */
  async _prepareSpecialTraitsContext(): Promise<Flags> {
    let flags: Flags = {
      classes: [],
      data: [],
      sections: [],
    };
    const sections: Record<string, SpecialTraitSectionField[]> = {};

    // Always show the effective value, after active effects, because Special Traits application
    //  doesn't have a sheet mode mechanism to toggle views.
    const source = this.document;

    flags.classes = Object.values(this.document.classes)
      .map((cls: Item5e) => ({ value: cls.id, label: cls.name }))
      .toSorted((lhs, rhs) =>
        lhs.label.localeCompare(rhs.label, game.i18n.lang)
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

    addBonus(this.document.system.schema.fields.bonuses);

    if (globals.length) {
      sections[game.i18n.localize('DND5E.BONUSES.FIELDS.bonuses.label')] =
        globals;
    }

    flags.sections = Object.entries(sections).map(([label, fields]) => ({
      label,
      fields,
    }));

    if (this.document.type === CONSTANTS.SHEET_TYPE_NPC) {
      flags.sections.unshift({
        label: game.i18n.localize('DND5E.NPC.Label'),
        fields: [
          {
            field: this.document.system.schema.fields.traits.fields.important,
            name: 'system.traits.important',
            value: this.document.system.traits.important,
          },
        ],
      });
    }

    return flags;
  }
}
