import { CONSTANTS } from 'src/constants';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import type { Ability } from 'src/types/dnd5e.actor5e.types';
import type { Item5e } from 'src/types/item.types';
import type {
  ActiveEffect5e,
  ActorAbilityContextEntry,
  ActorSaves,
  ActorSheetQuadroneContext,
  DamageModificationContextEntry,
  DamageModificationData,
  SpecialTraitSectionField,
} from 'src/types/types';
import { applyThemeToApplication } from 'src/utils/applications.svelte';
import { splitSemicolons } from 'src/utils/array';
import { debug, error } from 'src/utils/logging';

/*
  TODO: Some things to remember to implement:
    - Theme Settings
    - Sheet Warnings UI / inspect warning
    - Tab Selection / etc. whatever else goes with that
    - Limited Sheet View
    - (decide) Allow Effects Management feature
    
*/

export function Tidy5eActorSheetQuadroneBase<
  TContext extends ActorSheetQuadroneContext
>(sheetType: string) {
  abstract class Tidy5eActorSheetQuadroneBase extends TidyExtensibleDocumentSheetMixin(
    sheetType,
    SvelteApplicationMixin<ApplicationConfiguration | undefined, TContext>(
      foundry.applications.sheets.ActorSheetV2
    )
  ) {
    abstract currentTabId: string;
    _context = new CoarseReactivityProvider<TContext | undefined>(undefined);

    /**
     * The cached concentration information for the character.
     */
    _concentration: { items: Set<Item5e>; effects: Set<ActiveEffect5e> } = {
      items: new Set<Item5e>(),
      effects: new Set<ActiveEffect5e>(),
    };

    constructor(options?: Partial<ApplicationConfiguration> | undefined) {
      super(options);
    }

    /**
     * A set of item types that should be prevented from being dropped on this type of actor sheet.
     */
    static unsupportedItemTypes: Set<string> = new Set();

    static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
      classes: [
        CONSTANTS.MODULE_ID,
        'sheet',
        'actor',
        sheetType,
        CONSTANTS.SHEET_LAYOUT_QUADRONE,
      ],
      window: {
        controls: [
          {
            action: 'restoreTransformation',
            icon: 'fa-solid fa-backward',
            label: 'DND5E.TRANSFORM.Action.Restore',
            ownership: 'OWNER',
            visible: function (this: Tidy5eActorSheetQuadroneBase) {
              return this.isEditable && this.actor.isPolymorphed;
            },
          },
        ],
        resizable: true,
        positioned: true,
        frame: true,
      },
      actions: {
        restoreTransformation: async function (
          this: Tidy5eActorSheetQuadroneBase
        ) {
          this.actor.revertOriginalForm();
        },
      },
      dragDrop: [
        {
          dragSelector: `[data-tidy-always-draggable]`,
          dropSelector: null,
        },
        {
          dragSelector: '[data-tidy-draggable]',
          dropSelector: null,
        },
      ],
      submitOnClose: true,
    };

    /** @inheritdoc */
    get title() {
      if (!this.actor.isToken) return this.actor.name;
      return `[${game.i18n.localize(TokenDocument.metadata.label)}] ${
        this.actor.name
      }`;
    }

    _configureEffects() {
      let first = true;

      $effect(() => {
        // Document Apps Reactivity
        game.user.apps[this.id] = this;

        return () => {
          delete game.user.apps[this.id];
        };
      });

      $effect(() => {
        if (first) return;

        applyThemeToApplication(this.element, this.actor);
        this.render();
      });

      first = false;
    }

    async _prepareContext(options: any): Promise<ActorSheetQuadroneContext> {
      const documentSheetContext = await super._prepareContext(options);

      documentSheetContext.source = documentSheetContext.editable
        ? this.actor.system._source
        : this.actor.system;

      // Concentration
      let saves: ActorSaves = {};
      if (
        [CONSTANTS.SHEET_TYPE_CHARACTER, CONSTANTS.SHEET_TYPE_NPC].includes(
          this.actor.type
        )
      ) {
        const attrConcentration = this.actor.system.attributes.concentration;
        if (
          this.actor.statuses.has(CONFIG.specialStatusEffects.CONCENTRATING) ||
          (documentSheetContext.unlocked && attrConcentration)
        ) {
          saves.concentration = {
            isConcentration: true,
            label: game.i18n.localize('DND5E.Concentration'),
            abbr: game.i18n.localize('DND5E.Concentration'),
            mod: Math.abs(attrConcentration.save),
            sign:
              this.actor.system.attributes.concentration.save < 0 ? '-' : '+',
          };
        }
      }

      let hasSpecialSaves = Object.keys(saves).length > 0;

      const rollData = this.actor.getRollData();

      let context: ActorSheetQuadroneContext = {
        abilities: [],
        actor: this.actor,
        appId: this.appId,
        config: CONFIG.DND5E,
        customActorTraits: [],
        customContent: [],
        effects: dnd5e.applications.components.EffectsElement.prepareCategories(
          this.actor.allApplicableEffects()
        ),
        elements: this.options.elements,
        flags: {
          classes: [],
          data: {},
          sections: [],
        },
        hasSpecialSaves,
        itemContext: {},
        items: Array.from(this.actor.items)
          .filter((i: Item5e) => !this.actor.items.has(i.system.container))
          .toSorted((a: Item5e, b: Item5e) => (a.sort || 0) - (b.sort || 0)),
        labels: this._getLabels(),
        limited: this.actor.limited,
        modernRules: FoundryAdapter.checkIfModernRules(this.actor),
        owner: this.actor.isOwner,
        rollData,
        saves,
        system: this.actor.system,
        tabs: [],
        token: this.token,
        traits: this._prepareTraits(this.actor.system),
        warnings: foundry.utils.deepClone(this.actor._preparationWarnings),
        ...documentSheetContext,
      };

      context.abilities = this._prepareAbilities(context);

      // Prepare owned items
      this._prepareItems(context);

      // Prepare Special Traits
      this._prepareSpecialTraitsContext(context);

      // Concentration
      this._applyConcentration(context);

      // Damage Modification
      this._applyDamageModifications(context);

      return context;
    }

    /**
     * Prepare labels object for the context.
     * @returns {object}           Object containing various labels.
     * @protected
     */
    _getLabels() {
      const labels = { ...this.actor.labels };

      // Currency Labels
      labels.currencies = Object.entries(CONFIG.DND5E.currencies).reduce<
        Record<string, any>
      >((obj, [k, c]) => {
        obj[k] = c.label;
        return obj;
      }, {});

      // Proficiency
      labels.proficiency =
        game.settings.get('dnd5e', 'proficiencyModifier') === 'dice'
          ? `d${this.actor.system.attributes.prof * 2}`
          : `+${this.actor.system.attributes.prof}`;

      return labels;
    }

    /**
     * Prepare the data structure for items which appear on the actor sheet.
     * Each subclass overrides this method to implement type-specific logic.
     * @protected
     */
    _prepareItems(context: ActorSheetQuadroneContext) {}

    /* -------------------------------------------- */

    /**
     * Prepare rendering context for the special traits tab.
     */
    async _prepareSpecialTraitsContext(context: ActorSheetQuadroneContext) {
      const sections: Record<string, SpecialTraitSectionField[]> = {};
      const source = context.editable ? this.document._source : this.document;

      context.flags.classes = Object.values(this.document.classes)
        .map((cls: Item5e) => ({ value: cls.id, label: cls.name }))
        .toSorted((lhs, rhs) =>
          lhs.label.localeCompare(rhs.label, game.i18n.lang)
        );

      context.flags.data = source.flags?.dnd5e ?? {};

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
          value: foundry.utils.getProperty(context.flags.data, key),
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

      context.flags.sections = Object.entries(sections).map(
        ([label, fields]) => ({
          label,
          fields,
        })
      );

      // Cache concentration data and prepare items
      this._concentration = this.actor.concentration;

      return context;
    }

    _applyConcentration(context: ActorSheetQuadroneContext) {
      if (
        [CONSTANTS.SHEET_TYPE_CHARACTER, CONSTANTS.SHEET_TYPE_NPC].includes(
          context.actor.type
        )
      ) {
        const attrConcentration = context.actor.system.attributes.concentration;
        if (
          context.actor.statuses.has(
            CONFIG.specialStatusEffects.CONCENTRATING
          ) ||
          (context.unlocked && attrConcentration)
        ) {
          (context.saves ??= {}).concentration = {
            isConcentration: true,
            label: game.i18n.localize('DND5E.Concentration'),
            abbr: game.i18n.localize('DND5E.Concentration'),
            mod: Math.abs(attrConcentration.save),
            sign:
              context.actor.system.attributes.concentration.save < 0
                ? '-'
                : '+',
          };
        }
      }
    }

    _prepareAbilities(
      context: ActorSheetQuadroneContext
    ): ActorAbilityContextEntry[] {
      return Object.entries<Ability>(context.system.abilities).map(
        ([key, ability]) => ({
          ...ability, // Modifier, save mod, save proficiency, score value
          key, // For saving
          abbr: CONFIG.DND5E.abilities[key]?.abbreviation ?? '', // the visible abbreviation button label
          hover: CONFIG.DND5E.proficiencyLevels[ability.proficient], // not used?
          icon: CONFIG.DND5E.abilities[key]?.icon, // not used?
          label: CONFIG.DND5E.abilities[key]?.label, // tooltip and aria label
          source: context.source.abilities[key], // source.value on the input
        })
      );
    }

    /**
     * Prepare the data structure for traits data like languages, resistances & vulnerabilities, and proficiencies.
     * @param {object} systemData  System data for the Actor being prepared.
     * @returns {object}           Prepared trait data.
     * @protected
     */
    _prepareTraits(systemData: any) {
      // TODO: strongly type this
      const traits: Record<string, any> = {};
      for (const [trait, traitConfig] of Object.entries(CONFIG.DND5E.traits)) {
        if (trait === 'dm') continue;
        const key =
          // @ts-expect-error
          traitConfig.actorKeyPath?.replace('system.', '') ?? `traits.${trait}`;
        const data = foundry.utils.deepClone(
          foundry.utils.getProperty(systemData, key)
        );

        if (!data) {
          continue;
        }

        foundry.utils.setProperty(traits, key, data);

        let values = data.value;

        if (!values) {
          values = [];
        } else if (values instanceof Set) {
          values = Array.from(values);
        } else if (!Array.isArray(values)) {
          values = [values];
        }

        // Split physical damage types from others if bypasses is set
        const physical: string[] = [];
        if (data.bypasses?.size) {
          values = values.filter((t: string) => {
            if (!CONFIG.DND5E.damageTypes[t]?.isPhysical) return true;
            physical.push(t);
            return false;
          });
        }

        data.selected = values.reduce(
          (obj: Record<string, string>, key: string) => {
            obj[key] = dnd5e.documents.Trait.keyLabel(key, { trait }) ?? key;
            return obj;
          },
          {} as Record<string, string>
        );

        // Display bypassed damage types
        if (physical.length) {
          const damageTypesFormatter = new Intl.ListFormat(game.i18n.lang, {
            style: 'long',
            type: 'conjunction',
          });
          const bypassFormatter = new Intl.ListFormat(game.i18n.lang, {
            style: 'long',
            type: 'disjunction',
          });
          data.selected.physical = game.i18n.format(
            'DND5E.DamagePhysicalBypasses',
            {
              damageTypes: damageTypesFormatter.format(
                physical.map((t) =>
                  dnd5e.documents.Trait.keyLabel(t, { trait })
                )
              ),
              bypassTypes: bypassFormatter.format(
                data.bypasses.reduce((acc: string[], t: string) => {
                  const v = CONFIG.DND5E.itemProperties[t];
                  if (v && v.isPhysical) acc.push(v.label);
                  return acc;
                }, [])
              ),
            }
          );
        }

        // Add custom entries
        if (data.custom)
          splitSemicolons(data.custom).forEach(
            (c, i) => (data.selected[`custom${i + 1}`] = c)
          );
        data.cssClass = !foundry.utils.isEmpty(data.selected) ? '' : 'inactive';

        // If petrified, display "All Damage" instead of all damage types separately
        if (
          trait === 'dr' &&
          this.document.hasConditionEffect('petrification')
        ) {
          data.selected = { custom1: game.i18n.localize('DND5E.DamageAll') };
          data.cssClass = '';
        }
      }

      return traits;
    }

    /* -------------------------------------------- */

    _applyDamageModifications(context: ActorSheetQuadroneContext) {
      try {
        const dm: DamageModificationData | undefined =
          context.actor.system.traits?.dm;
        if (dm) {
          const rollData = context.actor.getRollData({ deterministic: true });
          const mods = Object.entries(dm.amount)
            .map(([key, value]) => {
              const total = dnd5e.utils.simplifyBonus(value, rollData);
              if (!total) return null;

              const damageType =
                CONFIG.DND5E.damageTypes[
                  key as keyof typeof CONFIG.DND5E.damageTypes
                ] ?? {};

              const mod: DamageModificationContextEntry = {
                label: `${damageType?.label ?? key} ${dnd5e.utils.formatNumber(
                  total,
                  { signDisplay: 'always' }
                )}`,
                consequence: total > 0 ? 'detriment' : 'benefit',
              };
              const icons: string[] = (mod.icons = []);
              if (
                dm.bypasses.size &&
                'isPhysical' in damageType &&
                damageType?.isPhysical
              )
                icons.push(...dm.bypasses);
              return mod;
            })
            .filter((f) => f);

          context.traits.traits.dm = mods;
        }
      } catch (e) {
        error(
          'An error occurred while preparing Damage Modification data',
          false,
          e
        );
        debug('Damage Modification error troubleshooting info', { context });
      }
    }
  }

  return Tidy5eActorSheetQuadroneBase;
}
