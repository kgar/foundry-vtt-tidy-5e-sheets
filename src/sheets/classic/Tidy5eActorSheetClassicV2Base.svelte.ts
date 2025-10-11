import ClassicTabSelectionFormApplication from 'src/applications/tab-selection/ClassicTabSelectionFormApplication.svelte';
import { ThemeSettingsFormApplication } from 'src/applications/theme/ThemeSettingsFormApplication.svelte';
import { CONSTANTS } from 'src/constants';
import {
  actorUsesActionFeature,
  getActorActionSections,
} from 'src/features/actions/actions.svelte';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { DropEffectValue } from 'src/mixins/DragAndDropBaseMixin';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import {
  TidyExtensibleDocumentSheetMixin,
  type TidyDocumentSheetRenderOptions,
} from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { settings, systemSettings } from 'src/settings/settings.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type { Item5e } from 'src/types/item.types';
import type {
  ActorSaves,
  ActorSheetContextV1,
  DamageModificationContextEntry,
  DamageModificationData,
  SpecialTraitSectionField,
} from 'src/types/types';
import { splitSemicolons } from 'src/utils/array';
import { isNil } from 'src/utils/data';
import { debug, error } from 'src/utils/logging';
import { firstOfSet } from 'src/utils/set';
import { mount } from 'svelte';
import AttachedInfoCard from 'src/components/info-card/AttachedInfoCard.svelte';
import SheetHeaderModeToggleV2 from './shared/SheetHeaderModeToggleV2.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';

// TODO: Simplify mixins to mostly a class hierarchy
export function Tidy5eActorSheetClassicV2Base<
  TContext extends ActorSheetContextV1
