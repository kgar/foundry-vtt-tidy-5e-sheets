import { CONSTANTS } from 'src/constants';
import {
  getActorActionSections,
  getActorActionSectionsQuadrone,
} from 'src/features/actions/actions.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import { Inventory } from 'src/features/sections/Inventory';
import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
import type { Activity5e, SkillData, ToolData } from 'src/foundry/dnd5e.types';
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
import type { Item5e, ItemChatData } from 'src/types/item.types';
import type {
  ActiveEffect5e,
  Actor5e,
  ActorAbilityContextEntry,
  ActorClassEntryContext,
  ActorSaves,
  ActorSheetQuadroneContext,
  ActorSkillsToolsContext as ActorSkillsToolsContext,
  ActorSpeedSenseEntryContext,
  ActorTraitContext,
  CreatureTypeContext,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  Folder,
  LocationToSearchTextMap,
  MessageBus,
  SpellcastingClassContext,
} from 'src/types/types';
import { splitSemicolons } from 'src/utils/array';
import { isNil } from 'src/utils/data';
import { getModifierData } from 'src/utils/formatting';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { mount } from 'svelte';
import ActorLimitedSheet from './actor/ActorLimitedSheet.svelte';
import ActorHeaderStart from './actor/parts/ActorHeaderStart.svelte';
import ActorWarnings from './shared/ActorWarnings.svelte';
import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import { JournalQuadrone } from 'src/features/journal/JournalQuadrone.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import { SvelteMap } from 'svelte/reactivity';
import { mapGetOrInsert } from 'src/utils/map';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

