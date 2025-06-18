import { CONSTANTS } from 'src/constants';
import {
  getActorActionSections,
  getActorActionSectionsQuadrone,
} from 'src/features/actions/actions.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import { Inventory } from 'src/features/sections/Inventory';
import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
import type { SkillData, ToolData } from 'src/foundry/dnd5e.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { DropEffectValue } from 'src/mixins/DragAndDropBaseMixin';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import {
  TidyExtensibleDocumentSheetMixin,
  type TidyDocumentSheetRenderOptions,
} from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { settings, systemSettings } from 'src/settings/settings.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import type { Ability } from 'src/types/dnd5e.actor5e.types';
import type { Item5e } from 'src/types/item.types';
import type {
  ActiveEffect5e,
  ActorAbilityContextEntry,
  ActorSaves,
  ActorSheetQuadroneContext,
  ActorSkillsToolsContext as ActorSkillsToolsContext,
  ActorTraitContext,
  SpecialTraitSectionField,
} from 'src/types/types';
import { splitSemicolons } from 'src/utils/array';
import { isNil } from 'src/utils/data';
import { getModifierData } from 'src/utils/formatting';
import { firstOfSet } from 'src/utils/set';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';

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
    itemFilterService: ItemFilterService;
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

      this.itemFilterService = new ItemFilterService(
        {},
        this.actor,
        ItemFilterRuntime.getDocumentFiltersQuadrone
      );
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

    async _prepareContext(options: any): Promise<ActorSheetQuadroneContext> {
      this.itemFilterService.refreshFilters();

      const documentSheetContext = await super._prepareContext(options);

      documentSheetContext.source = documentSheetContext.editable
        ? this.actor.system._source
        : this.actor.system;

      // Concentration
      let saves: ActorSaves = {};

      const isConcentrating =
        this.actor.statuses?.has(CONFIG.specialStatusEffects.CONCENTRATING) ==
        true;

      if (
        [CONSTANTS.SHEET_TYPE_CHARACTER, CONSTANTS.SHEET_TYPE_NPC].includes(
          this.actor.type
        )
      ) {
        const attrConcentration = this.actor.system.attributes.concentration;
        if (attrConcentration) {
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

      const rollData = this.actor.getRollData();

      let context: ActorSheetQuadroneContext = {
        abilities: [],
        actions: await getActorActionSectionsQuadrone(this.actor, {
          rowActions: TableRowActionsRuntime.getActionsRowActions(
            this.actor.isOwner,
            documentSheetContext.unlocked
          ),
        }),
        actor: this.actor,
        appId: this.appId,
        config: CONFIG.DND5E,
        customActorTraits: [],
        customContent: [],
        enableXp:
          systemSettings.value.levelingMode !==
          CONSTANTS.SYSTEM_SETTING_LEVELING_MODE_NO_XP,
        effects: dnd5e.applications.components.EffectsElement.prepareCategories(
          this.actor.allApplicableEffects()
        ),
        elements: this.options.elements,
        filterData: this.itemFilterService.getFilterData(),
        filterPins:
          ItemFilterRuntime.defaultFilterPinsQuadrone[this.actor.type],
        flags: {
          classes: [],
          data: {},
          sections: [],
        },
        isConcentrating,
        itemContext: {},
        items: Array.from(this.actor.items)
          .filter((i: Item5e) => !this.actor.items.has(i.system.container))
          .toSorted((a: Item5e, b: Item5e) => (a.sort || 0) - (b.sort || 0)),
        journal: TidyFlags.documentJournal.get(this.actor),
        labels: this._getLabels(),
        limited: this.actor.limited,
        modernRules: FoundryAdapter.checkIfModernRules(this.actor),
        owner: this.actor.isOwner,
        rollData,
        saves,
        system: this.actor.system,
        tabs: [],
        token: this.token,
        traits: this._prepareTraits(),
        userPreferences: UserPreferencesService.get(),
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
     * Prepare actor traits for display.
     * @param {ApplicationRenderContext} context  Context being prepared.
     * @returns {Record<string, object[]>}
     * @protected
     */
    _prepareTraits(): Record<string, ActorTraitContext[]> {
      // TODO: Account for sign and units where applicable
      const traits: Record<string, ActorTraitContext[]> = {};
      for (const [trait, config] of Object.entries(CONFIG.DND5E.traits)) {
        const actorKeyPath =
          'actorKeyPath' in config ? config.actorKeyPath : undefined;
        const key = actorKeyPath ?? `system.traits.${trait}`;
        const data = foundry.utils.deepClone(
          foundry.utils.getProperty(this.actor, key)
        );
        if (['dm', 'languages'].includes(trait) || !data) continue;

        let values = data.value;
        if (!values) {
          values = [];
        } else if (values instanceof Set) {
          values = Array.from(values);
        } else if (!Array.isArray(values)) values = [values];
        values = values.map((key: string) => {
          const value: {
            key: string;
            label: string;
            icons: { icon: string; label: string }[];
          } = {
            key,
            label: dnd5e.documents.Trait.keyLabel(key, { trait }) ?? key,
            icons: [],
          };
          const icons = value.icons;
          if (data.bypasses?.size && CONFIG.DND5E.damageTypes[key]?.isPhysical)
            icons.push(
              ...data.bypasses.map((p: string) => {
                const type = CONFIG.DND5E.itemProperties[p]?.label;
                return {
                  icon: p,
                  label: game.i18n.format('DND5E.DamagePhysicalBypassesShort', {
                    type,
                  }),
                };
              })
            );
          return value;
        });
        if (data.custom)
          splitSemicolons(data.custom).forEach((label) =>
            values.push({ label })
          );
        if (values.length) traits[trait] = values;
      }

      // If petrified, display "All Damage" instead of all damage types separately
      if (this.document.hasConditionEffect('petrification')) {
        traits.dr = [{ label: game.i18n.localize('DND5E.DamageAll') }];
      }

      // Prepare damage modifications
      const dm = this.actor.system.traits?.dm;
      if (dm) {
        const rollData = this.actor.getRollData({ deterministic: true });
        const values = Object.entries(dm.amount)
          .map(([k, v]) => {
            const total = dnd5e.utils.simplifyBonus(v, rollData);
            if (!total) return null;
            const mod = getModifierData(total);
            const value: {
              label: string;
              cssClass: string;
              icons: { icon: string; label: string }[];
              value: string;
              sign: string;
            } = {
              label: `${CONFIG.DND5E.damageTypes[k]?.label ?? k}`,
              sign: mod.sign,
              value: mod.value,
              cssClass: total > 0 ? 'negative' : 'positive',
              icons: [],
            };
            const icons = value.icons;
            if (dm.bypasses.size && CONFIG.DND5E.damageTypes[k]?.isPhysical)
              icons.push(
                ...dm.bypasses.map((p: string) => {
                  const type = CONFIG.DND5E.itemProperties[p]?.label;
                  return {
                    icon: p,
                    label: game.i18n.format(
                      'DND5E.DamagePhysicalBypassesShort',
                      { type }
                    ),
                  };
                })
              );
            return value;
          })
          .filter((f) => !!f);

        if (values.length) traits.dm = values;
      }

      // Prepare languages
      const languages = this.actor.system.traits?.languages?.labels;
      if (languages?.languages?.length)
        traits.languages = languages.languages.map((label: string) => ({
          label,
        }));
      for (const [key, { label }] of Object.entries(
        CONFIG.DND5E.communicationTypes
      )) {
        const data = this.actor.system.traits?.languages?.communication?.[key];
        if (!data?.value) continue;
        traits.languages ??= [];
        traits.languages.push({ label, value: data.value });
      }

      // Display weapon masteries
      for (const key of this.actor.system.traits?.weaponProf?.mastery?.value ??
        []) {
        let value = traits.weapon?.find((w) => w.key === key);
        if (!value) {
          value = {
            key,
            label:
              dnd5e.documents.Trait.keyLabel(key, { trait: 'weapon' }) ?? key,
            icons: [],
          };
          traits.weapon ??= [];
          traits.weapon.push(value);
        }
        (value.icons ??= []).push({
          icon: 'mastery',
          label: game.i18n.format('DND5E.WEAPON.Mastery.Label'),
        });
      }

      return traits;
    }

    /* -------------------------------------------- */

    /**
     * Prepare actor skills or tools for display.
     * @param context     Context being prepared.
     * @param property    Type of data being prepared.
     */
    _getSkillsToolsContext<T extends 'skills' | 'tools'>(
      context: ActorSheetQuadroneContext,
      property: T
    ): (T extends 'skills'
      ? ActorSkillsToolsContext<SkillData>
      : ActorSkillsToolsContext<ToolData>)[] {
      const baseAbility = (key: string) => {
        let src = context.source[property]?.[key]?.ability;
        if (src) return src;
        if (property === 'skills') src = CONFIG.DND5E.skills[key]?.ability;
        return src ?? 'int';
      };
      return Object.entries(context.system[property] ?? {}).map(
        ([key, entry]: [string, any]) => ({
          ...entry,
          key,
          abbreviation: CONFIG.DND5E.abilities[entry.ability]?.abbreviation,
          baseAbility: baseAbility(key),
          hover: CONFIG.DND5E.proficiencyLevels[entry.value],
          label:
            property === 'skills'
              ? CONFIG.DND5E.skills[key]?.label
              : dnd5e.documents.Trait.keyLabel(key, { trait: 'tool' }),
          source: context.source[property]?.[key],
        })
      );
    }

    /* -------------------------------------------- */
    /*  Rendering Life-Cycle Methods                */
    /* -------------------------------------------- */
    async _onRender(
      context: ActorSheetQuadroneContext,
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

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    async _addDocument(args: {
      tabId: string;
      customSection?: string;
      creationItemTypes?: string[];
      data?: Record<string, any>;
    }) {
      let { type: datasetType, ...restDataSet } = args.data ?? {};

      if (args.tabId === CONSTANTS.TAB_EFFECTS)
        return await ActiveEffect.implementation.create(
          {
            name: game.i18n.localize('DND5E.EffectNew'),
            icon: 'icons/svg/aura.svg',
            type: datasetType,
            ...restDataSet,
          },
          { parent: this.actor, renderSheet: true }
        );

      const types = this._addDocumentItemTypes(args.tabId).filter(
        (type) =>
          !CONFIG.Item.dataModels[type].metadata?.singleton ||
          !this.actor.itemTypes[type].length
      );

      if (types.length > 1) {
        let dialogV1HookId: number | null = null;

        if (!isNil(datasetType, '') && types.includes(datasetType)) {
          dialogV1HookId = Hooks.once('renderDialog', (app: any) => {
            const typeToPreselect = app.element
              .get(0)
              .querySelector(`[value="${datasetType}"]`);
            typeToPreselect && (typeToPreselect.checked = true);
          });
        }

        let result = await Item.implementation.createDialog(
          { type: datasetType, ...restDataSet },
          {
            parent: this.actor,
            pack: this.actor.pack,
            types,
          }
        );

        Hooks.off('renderDialog', dialogV1HookId);

        return result;
      }

      const type = types[0];
      return await Item.implementation.create(
        {
          type,
          name: game.i18n.format('DOCUMENT.New', {
            type: game.i18n.format(CONFIG.Item.typeLabels[type]),
          }),
          ...restDataSet,
        },
        { parent: this.actor, renderSheet: true }
      );
    }

    /* -------------------------------------------- */

    /**
     * Determine the types of items that can be added depending on the current tab.
     * @param {string} tab  Currently viewed tab.
     * @returns {string[]}  Types of items to allow to create.
     */
    _addDocumentItemTypes(tab: string): string[] {
      switch (tab) {
        case CONSTANTS.TAB_CHARACTER_FEATURES:
          return ['feat'];
        case CONSTANTS.TAB_ACTOR_INVENTORY:
          return Inventory.getInventoryTypes();
        case CONSTANTS.TAB_ACTOR_SPELLBOOK:
          return ['spell'];
        default:
          return [];
      }
    }

    /* -------------------------------------------- */
    /*  Drag and Drop
    /* -------------------------------------------- */

    _allowedDropBehaviors(event: DragEvent, data: any) {
      if (!data.uuid) {
        return new Set<DropEffectValue>(['copy', 'link']);
      }

      const allowed = new Set<DropEffectValue>(['copy', 'move', 'link']);
      const s = foundry.utils.parseUuid(data.uuid);
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

    _defaultDropBehavior(event: DragEvent, data: any): DropEffectValue {
      if (!data.uuid) {
        return 'copy';
      }

      if (data.type === CONSTANTS.FLAG_TYPE_TIDY_JOURNAL) {
        return this.actor.uuid === data.uuid ? 'move' : 'copy';
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

    _onDragOver(event: DragEvent & { currentTarget: HTMLElement }) {
      const data =
        foundry.applications.ux.DragDrop.implementation.getPayload(event);

      if (event.dataTransfer == null) {
        return;
      }

      foundry.applications.ux.DragDrop.implementation.dropEffect =
        event.dataTransfer.dropEffect =
          foundry.utils.getType(data) === 'Object'
            ? this._dropBehavior(event, data)
            : 'copy';
    }

    /**
     * The behavior for the dropped data. When called during the drop event, ensure this is called before awaiting
     * anything or the drop behavior will be lost.
     */
    _dropBehavior(event: DragEvent, data: unknown): DropEffectValue {
      const allowed = this._allowedDropBehaviors(event, data);

      let behavior =
        foundry.applications.ux.DragDrop.implementation.dropEffect ??
        event.dataTransfer?.dropEffect;

      if (event.type === 'dragover') {
        if (dnd5e.utils.areKeysPressed(event, 'dragMove')) behavior = 'move';
        else if (dnd5e.utils.areKeysPressed(event, 'dragCopy')) {
          behavior = 'copy';
        } else {
          behavior = this._defaultDropBehavior(event, data);
        }
      }

      if (behavior !== 'none' && !allowed.has(behavior)) {
        return firstOfSet(allowed) ?? 'none';
      }

      return behavior || 'copy';
    }

    /** @inheritDoc */
    _onDragStart(
      event: DragEvent & { target: HTMLElement; currentTarget: HTMLElement }
    ) {
      const el = event.currentTarget;
      if (event.target.classList.contains('content-link')) return;

      if (el.dataset.effectId && el.dataset.parentId) {
        const effect = this.actor.items
          .get(el.dataset.parentId)
          ?.effects.get(el.dataset.effectId);
        if (effect)
          event.dataTransfer?.setData(
            'text/plain',
            JSON.stringify(effect.toDragData())
          );
        return;
      }

      if (el.dataset.tidyJournalId) {
        const journalSortDragData = {
          tidyJournalId: el.dataset.tidyJournalId,
          uuid: event.target.closest<HTMLElement>('[data-document-uuid]')
            ?.dataset.documentUuid,
          type: CONSTANTS.FLAG_TYPE_TIDY_JOURNAL,
        };

        event.dataTransfer?.setData(
          'text/plain',
          JSON.stringify(journalSortDragData)
        );
        return;
      }

      super._onDragStart(event);
    }

    async _onDrop(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
    ): Promise<any> {
      this._currentDragEvent = event;
      const data = foundry.applications.ux.TextEditor.getDragEventData(event);
      const actor = this.actor;
      // TODO: Extract hook call
      const allowed = Hooks.call('dropActorSheetData', actor, this, data);
      if (allowed === false) return;

      // Handle different data types
      switch (data.type) {
        case CONSTANTS.FLAG_TYPE_TIDY_JOURNAL:
          return this._onDropJournal(event, data);
        case CONSTANTS.DOCUMENT_NAME_ACTOR:
          return this._onDropActor(event, data);
        case CONSTANTS.DOCUMENT_NAME_ITEM:
          return this._onDropItem(event, data);
        case 'Folder': // TODO: figure out how to extract this as a constant. Is it a Document Name? Or what?
          return this._onDropFolder(event, data);
      }

      return super._onDrop(event);
    }

    async _onDropJournal(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data: any
    ) {
      const journal = TidyFlags.documentJournal.get(this.actor);
      const actorOwnsJournal = journal[data.tidyJournalId];
      const targetEntryId = event.target.closest<HTMLElement>(
        '[data-tidy-journal-id]'
      )?.dataset.tidyJournalId;

      const behavior = this._dropBehavior(event, data);

      const sourceDocument = await fromUuid(data.uuid);
      const sourceEntry =
        TidyFlags.documentJournal.get(sourceDocument)[data.tidyJournalId];

      if (behavior === 'move' && actorOwnsJournal && !!targetEntryId) {
        // Sort

        if (!sourceEntry) {
          return;
        }

        TidyFlags.documentJournal.sort(this.actor, sourceEntry.id, targetEntryId);
      } else {
        if (!sourceDocument) {
          return;
        }

        // Copy
        const sourceJournal = TidyFlags.documentJournal.get(sourceDocument);
        const sourceEntry = sourceJournal[data.tidyJournalId];

        if (!sourceEntry) {
          return;
        }

        const behavior = this._dropBehavior(event, data);

        const newId = foundry.utils.randomID();
        TidyFlags.documentJournal.add(this.actor, {
          ...sourceEntry,
          id: newId,
        });

        // Remove from source actor if this is a move
        if (behavior === 'move') {
          TidyFlags.documentJournal.remove(sourceDocument, data.tidyJournalId);
        }
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
      event: DragEvent & { currentTarget: HTMLElement },
      data: unknown
    ): Promise<object | boolean | undefined> {
      const behavior = this._dropBehavior(event, data);

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
      itemData: Item5e[] | Item5e | object,
      event: Event,
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
          this._onDropSingleItem(item.toObject?.() ?? item, event),
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
      event: Event
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

      const isOnInventoryTab = this.element.matches(
        `:has([data-tab-id="${CONSTANTS.TAB_ACTOR_INVENTORY}"].active)`
      );

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
            game.i18n.format('DND5E.ActorWarningSingleton', {
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

      // Adjust the preparation mode of a leveled spell depending on the section on which it is dropped.
      if (itemData.type === 'spell') {
        this._onDropSpell(itemData, event);
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

    // TODO: Make this WORK! And update it to handle Always Prepared
    /**
     * Adjust the preparation mode of a dropped spell depending on the drop location on the sheet.
     */
    _onDropSpell(itemData: any, event: Event) {
      if (
        ![CONSTANTS.SHEET_TYPE_NPC, CONSTANTS.SHEET_TYPE_CHARACTER].includes(
          this.document.type
        )
      )
        return;

      const dropTarget = event?.target;

      if (!dropTarget || !(dropTarget instanceof HTMLElement)) {
        return;
      }

      // Determine the section it is dropped on, if any.
      const dataset =
        dropTarget?.closest<HTMLElement>('[data-type="spell"]')?.dataset ?? {};
      const level = dataset['system.level'];
      const preparationMode = dataset['system.preparation.mode'];

      // Determine the actor's spell slot progressions, if any.
      const spellcastKeys = Object.keys(CONFIG.DND5E.spellcastingTypes);
      const progs = Object.values(this.document.classes).reduce<Set<string>>(
        (acc: any, cls: any) => {
          const type = cls.spellcasting?.type;
          if (spellcastKeys.includes(type)) acc.add(type);
          return acc;
        },
        new Set<string>()
      );

      const prep = itemData.system.preparation;

      // Case 1: Drop a cantrip.
      if (itemData.system.level === 0) {
        const modes = CONFIG.DND5E.spellPreparationModes;

        const mode =
          modes[
            preparationMode as keyof typeof CONFIG.DND5E.spellPreparationModes
          ] ?? {};

        if ('cantrips' in mode && mode.cantrips) {
          prep.mode = 'prepared';
        } else if (!preparationMode) {
          const isCaster =
            this.document.system.attributes.spell.level || progs.size;
          prep.mode = isCaster ? 'prepared' : 'innate';
        } else {
          prep.mode = preparationMode;
        }

        if ('prepares' in mode && mode.prepares) {
          prep.prepared = true;
        }
      }

      // Case 2: Drop a leveled spell in a section without a mode.
      else if (level === '0' || !preparationMode) {
        if (this.document.type === 'npc') {
          prep.mode = this.document.system.attributes.spell.level
            ? 'prepared'
            : 'innate';
        } else {
          const m = progs.has('leveled')
            ? 'prepared'
            : firstOfSet(progs) ?? 'innate';
          prep.mode = progs.has(prep.mode) ? prep.mode : m;
        }
      }

      // Case 3: Drop a leveled spell in a specific section.
      else prep.mode = preparationMode;
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

      return this._onDropItemCreate(droppedItemData, event);
    }
  }

  return Tidy5eActorSheetQuadroneBase;
}