>(sheetType: string) {
  abstract class Tidy5eActorSheetClassicV2Base extends TidyExtensibleDocumentSheetMixin(
    sheetType,
    SvelteApplicationMixin<ApplicationConfiguration | undefined, TContext>(
      foundry.applications.sheets.ActorSheetV2
    )
  ) {
    abstract currentTabId: string;
    _context = new CoarseReactivityProvider<TContext | undefined>(undefined);
    itemFilterService: ItemFilterService;

    constructor(options?: Partial<ApplicationConfiguration> | undefined) {
      super(options);

      this.itemFilterService = new ItemFilterService({}, this.actor);
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
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
      ],
      window: {
        controls: [
          {
            action: 'openTabSelection',
            icon: 'fas fa-file-invoice',
            label: 'TIDY5E.TabConfiguration.MenuOptionText',
            visible: function (this: Tidy5eActorSheetClassicV2Base) {
              return this.isEditable;
            },
          },
          {
            action: 'restoreTransformation',
            icon: 'fa-solid fa-backward',
            label: 'DND5E.TRANSFORM.Action.Restore',
            ownership: 'OWNER',
            visible: Tidy5eActorSheetClassicV2Base.#canRestoreTransformation,
          },
          {
            action: 'openThemeSettings',
            icon: 'fas fa-swatchbook',
            label: 'TIDY5E.ThemeSettings.SheetMenu.buttonLabel',
            ownership: 'OWNER',
            visible: function (this: Tidy5eActorSheetClassicV2Base) {
              return this.isEditable;
            },
          },
        ],
        resizable: true,
        positioned: true,
        frame: true,
      },
      actions: {
        inspectWarning: Tidy5eActorSheetClassicV2Base.#inspectWarning,
        openTabSelection: async function (this: Tidy5eActorSheetClassicV2Base) {
          new ClassicTabSelectionFormApplication(this.actor).render(true);
        },
        openThemeSettings: async function (
          this: Tidy5eActorSheetClassicV2Base
        ) {
          await new ThemeSettingsFormApplication().render({ force: true });
        },
        restoreTransformation: async function (
          this: Tidy5eActorSheetClassicV2Base
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

    async _prepareContext(options: any): Promise<ActorSheetContextV1> {
      this.itemFilterService.refreshFilters();

      const documentSheetContext = await super._prepareContext(options);

      // The Actor's data
      documentSheetContext.source = documentSheetContext.editable
        ? this.actor.system._source
        : this.actor.system;

      const source = documentSheetContext.source;

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

      // Temporary HP
      const hp = { ...this.actor.system.attributes.hp };
      if (hp.temp === 0) delete hp.temp;
      if (hp.tempmax === 0) delete hp.tempmax;

      const editable = this.isEditable;

      const warnings = foundry.utils.deepClone(this.actor._preparationWarnings);

      const rollData = this.actor.getRollData();

      let context: ActorSheetContextV1 = {
        abilities: foundry.utils.deepClone(this.actor.system.abilities),
        actions: await getActorActionSections(this.actor),
        actor: this.actor,
        actorPortraitCommands:
          ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
        allowEffectsManagement: true,
        appId: this.appId,
        biographyHTML: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.biography.value,
          {
            secrets: this.actor.isOwner,
            rollData: rollData,
            relativeTo: this.actor,
          }
        ),
        config: CONFIG.DND5E,
        customActorTraits: [],
        customContent: [],
        disableExperience:
          systemSettings.value.levelingMode ===
          CONSTANTS.SYSTEM_SETTING_LEVELING_MODE_NO_XP,
        effects: dnd5e.applications.components.EffectsElement.prepareCategories(
          this.actor.allApplicableEffects()
        ),
        elements: this.options.elements,
        encumbrance: this.actor.system.attributes?.encumbrance,
        filterData: { ...this.actor.system.attributes.hp },
        filterPins: ItemFilterRuntime.defaultFilterPins[this.actor.type],
        flags: {
          classes: [],
          data: {},
          sections: [],
        },
        hasSpecialSaves: hasSpecialSaves,
        healthPercentage: this.actor.system.attributes.hp.pct.toNearest(0.1),
        hp: hp,
        isCharacter: this.actor.type === 'character',
        isNPC: this.actor.type === 'npc',
        isVehicle: this.actor.type === 'vehicle',
        limited: this.actor.limited,
        itemContext: {},
        items: Array.from(this.actor.items)
          .filter((i: Item5e) => !this.actor.items.has(i.system.container))
          .toSorted((a: Item5e, b: Item5e) => (a.sort || 0) - (b.sort || 0)),
        labels: this._getLabels(),
        lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
        lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
        lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
        lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
        lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
        lockSensitiveFields:
          (!documentSheetContext.unlocked &&
            settings.value.useTotalSheetLock) ||
          !editable,
        modernRules: FoundryAdapter.checkIfModernRules(this.actor),
        movement: this._getMovementSpeed(this.actor.system),
        options: this.options,
        overrides: {
          attunement: foundry.utils.hasProperty(
            this.actor.overrides,
            'system.attributes.attunement.max'
          ),
        },
        owner: this.actor.isOwner,
        saves: saves,
        rollData: rollData,
        senses: this._getSenses(this.actor.system),
        skills: foundry.utils.deepClone(this.actor.system.skills ?? {}),
        showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
        system: this.actor.system,
        tabs: [],
        tools: foundry.utils.deepClone(this.actor.system.tools ?? {}),
        traits: this._prepareTraits(this.actor.system),
        useActionsFeature: actorUsesActionFeature(this.actor),
        useClassicControls: true,
        useRoundedPortraitStyle: [
          CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
          CONSTANTS.CIRCULAR_PORTRAIT_OPTION_CHARACTER as string,
        ].includes(settings.value.useCircularPortraitStyle),
        viewableWarnings:
          warnings?.filter((w: any) => !isNil(w.message?.trim(), '')) ?? [],
        warnings: warnings,
        ...documentSheetContext,
      };

      // Ability Scores
      for (const [a, abl] of Object.entries<any>(context.abilities)) {
        abl.icon = this._getProficiencyIcon(abl.proficient);
        abl.hover = CONFIG.DND5E.proficiencyLevels[abl.proficient];
        abl.label = CONFIG.DND5E.abilities[a]?.label;
        abl.baseProf = source.abilities[a]?.proficient ?? 0;
        abl.key = a;
      }

      // Skills & tools.
      const baseAbility = (prop: string, key: string) => {
        let src = source[prop]?.[key]?.ability;
        if (src) return src;
        if (prop === 'skills') src = CONFIG.DND5E.skills[key]?.ability;
        return src ?? 'int';
      };
      (['skills', 'tools'] as const).forEach((prop) => {
        for (const [key, entry] of Object.entries<any>(context[prop])) {
          entry.abbreviation =
            CONFIG.DND5E.abilities[entry.ability]?.abbreviation;
          entry.icon = this._getProficiencyIcon(entry.value);
          entry.hover = CONFIG.DND5E.proficiencyLevels[entry.value];
          entry.label =
            prop === 'skills'
              ? CONFIG.DND5E.skills[key]?.label
              : dnd5e.documents.Trait.keyLabel(key, { trait: 'tool' });
          entry.baseValue = source[prop]?.[key]?.value ?? 0;
          entry.baseAbility = baseAbility(prop, key);
        }
      });

      // Prepare owned items
      this._prepareItems(context);

      // Prepare Special Traits
      this._prepareSpecialTraitsContext(context);

      // Concentration
      this._applyConcentration(context);

      // Damage Modification
      this._applyDamageModifications(context);

      // Special Saves (like Concentration save)
      context.hasSpecialSaves = Object.keys(context.saves ?? {}).length > 0;

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
     * Prepare the display of movement speed data for the Actor.
     * @param {object} systemData               System data for the Actor being prepared.
     * @param {boolean} [largestPrimary=false]  Show the largest movement speed as "primary", otherwise show "walk".
     * @returns {{primary: string, special: string}}
     * @protected
     */
    _getMovementSpeed(systemData: any, largestPrimary = false) {
      const movement = systemData.attributes.movement ?? {};

      // Prepare an array of available movement speeds
      let speeds = [
        [
          movement.burrow,
          `${game.i18n.localize('DND5E.MovementBurrow')} ${movement.burrow}`,
        ],
        [
          movement.climb,
          `${game.i18n.localize('DND5E.MovementClimb')} ${movement.climb}`,
        ],
        [
          movement.fly,
          `${game.i18n.localize('DND5E.MovementFly')} ${movement.fly}${
            movement.hover
              ? ` (${game.i18n.localize('DND5E.MovementHover')})`
              : ''
          }`,
        ],
        [
          movement.swim,
          `${game.i18n.localize('DND5E.MovementSwim')} ${movement.swim}`,
        ],
      ];
      if (largestPrimary) {
        speeds.push([
          movement.walk,
          `${game.i18n.localize('DND5E.MovementWalk')} ${movement.walk}`,
        ]);
      }

      // Filter and sort speeds on their values
      speeds = speeds.filter((s) => s[0]).sort((a, b) => b[0] - a[0]);
      const units = movement.units ?? dnd5e.utils.defaultUnits('length');

      // Case 1: Largest as primary
      if (largestPrimary) {
        let primary = speeds.shift();
        return {
          primary: `${primary?.[1]} ${units}`,
          special: speeds.map((s) => s[1]).join(', '),
        };
      }

      // Case 2: Walk as primary
      else {
        return {
          primary: dnd5e.utils.formatLength(movement.walk ?? 0, units),
          special: speeds.length ? speeds.map((s) => s[1]).join(', ') : '',
        };
      }
    }

    /* -------------------------------------------- */

    /**
     * Prepare senses object for display.
     * @param {object} systemData  System data for the Actor being prepared.
     * @returns {object}           Senses grouped by key with localized and formatted string.
     * @protected
     */
    _getSenses(systemData: any) {
      const senses = systemData.attributes.senses ?? {};
      const tags: Record<string, string> = {};
      const units = senses.units ?? dnd5e.utils.defaultUnits('length');
      for (let [k, label] of Object.entries(CONFIG.DND5E.senses)) {
        const v = senses[k] ?? 0;
        if (v === 0) continue;
        tags[k] = `${game.i18n.localize(label)} ${dnd5e.utils.formatLength(
          v,
          units
        )}`;
      }
      if (senses.special)
        splitSemicolons(senses.special).forEach(
          (c, i) => (tags[`custom${i + 1}`] = c)
        );
      return tags;
    }

    /* -------------------------------------------- */

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

    _applyConcentration(context: ActorSheetContextV1) {
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

    _applyDamageModifications(context: ActorSheetContextV1) {
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

    /* -------------------------------------------- */

    /**
     * Prepare the data structure for items which appear on the actor sheet.
     * Each subclass overrides this method to implement type-specific logic.
     * @protected
     */
    _prepareItems(context: ActorSheetContextV1) {}

    /* -------------------------------------------- */

    /**
     * Prepare rendering context for the special traits tab.
     */
    async _prepareSpecialTraitsContext(context: ActorSheetContextV1) {
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

      return context;
    }

    /* -------------------------------------------- */

    /**
     * Get the font-awesome icon used to display a certain level of skill proficiency.
     * @param {number} level  A proficiency mode defined in `CONFIG.DND5E.proficiencyLevels`.
     * @returns {string}      HTML string for the chosen icon.
     * @private
     */
    _getProficiencyIcon(level: number) {
      const icons: Record<number, string> = {
        0: '<i class="far fa-circle"></i>',
        0.5: '<i class="fas fa-adjust"></i>',
        1: '<i class="fas fa-check"></i>',
        2: '<i class="fas fa-check-double"></i>',
      };
      return icons[level] || icons[0];
    }

    /**
     * Perform any dynamic behavior on controls which depends on the current state of the sheet.
     * @returns
     */
    _getHeaderControls() {
      const controls = super._getHeaderControls();

      return controls;
    }

    _createAdditionalComponents(content: HTMLElement) {
      const windowHeader = this.element.querySelector('.window-header');
      const sheetLock = mount(SheetHeaderModeToggleV2, {
        target: windowHeader,
        anchor: windowHeader.querySelector('.window-title'),
        context: new Map<string, any>([
          [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        ]),
        props: {
          class: 'header-control',
        },
      });

      const infoCard = mount(AttachedInfoCard, {
        target: this.element,
        props: {
          sheet: this,
        },
      });

      return [sheetLock, infoCard];
    }

    /* -------------------------------------------- */
    /*  Life-Cycle Handlers                         */
    /* -------------------------------------------- */
    /** @inheritDoc */
    async _onRender(
      context: TContext,
      options: TidyDocumentSheetRenderOptions
    ) {
      await super._onRender(context, options);

      // Apply attribution & reference tooltips
      this.element
        .querySelectorAll('[data-attribution],[data-reference-tooltip]')
        .forEach((e: HTMLElement) => this._applyTooltips(e));
    }

    /**
     * Apply a property attribution tooltip to an element.
     * @param {HTMLElement} element  The element to get the tooltip.
     * @protected
     */
    _applyTooltips(element: HTMLElement) {
      if ('tooltip' in element.dataset) return;
      const uuid = element.dataset.referenceTooltip ?? this.actor.uuid;
      element.dataset.tooltip = `
      <section class="loading" data-uuid="${uuid}"><i class="fas fa-spinner fa-spin-pulse"></i></section>
    `;
      if (element.dataset.attribution)
        element.dataset.tooltipClass = 'property-attribution';
    }

    async _renderFrame(options: ApplicationRenderOptions = {}) {
      const html = await super._renderFrame(options);
      if (!game.user.isGM && this.actor.limited) return html;

      // Preparation warnings.
      const warnings = document.createElement('button');
      warnings.classList.add('preparation-warnings', 'header-control', 'icon');
      warnings.dataset.tooltip = 'Warnings';
      warnings.setAttribute('aria-label', game.i18n.localize('Warnings'));
      warnings.setAttribute('type', 'button');
      warnings.innerHTML = '<i class="fas fa-triangle-exclamation"></i>';
      warnings.addEventListener('click', this._onOpenWarnings.bind(this));

      const header = html.querySelector('.window-header');
      header
        .querySelector('.window-title')
        .insertAdjacentElement('afterend', warnings);

      return html;
    }

    /**
     * Handle opening the warnings dialog.
     * @param {PointerEvent} event  The triggering event.
     * @protected
     */
    _onOpenWarnings(event: MouseEvent) {
      event.stopImmediatePropagation();
      const { top, left, height } =
        // @ts-expect-error
        event.currentTarget!.getBoundingClientRect();
      const { clientWidth } = document.documentElement;
      const dialog = this.form.querySelector('dialog.warnings');
      Object.assign(dialog.style, {
        top: `${top + height}px`,
        left: `${Math.min(left - 16, clientWidth - 300)}px`,
      });
      dialog.showModal();
    }

    async render(...args: unknown[]) {
      await super.render(...args);

      const warning = this.element.querySelector(
        '.window-header .preparation-warnings'
      );
      warning?.toggleAttribute(
        'hidden',
        !this.actor._preparationWarnings?.length
      );
    }

    /* -------------------------------------------- */
    /*  Drag and Drop
    /* -------------------------------------------- */

    _allowedDropBehaviors(event: DragEvent, data?: any) {
      if (!data?.uuid) {
        return new Set<DropEffectValue>(['copy', 'link']);
      }

      const allowed = new Set<DropEffectValue>(['copy', 'move', 'link']);
      const s = foundry.utils.parseUuid(data?.uuid);
      const t = foundry.utils.parseUuid(this.document.uuid);
      const sCompendium =
        s.collection instanceof
        foundry.documents.collections.CompendiumCollection;
      const tCompendium =
        t.collection instanceof
        foundry.documents.collections.CompendiumCollection;

      // If either source or target are within a compendium, but not inside the same compendium, move not allowed
      if ((sCompendium || tCompendium) && s.collection !== t.collection) {
        allowed.delete('move');
      }

      return allowed;
    }

    _defaultDropBehavior(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data?: { uuid?: string }
    ): DropEffectValue {
      if (!data?.uuid) {
        return 'copy';
      }

      const d = foundry.utils.parseUuid(data.uuid);
      const t = foundry.utils.parseUuid(this.document.uuid);
      const base = d.embedded?.length ? 'document' : 'primary';

      return d.collection === t.collection &&
        d[`${base}Id`] === t[`${base}Id`] &&
        d[`${base}Type`] === t[`${base}Type`]
        ? 'move'
        : 'copy';
    }

    /** @inheritDoc */
    _onDragStart(
      event: DragEvent & { target: HTMLElement; currentTarget: HTMLElement }
    ) {
      const li = event.currentTarget;
      if (event.target.classList.contains('content-link')) return;

      if (li.dataset.effectId && li.dataset.parentId) {
        const effect = this.actor.items
          .get(li.dataset.parentId)
          ?.effects.get(li.dataset.effectId);
        if (effect)
          event.dataTransfer?.setData(
            'text/plain',
            JSON.stringify(effect.toDragData())
          );
        return;
      }

      super._onDragStart(event);
    }

    #dropBehavior: DropEffectValue | null = null;

    async _onDrop(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
    ): Promise<any> {
      this.#dropBehavior = this._dropBehavior(event);

      try {
        this._currentDragEvent = event;
        const data = foundry.applications.ux.TextEditor.getDragEventData(event);
        const actor = this.actor;
        // TODO: Extract hook call
        const allowed = Hooks.call('dropActorSheetData', actor, this, data);
        if (allowed === false) return;

        // Handle different data types
        switch (data.type) {
          case CONSTANTS.DOCUMENT_NAME_ACTOR:
            return await this._onDropActor(event, data);
          case CONSTANTS.DOCUMENT_NAME_ITEM:
            return await this._onDropItem(event, data);
          case CONSTANTS.DOCUMENT_NAME_FOLDER:
            return await this._onDropFolder(event, data);
          case CONSTANTS.DOCUMENT_NAME_ACTIVE_EFFECT: {
            const documentClass = foundry.utils.getDocumentClass(data.type);
            const document = await documentClass.fromDropData(data);

            return await this._onDropActiveEffect(event, document);
          }
        }

        return await super._onDrop(event);
      } finally {
        this.#dropBehavior = null;
      }
    }

    /** @override */
    async _onDropActor(event: DragEvent, data: any) {
      const droppedActor = await fromUuid(data.uuid);

      const canPolymorph =
        game.user.isGM ||
        (this.actor.isOwner && game.settings.get('dnd5e', 'allowPolymorphing'));

      // TODO: Make the character sheet handle bastion tab check. This is violating separation of concerns.
      if (
        !canPolymorph ||
        this.currentTabId === CONSTANTS.TAB_CHARACTER_BASTION
      ) {
        return;
      }

      // Configure the transformation
      const settings =
        await dnd5e.applications.actor.TransformDialog.promptSettings(
          this.actor,
          droppedActor,
          {
            transform: {
              settings: game.settings.get('dnd5e', 'transformationSettings'),
            },
          }
        );

      if (!settings) {
        return;
      }

      await game.settings.set(
        'dnd5e',
        'transformationSettings',
        settings.toObject()
      );

      return this.actor.transformInto(droppedActor, settings);
    }

    async _onDropItem(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data: { uuid?: string }
    ): Promise<object | boolean | undefined> {
      const behavior = this.#dropBehavior ?? 'none';

      if (!this.actor.isOwner || behavior === 'none') {
        return false;
      }

      const item = await Item.implementation.fromDropData(data);

      // Handle moving out of container & item sorting
      if (behavior === 'move' && this.actor.uuid === item.parent?.uuid) {
        const removingFromContainer = !isNil(item.system.container);
        if (removingFromContainer) {
          await item.update({ 'system.container': null });
        }

        const itemData = item.toObject();

        const sourceSection = foundry.utils.getProperty(
          itemData,
          TidyFlags.section.prop
        );

        const targetSection = (event.target as HTMLElement | null)
          ?.closest('[data-tidy-section-key][data-custom-section="true"]')
          ?.getAttribute('data-tidy-section-key');

        const isMovedToNewSection =
          !isNil(targetSection?.trim(), '') && sourceSection !== targetSection;

        const isMovedToDefaultSection =
          !isNil(sourceSection?.trim(), '') && isNil(targetSection?.trim(), '');

        const initialSortResult = await FoundryAdapter.onSortItemForActor(
          this.actor,
          event,
          itemData
        );

        if (removingFromContainer) {
          return initialSortResult;
        }

        if (isMovedToNewSection) {
          TidyFlags.section.set(item, targetSection);
          return;
        } else if (isMovedToDefaultSection) {
          TidyFlags.section.unset(item);
          return;
        }

        return initialSortResult;
      }

      return this._onDropItemCreate(item, event, behavior);
    }

    /**
     * Handle the final creation of dropped Item data on the Actor.
     */
    async _onDropItemCreate(
      itemData: Item5e[] | Item5e,
      event: DragEvent,
      behavior?: DropEffectValue
    ): Promise<Item5e[]> {
      let items = itemData instanceof Array ? itemData : [itemData];
      const itemsWithoutAdvancement = items.filter(
        (i) => !i.system.advancement?.length
      );
      const multipleAdvancements =
        items.length - itemsWithoutAdvancement.length > 1;
      if (
        multipleAdvancements &&
        !game.settings.get('dnd5e', 'disableAdvancements')
      ) {
        ui.notifications.warn(
          game.i18n.format('DND5E.WarnCantAddMultipleAdvancements')
        );
        items = itemsWithoutAdvancement;
      }

      // Filter out items already in containers to avoid creating duplicates
      const containers = new Set(
        items.filter((i) => i.type === 'container').map((i) => i._id)
      );

      items = items.filter((i) => !containers.has(i.system.container));

      // Create the owned items & contents as normal
      const toCreate = await dnd5e.documents.Item5e.createWithContents(items, {
        transformFirst: (item: Item5e) =>
          this._onDropSingleItem(item.toObject(), event),
      });

      const created = await dnd5e.documents.Item5e.createDocuments(toCreate, {
        pack: this.actor.pack,
        parent: this.actor,
        keepId: true,
      });

      if (behavior === 'move') {
        items.forEach((i) =>
          fromUuid(i.uuid).then((d: Item5e) =>
            d?.delete({ deleteContents: true })
          )
        );
      }

      return created;
    }

    /**
     * Handles dropping of a single item onto this character sheet.
     */
    async _onDropSingleItem(
      itemData: any,
      event: DragEvent
    ): Promise<object | boolean> {
      const unsupportedItemTypes: Set<string> =
        //@ts-expect-error
        this.constructor.unsupportedItemTypes;

      const isSupportedItemType = !unsupportedItemTypes.has(itemData.type);

      // Check to make sure items of this type are allowed on this actor
      if (!isSupportedItemType) {
        ui.notifications.warn(
          game.i18n.format('DND5E.ActorWarningInvalidItem', {
            itemType: game.i18n.localize(CONFIG.Item.typeLabels[itemData.type]),
            actorType: game.i18n.localize(
              CONFIG.Actor.typeLabels[this.actor.type]
            ),
          })
        );
        return false;
      }

      const isOnInventoryTab =
        this.element?.matches(
          `:has([data-tab-id="${CONSTANTS.TAB_ACTOR_INVENTORY}"].active)`
        ) ?? false;

      // Create a Consumable spell scroll on the Inventory tab
      if (
        itemData.type === 'spell' &&
        (isOnInventoryTab ||
          this.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE ||
          this.actor.type === CONSTANTS.SHEET_TYPE_GROUP)
      ) {
        const options: Record<string, unknown> = {};

        if (settings.value.includeFlagsInSpellScrollCreation) {
          options.flags = itemData.flags;
        }

        const scroll = await dnd5e.documents.Item5e.createScrollFromSpell(
          itemData,
          options
        );

        return scroll?.toObject?.() ?? false;
      }

      // Clean up data
      this._onDropResetData(itemData);

      // Stack identical consumables
      const stacked = this._onDropStackConsumables(itemData, {});

      if (stacked) {
        return false;
      }

      // Bypass normal creation flow for any items with advancement
      if (
        this.actor.system.metadata?.supportsAdvancement &&
        itemData.system.advancement?.length &&
        !game.settings.get('dnd5e', 'disableAdvancements')
      ) {
        // Ensure that this item isn't violating the singleton rule
        const dataModel =
          CONFIG.Item.dataModels[
            itemData.type as keyof typeof CONFIG.Item.dataModels
          ];
        const singleton = dataModel?.metadata.singleton ?? false;
        if (singleton && this.actor.itemTypes[itemData.type].length) {
          ui.notifications.error(
            game.i18n.format('DND5E.ACTOR.Warning.Singleton', {
              itemType: game.i18n.localize(
                CONFIG.Item.typeLabels[itemData.type]
              ),
              actorType: game.i18n.localize(
                CONFIG.Actor.typeLabels[this.actor.type]
              ),
            })
          );
          return false;
        }

        const manager =
          dnd5e.applications.advancement.AdvancementManager.forNewItem(
            this.actor,
            itemData
          );

        if (manager.steps.length) {
          manager.render(true);
          return false;
        }
      }

      return itemData;
    }

    /**
     * Stack identical consumables when a new one is dropped rather than creating a duplicate item.
     */
    _onDropStackConsumables(
      itemData: any,
      { container = null } = {}
    ): Promise<Item5e> | null {
      return FoundryAdapter.onDropStackConsumablesForActor(
        this.actor,
        itemData,
        { container }
      );
    }

    /**
     * Reset certain pieces of data stored on items when they are dropped onto the actor.
     */
    _onDropResetData(itemData: any) {
      if (!itemData.system) return;
      ['attuned', 'equipped', 'prepared'].forEach(
        (k) => delete itemData.system[k]
      );
    }

    async _onDropFolder(
      event: DragEvent & { currentTarget: HTMLElement },
      data: Record<string, any>
    ): Promise<object | boolean | undefined> {
      if (!this.actor.isOwner) {
        return [];
      }

      const folder = await Folder.implementation.fromDropData(data);

      if (folder.type !== 'Item') {
        return [];
      }

      const droppedItemData = await Promise.all(
        folder.contents.map(async (item: any) => {
          if (!(item instanceof Item)) item = await fromUuid(item.uuid);
          return item;
        })
      );

      return this._onDropItemCreate(
        droppedItemData,
        event,
        this.#dropBehavior ?? 'none'
      );
    }

    /**
     * Control whether the restore transformation button is visible.
     */
    static #canRestoreTransformation(
      this: Tidy5eActorSheetClassicV2Base
    ): boolean {
      return this.isEditable && this.actor.isPolymorphed;
    }

    /**
     * Handle following a warning link.
     * @param {Event} event         Triggering click event.
     * @param {HTMLElement} target  Button that was clicked.
     */
    static async #inspectWarning(
      this: Tidy5eActorSheetClassicV2Base,
      event: Event,
      target: HTMLElement
    ) {
      if (this._inspectWarning(event, target) === false) return;
      switch (target.dataset.target) {
        case 'armor':
          new dnd5e.applications.actor.ArmorClassConfig({
            document: this.actor,
          }).render({
            force: true,
          });
          break;
        default:
          const item = await fromUuid(target.dataset.target);
          item?.sheet.render({ force: true });
          break;
      }
    }

    /**
     * Handle following a warning link.
     * @param {Event} event         Triggering click event.
     * @param {HTMLElement} target  Button that was clicked.
     * @returns {any}               Return `false` to prevent default behavior.
     * @protected
     */
    _inspectWarning(event: Event, target: HTMLElement): any {}
  }

  return Tidy5eActorSheetClassicV2Base;
}