const POST_WINDOW_TITLE_ANCHOR_CLASS_NAME = 'sheet-warning-anchor';

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
    itemFilterService: ItemFilterService;
    messageBus = $state<MessageBus>({ message: undefined });
    searchFilters: LocationToSearchTextMap = new SvelteMap<string, string>();
    expandedItems: ExpandedItemIdToLocationsMap = new SvelteMap<
      string,
      Set<string>
    >();
    expandedItemData: ExpandedItemData = new SvelteMap<string, ItemChatData>();
    inlineToggleService = new InlineToggleService();
    sectionExpansionTracker: ExpansionTracker;

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

      this.sectionExpansionTracker = new ExpansionTracker(
        true,
        this.document,
        CONSTANTS.LOCATION_SECTION
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
          {
            action: 'openTabConfiguration',
            icon: 'fas fa-file-invoice',
            label: 'TIDY5E.TabSelection.MenuOptionText',
            ownership: 'OWNER',
            visible: function (this: Tidy5eActorSheetQuadroneBase) {
              return this.isEditable;
            },
          },
          {
            icon: 'fa-solid fa-swatchbook',
            label: 'TIDY5E.ThemeSettings.SheetMenu.name',
            action: 'themeSettings',
            ownership: 'OWNER',
            visible: function (this: Tidy5eActorSheetQuadroneBase) {
              return this.isEditable;
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
        openTabConfiguration: async function (
          this: Tidy5eActorSheetQuadroneBase
        ) {
          new SheetTabConfigurationQuadroneApplication({
            document: this.document,
          }).render({ force: true });
        },
        showArtwork: async function (this: Tidy5eActorSheetQuadroneBase) {
          const showTokenPortrait =
            this.actor.flags.dnd5e?.[CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT];
          const token = this.actor.isToken
            ? this.actor.token
            : this.actor.prototypeToken;
          const img = showTokenPortrait ? token.texture.src : this.actor.img;
          new foundry.applications.apps.ImagePopout({
            src: img,
            uuid: this.actor.uuid,
            window: { title: this.actor.name },
          }).render({ force: true });
        },
        themeSettings: async function (this: Tidy5eActorSheetQuadroneBase) {
          await new ThemeSettingsQuadroneApplication({
            document: this.document,
          }).render({
            force: true,
          });
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

    selectTab(tabId: string) {
      this.onTabSelected(tabId);
      this.render();
    }

    _getActorSvelteContext(): [key: string, value: any][] {
      return [
        [CONSTANTS.SVELTE_CONTEXT.POSITION_REF, this._position],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
          this.onTabSelected.bind(this),
        ],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
        [CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA, this.expandedItemData],
        [CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS, this.expandedItems],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
          this.onItemToggled.bind(this),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER,
          this.itemFilterService.onFilter.bind(this.itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
          this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
        ],
        [CONSTANTS.SVELTE_CONTEXT.LOCATION, ''],
        [
          CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
          this.sectionExpansionTracker,
        ],
        [CONSTANTS.SVELTE_CONTEXT.ITEM_FILTER_SERVICE, this.itemFilterService],
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
          this.inlineToggleService,
        ],
      ];
    }

    /* -------------------------------------------- */
    /*  Context Data Preparation                    */
    /* -------------------------------------------- */

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

      const themeSettings = ThemeQuadrone.getSheetThemeSettings({
        doc: this.actor,
      });

      const showToken =
        this.actor.flags.dnd5e?.[CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT] ===
          true || themeSettings.portraitShape === 'token';

      const effectiveToken = this.actor.isToken
        ? this.actor.token
        : this.actor.prototypeToken;

      const rollData = this.actor.getRollData();

      let context: ActorSheetQuadroneContext = {
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
        elements: this.options.elements,
        filterData: this.itemFilterService.getFilterData(),
        filterPins:
          ItemFilterRuntime.defaultFilterPinsQuadrone[this.actor.type],
        currentTabId: this.currentTabId,
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
        portrait: {
          shape: showToken ? 'token' : themeSettings.portraitShape ?? 'round',
          src: showToken
            ? effectiveToken?.texture.src ?? this.actor.img
            : this.actor.img,
          path: showToken ? 'prototypeToken.texture.src' : 'img',
        },
        rollData,
        saves,
        sheet: this,
        system: this.actor.system,
        tabs: [],
        themeSettings,
        token: this.token,
        userPreferences: UserPreferencesService.get(),
        warnings:
          foundry.utils
            .deepClone(this.actor._preparationWarnings)
            .filter((w: any) => !isNil(w.message?.trim(), '')) ?? [],
        ...documentSheetContext,
      };

      // Prepare owned items
      this._prepareItems(context);

      // Concentration
      this._applyConcentration(context);

      context.customActorTraits =
        CustomActorTraitsRuntime.getEnabledTraits(context);

      await this.setExpandedItemData();

      return context;
    }

    /**
     * Prepare labels object for the context.
     * @returns {Record<string, any>}           Object containing various labels.
     * @protected
     */
    _getLabels(): Record<string, any> {
      const labels = { ...this.actor.labels };

      // Currency Labels
      labels.currencies = Object.entries(CONFIG.DND5E.currencies).reduce<
        Record<string, any>
      >((obj, [k, c]) => {
        obj[k] = c.label;
        return obj;
      }, {});

      // Proficiency
      if (this.actor.system.attributes?.prof !== undefined) {
        labels.proficiency =
          game.settings.get('dnd5e', 'proficiencyModifier') === 'dice'
            ? `d${this.actor.system.attributes.prof * 2}`
            : `+${this.actor.system.attributes.prof}`;
      }

      return labels;
    }

    /**
     * Prepare the data structure for items which appear on the actor sheet.
     * Each subclass overrides this method to implement type-specific logic.
     * @protected
     */
    _prepareItems(context: ActorSheetQuadroneContext) {}

    _prepareSpellcastingClassContext(): SpellcastingClassContext[] {
      let spellcasting: SpellcastingClassContext[] = [];

      const spellcastingClasses = Object.values<Item5e>(
        this.actor.spellcastingClasses ?? {}
      ).sort(
        (lhs: Item5e, rhs: Item5e) => rhs.system.levels - lhs.system.levels
      );

      for (const item of spellcastingClasses) {
        const sc = item.spellcasting;
        const ability = this.actor.system.abilities[sc.ability];
        const mod = ability?.mod ?? 0;
        const name =
          item.system.spellcasting.progression === sc.progression
            ? item.name
            : item.subclass?.name;

        const abilityConfig = CONFIG.DND5E.abilities[sc.ability];
        spellcasting.push({
          type: 'class',
          name,
          classIdentifier: item.system.identifier,
          ability: {
            key: sc.ability,
            mod: getModifierData(mod),
            label: abilityConfig?.label ?? sc.ability,
            abbreviation: abilityConfig?.abbreviation ?? sc.ability,
          },
          attack: {
            mod: getModifierData(sc.attack),
          },
          prepared: sc.preparation,
          primary: this.actor.system.attributes.spellcasting === sc.ability,
          save: sc.save,
        });
      }

      return spellcasting;
    }

    _getClassesAndOrphanedSubclasses(): {
      classes: ActorClassEntryContext[];
      orphanedSubclasses: Item5e[];
    } {
      const subclasses: Item5e[] = Object.values(this.actor.subclasses);
      const classes = Object.values(this.actor.classes)
        .map<ActorClassEntryContext>((cls: Item5e) => {
          const maxLevelDelta =
            CONFIG.DND5E.maxLevel - this.actor.system.details.level;

          const spellcasting = cls.system.spellcasting
            ? {
                dc: cls.system.spellcasting.save,
                ability: (
                  CONFIG.DND5E.abilities[cls.system.spellcasting.ability]
                    ?.abbreviation ?? cls.system.spellcasting.ability
                )?.toLocaleUpperCase(),
              }
            : undefined;

          const subclass = subclasses.findSplice(
            (s: Item5e) => s.system.classIdentifier === cls.identifier
          );

          let needsSubclass = false;
          if (!subclass) {
            const subclassAdvancement = cls.advancement.byType.Subclass?.[0];
            needsSubclass =
              subclassAdvancement &&
              subclassAdvancement.level <= cls.system.levels;
          }

          return {
            name: cls.name,
            levels: cls.system.levels,
            isOriginalClass: cls.system.isOriginalClass,
            spellcasting,
            item: cls,
            img: cls.img,
            availableLevels: Array.fromRange(CONFIG.DND5E.maxLevel + 1)
              .slice(1)
              .map((level) => {
                const delta = level - cls.system.levels;
                return { level, delta, disabled: delta > maxLevelDelta };
              }),
            uuid: cls.uuid,
            subclass,
            needsSubclass,
          };
        })
        .toSorted((left, right) => right.levels - left.levels);

      return { classes, orphanedSubclasses: subclasses };
    }

    /* -------------------------------------------- */

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

        if (data.custom) {
          splitSemicolons(data.custom).forEach((label) =>
            values.push({ label })
          );
        }

        if (values.length) {
          traits[trait] = values;
        }
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

      traits.languages ??= [];
      traits.languages.push(
        ...Tidy5eActorSheetQuadroneBase._getLanguageTraits(this.actor)
      );

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

      Object.values(traits).forEach((t) => {
        t.sort((a, b) =>
          (a.label ?? a.value ?? '').localeCompare(
            b.label ?? b.value ?? '',
            game.i18n.lang
          )
        );
      });

      return traits;
    }

    public static _getLanguageTraits(actor: Actor5e) {
      let languageTraits: ActorTraitContext<number>[] = [];
      const languages = actor.system.traits?.languages?.labels;

      if (languages?.languages?.length)
        languageTraits = languages.languages.map((label: string) => ({
          label,
        }));

      for (const [key, { label }] of Object.entries(
        CONFIG.DND5E.communicationTypes
      )) {
        const data = actor.system.traits?.languages?.communication?.[key];
        if (!data?.value) continue;
        languageTraits.push({
          label,
          value: data.value,
          units:
            CONFIG.DND5E.movementUnits[data.units]?.abbreviation ?? data.units,
          unitsKey: data.units,
        });
      }

      return languageTraits;
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
      return Object.entries(context.system[property] ?? {})
        .map(([key, entry]: [string, any]) => ({
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
        }))
        .toSorted((a, b) =>
          (a.label ?? '').localeCompare(b.label ?? '', game.i18n.lang)
        );
    }

    _getMovementSpeeds(): ActorSpeedSenseEntryContext[] {
      const systemMovement = this.actor.system.attributes.movement;
      const sourceMovement =
        this.actor.system._source.attributes?.movement ?? {};

      function excludeSpeed(key: string) {
        return isNil(systemMovement[key], 0) && isNil(sourceMovement[key], 0);
      }

      const speeds = Object.entries(CONFIG.DND5E.movementTypes)
        .reduce<ActorSpeedSenseEntryContext[]>((acc, [key, config]) => {
          if (excludeSpeed(key)) {
            return acc;
          }

          const parenthetical =
            key === CONSTANTS.MOVEMENT_FLY && systemMovement.hover
              ? FoundryAdapter.localize('DND5E.MovementHover')
              : undefined;

          acc.push({
            key,
            label: config.label,
            value: Math.round(+systemMovement[key]).toString() ?? '',
            units:
              CONFIG.DND5E.movementUnits[systemMovement.units]?.abbreviation ??
              systemMovement.units,
            unitsKey: key,
            parenthetical,
          });

          return acc;
        }, [])
        .toSorted((left, right) =>
          left.key === CONSTANTS.MOVEMENT_WALK
            ? -1
            : right.key === CONSTANTS.MOVEMENT_WALK
            ? 1
            : +(right.value ?? 0) - +(left.value ?? 0)
        );

      if (speeds.length === 0) {
        speeds.push({
          key: CONSTANTS.MOVEMENT_WALK,
          label: CONFIG.DND5E.movementTypes.walk.label,
          units:
            CONFIG.DND5E.movementUnits[systemMovement.units]?.abbreviation ??
            systemMovement.units,
          value: systemMovement.walk?.toString() ?? '0',
          unitsKey: sourceMovement.units,
        });
      }

      return speeds;
    }

    _getSenses(): ActorSpeedSenseEntryContext[] {
      const senseConfig = this.actor.system.attributes.senses;

      const senses = Object.entries(CONFIG.DND5E.senses).reduce<
        ActorSpeedSenseEntryContext[]
      >((acc, [key, label]) => {
        const value = senseConfig[key];

        if (!value || value === 0) {
          return acc;
        }

        acc.push({
          key,
          label,
          value: Math.round(+value).toString(),
          units:
            CONFIG.DND5E.movementUnits[senseConfig.units]?.abbreviation ??
            senseConfig.units,
          unitsKey: senseConfig.units,
        });

        return acc;
      }, []);

      if (!isNil(senseConfig.special, '')) {
        const specialSenses = dnd5e.utils
          .splitSemicolons(senseConfig.special)
          .map((s: string, i: number) => ({
            key: `custom${i + 1}`,
            label: s,
          }));

        senses.push(...specialSenses);
      }

      return senses.toSorted((left, right) =>
        left.key === 'darkvision'
          ? -1
          : right.key === 'darkvision'
          ? 1
          : +right.value - +left.value
      );
    }

    _getCreatureType(): CreatureTypeContext {
      const { details } = this.actor.system;

      return {
        icon:
          CONFIG.DND5E.creatureTypes[details.type.value]?.icon ??
          'icons/svg/mystery-man.svg',
        title:
          details.type.value === 'custom'
            ? details.type.custom
            : CONFIG.DND5E.creatureTypes[details.type.value]?.label,
        reference: CONFIG.DND5E.creatureTypes[details.type.value]?.reference,
        subtitle: details.type.subtype,
      };
    }

    /* -------------------------------------------- */
    /*  Component Management                        */
    /* -------------------------------------------- */

    _createAdditionalComponents(node: HTMLElement) {
      if (this.actor.limited) {
        return [];
      }

      const windowHeader = this.element.querySelector('.window-header');

      const headerStart = mount(ActorHeaderStart, {
        target: windowHeader,
        anchor: windowHeader.querySelector('.window-title'),
        context: new Map<string, any>([
          [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        ]),
      });

      const warningHeaderControl = mount(ActorWarnings, {
        target: windowHeader,
        anchor: this.element.querySelector(
          `.${POST_WINDOW_TITLE_ANCHOR_CLASS_NAME}`
        ),
        context: new Map<string, any>([
          [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        ]),
      });

      return [headerStart, warningHeaderControl];
    }

    _createLimitedViewComponent(node: HTMLElement): Record<string, any> {
      const component = mount(ActorLimitedSheet, {
        target: node,
        context: new Map<any, any>([
          [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        ]),
      });

      return component;
    }

    /* -------------------------------------------- */
    /*  Rendering Life-Cycle Methods                */
    /* -------------------------------------------- */

    async _renderFrame(options: TidyDocumentSheetRenderOptions = {}) {
      const html = await super._renderFrame(options);
      if (!game.user.isGM && this.actor.limited) return html;

      // Preparation warnings.
      const postWindowTitleComponentAnchor = document.createElement('div');
      postWindowTitleComponentAnchor.classList.add(
        'hidden',
        POST_WINDOW_TITLE_ANCHOR_CLASS_NAME
      );
      postWindowTitleComponentAnchor.role = 'presentation';

      const header = html.querySelector('.window-header');
      header
        .querySelector('.window-title')
        .insertAdjacentElement('afterend', postWindowTitleComponentAnchor);

      return html;
    }

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

      if (args.tabId === CONSTANTS.TAB_EFFECTS) {
        return await ActiveEffect.implementation.create(
          {
            name: game.i18n.localize('DND5E.EffectNew'),
            icon: 'icons/svg/aura.svg',
            type: datasetType,
            ...restDataSet,
          },
          { parent: this.actor, renderSheet: true }
        );
      }

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
        case CONSTANTS.TAB_NPC_STATBLOCK:
          return ['feat'];
        case CONSTANTS.TAB_ACTOR_INVENTORY:
          return Inventory.getInventoryTypes();
        case CONSTANTS.TAB_ACTOR_SPELLBOOK:
          return ['spell'];
        default:
          return [];
      }
    }

    private async setExpandedItemData() {
      this.expandedItemData.clear();
      for (const [id, locations] of this.expandedItems) {
        if (locations.size === 0) {
          continue;
        }
        const item = this.actor.items.get(id);
        if (item) {
          this.expandedItemData.set(
            id,
            await item.getChatData({ secrets: this.actor.isOwner })
          );
        }
      }
    }

    /* -------------------------------------------- */
    /*  Drag and Drop
    /* -------------------------------------------- */

    _allowedDropBehaviors(
      event: DragEvent,
      data?: { type?: string; uuid?: string }
    ) {
      if (!data?.uuid) {
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

    _defaultDropBehavior(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data?: { type?: string; uuid?: string }
    ): DropEffectValue {
      if (!data?.uuid) {
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

      if (el.dataset.activityId) {
        const itemDataset =
          event.target.closest<HTMLElement>('[data-item-id]')?.dataset;
        const activityDataset =
          event.target.closest<HTMLElement>('[data-activity-id]')?.dataset;
        const activity = this.actor.items
          .get(itemDataset?.itemId)
          ?.system.activities?.get(activityDataset?.activityId);
        if (activity)
          event.dataTransfer?.setData(
            'text/plain',
            JSON.stringify(activity.toDragData())
          );
        return;
      }

      super._onDragStart(event);
    }

    async _onDrop(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
    ): Promise<any> {
      (event as any)._behavior = this._dropBehavior(event);

      this._currentDragEvent = event;
      const data = foundry.applications.ux.TextEditor.getDragEventData(event);
      const actor = this.actor;
      const allowed = TidyHooks.foundryDropActorSheetData(actor, this, data);
      if (allowed === false) return;

      // Dropped Documents
      const documentClass = foundry.utils.getDocumentClass(data.type);
      if (documentClass) {
        const document = await documentClass.fromDropData(data);
        return await this._onDropDocument(event, document);
      }

      // Other Drops
      switch (data.type) {
        case CONSTANTS.FLAG_TYPE_TIDY_JOURNAL:
          return await this._onDropJournal(event, data);
        case CONSTANTS.DOCUMENT_NAME_ACTIVITY:
          // Activity5e can't be found by `.getDocumentClass()`.
          const document = await fromUuid(data.uuid);
          return await this._onDropActivity(event, document);
      }

      return await super._onDrop(event);
    }

    async _onDropDocument(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      document: any
    ) {
      switch (document.documentName) {
        case CONSTANTS.DOCUMENT_NAME_ACTIVE_EFFECT:
          return await this._onDropActiveEffect(event, document);
        case CONSTANTS.DOCUMENT_NAME_ACTOR:
          return await this._onDropActor(event, document);
        case CONSTANTS.DOCUMENT_NAME_ITEM:
          return await this._onDropItem(event, document);
        case CONSTANTS.DOCUMENT_NAME_FOLDER:
          return await this._onDropFolder(event, document);
      }
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

        JournalQuadrone.sort(this.actor, sourceEntry.id, targetEntryId);
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
        JournalQuadrone.add(this.actor, {
          ...sourceEntry,
          id: newId,
        });

        // Remove from source actor if this is a move
        if (behavior === 'move') {
          JournalQuadrone.remove(sourceDocument, data.tidyJournalId);
        }
      }
    }

    /** @override */
    async _onDropActor(event: DragEvent, document: Actor5e) {
      const canPolymorph =
        game.user.isGM ||
        (this.actor.isOwner && game.settings.get('dnd5e', 'allowPolymorphing'));

      if (
        !canPolymorph ||
        // TODO: Create a polymorph tab ID blacklist that implementing sheet classes can opt into
        this.currentTabId === CONSTANTS.TAB_CHARACTER_BASTION
      ) {
        return;
      }

      // Configure the transformation
      const settings =
        await dnd5e.applications.actor.TransformDialog.promptSettings(
          this.actor,
          document,
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

      const hookId = Hooks.on(
        'dnd5e.transformActorV2',
        (
          originalActor: Actor5e,
          newActorSource: any,
          data: any,
          settings: unknown,
          options: unknown
        ) => {
          if (this.actor.system.favorites) {
            const transformTargetFavorites = data.system?.favorites ?? [];

            // Merge favorites, favoring the destination transformation actor's favorites, if any.
            const favoritesMap = [
              ...this.actor.system.favorites,
              ...transformTargetFavorites,
            ].reduce<Map<string, any>>(
              (prev, curr) => prev.set(curr.id, curr),
              new Map<string, any>()
            );
            const favorites = Array.from(favoritesMap).map((f) => f[1]);

            foundry.utils.mergeObject(data, {
              ['system.favorites']: favorites,
            });
          }
        }
      );

      try {
        return await this.actor.transformInto(document, settings);
      } finally {
        Hooks.off('dnd5e.transformActorV2', hookId);
      }
    }

    async _onDropItem(
      event: DragEvent & { currentTarget: HTMLElement },
      document: Item5e
    ): Promise<object | boolean | undefined> {
      const behavior = (event as any)._behavior;

      if (!this.actor.isOwner || behavior === 'none') {
        return false;
      }

      // Handle moving out of container & item sorting
      if (behavior === 'move' && this.actor.uuid === document.parent?.uuid) {
        const removingFromContainer = !isNil(document.system.container);
        if (removingFromContainer) {
          await document.update({ 'system.container': null });
        }

        const itemData = document.toObject();

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
          TidyFlags.section.set(document, targetSection);
          return;
        } else if (isMovedToDefaultSection) {
          TidyFlags.section.unset(document);
          return;
        }

        return initialSortResult;
      }

      return this._onDropItemCreate(document, event, behavior);
    }

    /**
     * Handle the final creation of dropped Item data on the Actor.
     */
    async _onDropItemCreate(
      itemData: Item5e[] | Item5e | object,
      event: Event,
      behavior?: DropEffectValue | null
    ): Promise<Item5e[]> {
      let items = itemData instanceof Array ? itemData : [itemData];
      return await this._onDropCreateItems(event, items, behavior);
    }

    async _onDropCreateItems(
      event: Event,
      items: any[],
      behavior?: DropEffectValue | null
    ) {
      behavior ??= (event as any)._behavior;
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
        items.forEach((i) => i?.delete({ deleteContents: true }));
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
      ['attuned', 'equipped', 'prepared'].forEach((k) =>
        foundry.utils.deleteProperty(itemData.system, k)
      );
    }

    /**
     * Handle dropping an Activity onto the sheet.
     * @param {DragEvent} event       The drag event.
     * @param {object} transfer       The dropped data.
     * @param {object} transfer.data  The Activity data.
     * @protected
     */
    async _onDropActivity(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      document: Activity5e
    ) {
      const targetItemId = event.target
        .closest('[data-item-id]')
        ?.getAttribute('data-item-id');

      const targetItem = this.actor.items.get(targetItemId);

      // Reordering
      if (!!targetItem && targetItem.uuid === document.item?.uuid) {
        const source = targetItem.system.activities.get(document._id);
        const targetId = event.target.closest<HTMLElement>(
          '.activity[data-activity-id]'
        )?.dataset.activityId;
        const target = targetItem.system.activities.get(targetId);
        if (!target || target === source) return;
        const siblings = targetItem.system.activities.filter(
          (a: any) => a._id !== document._id
        );
        const sortUpdates = foundry.utils.SortingHelpers.performIntegerSort(
          source,
          {
            target,
            siblings,
          }
        );
        const updateData = Object.fromEntries(
          sortUpdates.map(
            ({ target, update }: { target: any; update: any }) => {
              return [target._id, { sort: update.sort }];
            }
          )
        );
        targetItem.update({ 'system.activities': updateData });
      }

      // Copying/Moving
      else if (targetItem) {
        const data = document.toObject();
        delete data._id;
        const behavior = this._dropBehavior(event, document.toDragData());
        await targetItem.createActivity(data.type, data, {
          renderSheet: false,
        });
        if (behavior === 'move') {
          await document.delete();
        }
      }
    }

    async _onDropFolder(
      event: DragEvent & { currentTarget: HTMLElement },
      document: Folder
    ): Promise<object | boolean | undefined> {
      if (!this.actor.isOwner || document.type !== 'Item') {
        return [];
      }

      const droppedItemData = await Promise.all(
        document.contents.map(async (item: any) => {
          if (!(item instanceof Item)) item = await fromUuid(item.uuid);
          return item;
        })
      );

      return this._onDropItemCreate(
        droppedItemData,
        event,
        (event as any)._behavior
      );
    }

    /* -------------------------------------------- */
    /*  Sheet Actions                               */
    /* -------------------------------------------- */

    /**
     * Handle finding an available item of a given type.
     */
    async findItem(args: {
      event: Event;
      type: string;
      classIdentifier?: string;
      facilityType?: string;
    }) {
      const { event, classIdentifier, facilityType, type } = args;

      const filters: Record<string, any> = {
        locked: { types: new Set([type]) },
      };

      if (classIdentifier) {
        filters.locked.additional = { class: { [classIdentifier]: 1 } };
      }

      if (type === 'class') {
        const existingIdentifiers = new Set(Object.keys(this.actor.classes));
        filters.locked.arbitrary = [
          {
            o: 'NOT',
            v: { k: 'system.identifier', o: 'in', v: existingIdentifiers },
          },
        ];
      }

      if (type === 'facility' && facilityType) {
        const otherType = facilityType === 'basic' ? 'special' : 'basic';
        filters.locked.additional = {
          type: { [facilityType]: 1, [otherType]: -1 },
          level: { max: this.actor.system.details.level },
        };
      }

      let result = await dnd5e.applications.CompendiumBrowser.selectOne({
        filters,
      });

      if (result) {
        this._onDropItemCreate(
          game.items.fromCompendium(await fromUuid(result), { keepId: true }),
          event,
          'copy'
        );
      }
    }

    /* -------------------------------------------- */
    /* SheetTabCacheable
    /* -------------------------------------------- */

    onTabSelected(tabId: string) {
      this.currentTabId = tabId;
    }

    /* -------------------------------------------- */
    /* SheetExpandedItemsCacheable
    /* -------------------------------------------- */

    onItemToggled(itemId: string, isVisible: boolean, location: string) {
      const locationSet = mapGetOrInsert(
        this.expandedItems,
        itemId,
        new Set<string>()
      );

      if (isVisible) {
        locationSet?.add(location);
      } else {
        locationSet?.delete(location);
      }
    }
  }

  return Tidy5eActorSheetQuadroneBase;
}
