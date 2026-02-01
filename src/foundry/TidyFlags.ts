import type { Item5e } from 'src/types/item.types';
import type {
  DocumentSectionAssignments,
  SheetTabSectionConfigs,
} from 'src/features/sections/sections.types';
import { CONSTANTS } from 'src/constants';
import { isNil } from 'src/utils/data';
import type { Actor5e } from 'src/types/types';
import type {
  DocumentJournalEntries,
  TidyFlagUnnamedNotes,
  EncounterPlaceholders,
  EncounterPlaceholder,
  EncounterCombatantsSettings,
  SheetPinFlag,
} from './TidyFlags.types';
import type { ThemeSettingsV3 } from 'src/theme/theme-quadrone.types';
import type { SheetTabConfiguration } from 'src/settings/settings.types';
import { TabConfigurationSchema } from 'src/settings/settings-data-models';

/** Manages Tidy flags. */
export class TidyFlags {
  static getFlagPropertyPath(key: string) {
    return `flags.${CONSTANTS.MODULE_ID}.${key}`;
  }

  /**
   * Determines whether an item whose default Action List behavior has been overridden
   * to be included (`true`) or excluded (`false`).
   * `undefined` means there is no override and standard Action List logic should be used.
   * */
  static actionFilterOverride = {
    key: 'action-filter-override' as const,
    prop: TidyFlags.getFlagPropertyPath('action-filter-override'),
    /** Gets the item's Action Filter Override setting. */
    get(item: Item5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          item,
          TidyFlags.actionFilterOverride.key
        ) ?? undefined
      );
    },
    /** Sets the item's Action Filter Override setting. */
    set(item: Item5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(item, TidyFlags.actionFilterOverride.key, value);
    },
    /**
     * Clears the item's Action Filter Override setting,
     * meaning the item should use the standard Action List logic
     * for inclusion or exclusion. */
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.actionFilterOverride.key);
    },
  };

  /**
   * Indicates a custom section name for a given item,
   * which determines the item's section placement
   * in the Actions tab.
   */
  static actionSection = {
    key: 'actionSection' as const,
    prop: TidyFlags.getFlagPropertyPath('actionSection'),
    unsetProp: TidyFlags.getFlagPropertyPath('-=actionSection'),
    /** Gets the item's Action Section setting. */
    get(item: Item5e): string | undefined {
      const actionSectionValue = TidyFlags.tryGetFlag(
        item,
        TidyFlags.actionSection.key
      );

      const actionSection =
        typeof actionSectionValue === 'string' ? actionSectionValue.trim() : '';

      return !isNil(actionSection, '') ? actionSection : undefined;
    },
    /** Sets the item's Action Section setting. */
    set(item: Item5e, value: string) {
      return TidyFlags.setFlag(item, TidyFlags.actionSection.key, value);
    },
    /**
     * Clears the item's Action Section setting,
     * meaning the item should use its default action section
     * in the Actions tab.
     */
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.actionSection.key);
    },
  };

  /**
   * The combatant settings for encounter member NPCs.
   */
  static combatantSettings = {
    key: 'combatantSettings' as const,
    /** Gets encounter member NPC combatant settings. */
    get(encounter: Actor5e): EncounterCombatantsSettings {
      return (
        TidyFlags.tryGetFlag<EncounterCombatantsSettings>(
          encounter,
          TidyFlags.combatantSettings.key
        ) ?? {}
      );
    },
    /**
     * Sets encounter member NPC combatant settings. It fully replaces the combatant settings object,
     * since differentials will result in straggler data remaining behind.
     */
    async set(encounter: Actor5e, settings: EncounterCombatantsSettings) {
      await encounter.update(
        { [`flags.tidy5e-sheet.combatantSettings`]: null },
        {
          render: false,
        }
      );
      return await TidyFlags.setFlag(
        encounter,
        TidyFlags.combatantSettings.key,
        settings
      );
    },
  };

  /**
   * The ID of the group which should be measured against
   * when determine an encounter's difficulty.
   */
  static encounterDifficultyTargetGroupId = {
    key: 'encounterDifficultyTargetGroupId' as const,
    /** Gets the group ID. */
    get(user: any): string | null | undefined {
      return TidyFlags.tryGetFlag<string>(
        user,
        TidyFlags.encounterDifficultyTargetGroupId.key
      );
    },
    /** Sets the group ID. */
    async set(user: any, groupActorId: string) {
      return TidyFlags.setFlag(
        user,
        TidyFlags.encounterDifficultyTargetGroupId.key,
        groupActorId
      );
    },
  };

  /**
   * An array of journal entries with an optional title
   * and an HTML-based journal.
   */
  static documentJournal = {
    key: 'document-journal',
    prop: TidyFlags.getFlagPropertyPath('document-journal'),
    get(doc: any): DocumentJournalEntries {
      return (
        TidyFlags.tryGetFlag<DocumentJournalEntries>(
          doc,
          TidyFlags.documentJournal.key
        ) ?? {}
      );
    },
    set(doc: any, journal: DocumentJournalEntries) {
      return TidyFlags.setFlag(doc, TidyFlags.documentJournal.key, journal);
    },
    unset(doc: any) {
      TidyFlags.unsetFlag(doc, TidyFlags.documentJournal.key);
    },
  };

  /**
   * The age of an actor.
   * For this module, it is only an informational biographical field.
   */
  static age = {
    key: 'age' as const,
    prop: TidyFlags.getFlagPropertyPath('age'),
    /** Gets the actor's age. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.age.key) ?? undefined
      );
    },
    /** Sets the actor's age. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.age.key, value);
    },
    /** Clears the actor's age. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.age.key);
    },
  };

  /**
   * The appearance of an actor.
   * For this module, it is only an informational biographical field.
   */
  static appearance = {
    key: 'appearance' as const,
    prop: TidyFlags.getFlagPropertyPath('appearance'),
    /** Gets the actor's appearance. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.appearance.key) ??
        undefined
      );
    },
    /** Sets the actor's appearance. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.appearance.key, value);
    },
    /** Clears the actor's appearance. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.appearance.key);
    },
  };

  /**
   * The eyes of an actor.
   * For this module, it is only an informational biographical field.
   */
  static eyes = {
    key: 'eyes' as const,
    prop: TidyFlags.getFlagPropertyPath('eyes'),
    /** Gets the actor's eyes. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.eyes.key) ?? undefined
      );
    },
    /** Sets the actor's eyes. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.eyes.key, value);
    },
    /** Clears the actor's eyes. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.eyes.key);
    },
  };

  /**
   * The faith of an actor.
   * For this module, it is only an informational biographical field.
   */
  static faith = {
    key: 'faith' as const,
    prop: TidyFlags.getFlagPropertyPath('faith'),
    /** Gets the actor's faith. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.faith.key) ?? undefined
      );
    },
    /** Sets the actor's faith. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.faith.key, value);
    },
    /** Clears the actor's faith. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.faith.key);
    },
  };

  /**
   * The gender of an actor.
   * For this module, it is only an informational biographical field.
   */
  static gender = {
    key: 'gender' as const,
    prop: TidyFlags.getFlagPropertyPath('gender'),
    /** Gets the actor's gender. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.gender.key) ?? undefined
      );
    },
    /** Sets the actor's gender. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.gender.key, value);
    },
    /** Clears the actor's gender. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.gender.key);
    },
  };

  /**
   * The hair of an actor.
   * For this module, it is only an informational biographical field.
   */
  static hair = {
    key: 'hair' as const,
    prop: TidyFlags.getFlagPropertyPath('hair'),
    /** Gets the actor's hair. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.hair.key) ?? undefined
      );
    },
    /** Sets the actor's hair. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.hair.key, value);
    },
    /** Clears the actor's hair. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.hair.key);
    },
  };

  /**
   * The height of an actor.
   * For this module, it is only an informational biographical field.
   */
  static height = {
    key: 'height' as const,
    prop: TidyFlags.getFlagPropertyPath('height'),
    /** Gets the actor's height. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.height.key) ?? undefined
      );
    },
    /** Sets the actor's height. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.height.key, value);
    },
    /** Clears the actor's height. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.height.key);
    },
  };

  /**
   * Denotes whether to include all ritual spells in the "Can Cast" filter.
   */
  static includeRitualsInCanCast = {
    key: 'includeRitualsInCanCast',
    prop: TidyFlags.getFlagPropertyPath('includeRitualsInCanCast'),
    /** Gets whether to include rituals in the "Can Cast" spell filter. */
    get(document: any): boolean {
      return (
        TidyFlags.tryGetFlag<boolean>(
          document,
          TidyFlags.includeRitualsInCanCast.key
        ) === true
      );
    },
    /** Sets whether to include rituals in the "Can Cast" spell filter. */
    set(document: any, value: boolean = true) {
      return TidyFlags.setFlag(
        document,
        TidyFlags.includeRitualsInCanCast.key,
        value
      );
    },
    /** Clears whether to include rituals in the "Can Cast" spell filter. */
    unset(document: any) {
      return TidyFlags.unsetFlag(
        document,
        TidyFlags.includeRitualsInCanCast.key
      );
    },
  };

  static showLegendariesOnNpcStatblock = {
    key: 'showLegendariesOnNpcStatblock',
    prop: TidyFlags.getFlagPropertyPath('showLegendariesOnNpcStatblock'),
    /** Gets whether to show legendary panels in the NPC Statblock tab. */
    get(document: any): boolean | null {
      return (
        TidyFlags.tryGetFlag<boolean>(
          document,
          TidyFlags.showLegendariesOnNpcStatblock.key
        ) ?? null
      );
    },
    /** Sets whether to show legendary panels in the NPC Statblock tab. */
    set(document: any, value: boolean = true) {
      return TidyFlags.setFlag(
        document,
        TidyFlags.showLegendariesOnNpcStatblock.key,
        value
      );
    },
    /** Clears whether to show legendary panels in the NPC Statblock tab. */
    unset(document: any) {
      return TidyFlags.unsetFlag(
        document,
        TidyFlags.showLegendariesOnNpcStatblock.key
      );
    },
  };

  static includeSpellbookInNpcStatblockTab = {
    key: 'includeSpellbookInNpcStatblockTab',
    prop: TidyFlags.getFlagPropertyPath('includeSpellbookInNpcStatblockTab'),
    /** Gets whether to include spellbook sections in the NPC Statblock tab. */
    get(document: any): boolean | null {
      return (
        TidyFlags.tryGetFlag<boolean>(
          document,
          TidyFlags.includeSpellbookInNpcStatblockTab.key
        ) ?? null
      );
    },
    /** Sets whether to include spellbook sections in the NPC Statblock tab. */
    set(document: any, value: boolean = true) {
      return TidyFlags.setFlag(
        document,
        TidyFlags.includeSpellbookInNpcStatblockTab.key,
        value
      );
    },
    /** Clears whether to include spellbook sections in the NPC Statblock tab. */
    unset(document: any) {
      return TidyFlags.unsetFlag(
        document,
        TidyFlags.includeSpellbookInNpcStatblockTab.key
      );
    },
  };

  /**
   * An item ID which denotes an actor-owned item
   * whose uses should be used for the banked
   * inspiration tracker on the character sheet.
   */
  static inspirationSource = {
    key: 'inspiration-source',
    prop: TidyFlags.getFlagPropertyPath('inspiration-source'),
    /** Gets an item ID or a blank string. */
    get(document: any): string {
      return (
        TidyFlags.tryGetFlag<string>(
          document,
          TidyFlags.inspirationSource.key
        ) ?? ''
      );
    },
    /** Sets an item ID to represent an actor's source of inspiration value and max. */
    set(document: any, itemId: string) {
      return TidyFlags.setFlag(
        document,
        TidyFlags.inspirationSource.key,
        itemId
      );
    },
    /** Clears an actor's inspiration source, indicating to use the regular boolean tracker. */
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.inspirationSource.key);
    },
  };

  /**
   * Journal notes for an actor.
   * This flag is for actors which don't yet have the standard notes schema.
   */
  static notes = {
    key: 'notes' as const,
    prop: TidyFlags.getFlagPropertyPath('notes'),
    /** Gets the actor's journal notes. */
    get(actor: Actor5e): TidyFlagUnnamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagUnnamedNotes>(
          actor,
          TidyFlags.notes.key
        ) ?? undefined
      );
    },
    /** Sets the actor's journal notes. */
    set(actor: Actor5e, value: TidyFlagUnnamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes.key, value);
    },
    /** Clears the actor's journal notes. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes.key);
    },
    /** The individual members of this flag. For flags that are not primitive values. */
    members: {
      /** The notes HTML. */
      value: {
        key: 'notes.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes.value'),
        /** Gets the actor's notes HTML. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes.members.value.key
            ) ?? undefined
          );
        },
        /** Sets the actor's notes HTML. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes.members.value.key,
            value
          );
        },
        /** Clears the actor's notes HTML. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes.members.value.key);
        },
      },
    },
  };

  /**
   * Encounter sheet placeholders which can be managed on the Combat tab
   * and which can be inserted into the Combat Tracker for the active
   * encounter.
   */
  static placeholders = {
    key: 'placeholders' as const,
    prop: TidyFlags.getFlagPropertyPath('placeholders'),
    /** Gets the placeholders for the specified encounter. */
    get(actor: Actor5e): EncounterPlaceholders {
      return (
        TidyFlags.tryGetFlag<EncounterPlaceholders>(
          actor,
          TidyFlags.placeholders.key
        ) ?? {}
      );
    },
    /** Sets the placeholders for the specified encounter. */
    set(actor: Actor5e, placeholders: EncounterPlaceholders): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.placeholders.key, placeholders);
    },
    /** Inserts or updates a single entry in the current placeholders for the specified actor */
    insertOrUpdateEntry(
      actor: Actor5e,
      placeholder: EncounterPlaceholder
    ): Promise<void> {
      const placeholders = TidyFlags.placeholders.get(actor);
      placeholders[placeholder.id] = placeholder;
      return TidyFlags.placeholders.set(actor, placeholders);
    },
    deleteEntry(actor: Actor5e, placeholderId: string): Promise<void> {
      const placeholders = TidyFlags.placeholders.get(actor);

      delete placeholders[placeholderId];

      // @ts-ignore - Foundry delete operation.
      placeholders[`-=${placeholderId}`] = null;

      return TidyFlags.placeholders.set(actor, placeholders);
    },
  };

  /**
   * Indicates a custom section name for a given item
   * which determines the item's section placement
   * in the item's default tab, as well as any other locations
   * that aren't the Actions tab.
   */
  static section = {
    key: 'section' as const,
    prop: TidyFlags.getFlagPropertyPath('section'),
    unsetProp: TidyFlags.getFlagPropertyPath('-=section'),
    /** Gets the custom section name for an item. */
    get(item: Item5e): string | undefined {
      const sectionValue = TidyFlags.tryGetFlag(item, TidyFlags.section.key);

      const section =
        typeof sectionValue === 'string' ? sectionValue.trim() : '';

      return !isNil(section, '') ? section : undefined;
    },
    /** Sets the custom section name for an item. */
    set(item: Item5e, value: string) {
      return TidyFlags.setFlag(item, TidyFlags.section.key, value);
    },
    /**
     * Clears the item's custom section setting,
     * meaning the item should use its default section
     * in the item's default tab, as well as any other locations
     * that aren't the Actions tab.
     */
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.section.key);
    },
  };

  /** Determines the order of item table sections for a given document sheet. */
  static sectionConfig = {
    key: 'sheet-section-config' as const,
    prop: TidyFlags.getFlagPropertyPath('sheet-section-config'),
    /** Gets the document sheet's section configuration. `undefined` means to use the default settings. */
    get(document: any): SheetTabSectionConfigs | undefined {
      const sectionConfigs = TidyFlags.tryGetFlag<SheetTabSectionConfigs>(
        document,
        TidyFlags.sectionConfig.key
      );

      if (!sectionConfigs) {
        return undefined;
      }

      for (let section of Object.values(sectionConfigs)) {
        // Account for how localized keys are stored. For each top-level property, flatten until SheetTabSectionConfigs shape achieved.
        for (let [key, value] of Object.entries(section)) {
          if (Object.getOwnPropertyNames(value).length > 1) {
            continue;
          }

          let newKey = key;
          let newValue: any = value;

          while (true) {
            const propNames = Object.getOwnPropertyNames(newValue);

            let currentPropAtDepth = propNames[0];
            if (isNil(currentPropAtDepth) || propNames.length > 1) {
              break;
            }

            newKey += '.' + currentPropAtDepth;
            newValue = newValue[currentPropAtDepth];
          }

          delete section[key];
          section[newKey] = newValue;
        }
      }

      return sectionConfigs;
    },
    /** Sets the document sheet's configuration. */
    set(document: any, value: SheetTabSectionConfigs) {
      return TidyFlags.setFlag(document, TidyFlags.sectionConfig.key, value);
    },
    /**
     * Clears the document sheet's section config,
     * meaning the target actor should use default settings.
     * */
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.sectionConfig.key);
    },
  };

  /**
   * A map of UUIDs to section keys for sheets with sub-documents that cannot house their own section assignments.
   */
  static sections = {
    key: 'sections' as const,
    prop: TidyFlags.getFlagPropertyPath('sections'),
    /** Gets the document's sub-document section assignments. */
    get(document: any): DocumentSectionAssignments {
      return (
        TidyFlags.tryGetFlag<DocumentSectionAssignments>(
          document,
          TidyFlags.sections.key
        ) ?? {}
      );
    },
    /** Sets the document's sub-document section assignments. */
    set(document: any, value: DocumentSectionAssignments): Promise<void> {
      return TidyFlags.setFlag(document, TidyFlags.sections.key, value);
    },
    /** Clears the document's sub-document section assignments. */
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.sections.key);
    },
  };

  /**
   * The tabs that are currently selected for a given document.
   * This is used to determine which tabs are visible
   * in the document's sheet.
   * When this field is empty, the document uses the default tabs.
   */
  static selectedTabs = {
    key: 'selected-tabs' as const,
    prop: TidyFlags.getFlagPropertyPath('selected-tabs'),
    /** Gets the selected tabs for a document. */
    get(doc: Actor5e | Item5e): string[] | undefined {
      return (
        TidyFlags.tryGetFlag<string[]>(doc, TidyFlags.selectedTabs.key) ??
        undefined
      );
    },
    /** Sets the selected tabs for a document. */
    set(doc: Actor5e | Item5e, value: string[]): Promise<void> {
      return TidyFlags.setFlag(doc, TidyFlags.selectedTabs.key, value);
    },
    /** Clears the selected tabs for a document. */
    unset(doc: Actor5e | Item5e) {
      return TidyFlags.unsetFlag(doc, TidyFlags.selectedTabs.key);
    },
  };

  /**
   * Denotes the items and activities which have been pinned to a significant tab on a sheet.
   */
  static sheetPins = {
    key: 'sheetPins' as const,
    prop: TidyFlags.getFlagPropertyPath('sheetPins'),
    /** Gets the actor's sheet pins. */
    get(actor: Actor5e): SheetPinFlag[] {
      return (
        TidyFlags.tryGetFlag<SheetPinFlag[]>(actor, TidyFlags.sheetPins.key) ??
        []
      );
    },
    /** Sets the actor's sheet pins. */
    set(actor: Actor5e, value: SheetPinFlag[]): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.sheetPins.key, value);
    },
  };

  /**
   * Indicates whether the container panel should be shown for a given actor.
   * This is used to determine whether the container panel is visible
   * in the actor's inventory tab.
   */
  static showContainerPanel = {
    key: 'showContainerPanel' as const,
    prop: TidyFlags.getFlagPropertyPath('showContainerPanel'),
    /** Gets whether the container panel should be shown for an actor. */
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          actor,
          TidyFlags.showContainerPanel.key
        ) ?? undefined
      );
    },
    /** Sets whether the container panel should be shown for an actor. */
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.showContainerPanel.key, value);
    },
    /** Clears whether the container panel should be shown for an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.showContainerPanel.key);
    },
  };

  /**
   * Indicates whether the skills section should be expanded for a given actor.
   * If this is set to `true`, all skills are shown.
   * If this is set to `false`, unproficient skills are hidden and the rest are shown.
   */
  static skillsExpanded = {
    key: 'skillsExpanded' as const,
    prop: TidyFlags.getFlagPropertyPath('skillsExpanded'),
    /** Gets whether the skills section should be expanded for an actor. */
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(actor, TidyFlags.skillsExpanded.key) ??
        undefined
      );
    },
    /** Sets whether the skills section should be expanded for an actor. */
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.skillsExpanded.key, value);
    },
    /** Clears whether the skills section should be expanded for an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.skillsExpanded.key);
    },
  };

  /**
   * The skin of an actor.
   * This is informational and not used for game logic.
   */
  static skin = {
    key: 'skin' as const,
    prop: TidyFlags.getFlagPropertyPath('skin'),
    /** Gets the skin of an actor. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.skin.key) ?? undefined
      );
    },
    /** Sets the skin of an actor. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.skin.key, value);
    },
    /** Clears the skin of an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.skin.key);
    },
  };

  static sheetThemeSettings = {
    key: 'sheet-theme-settings',
    prop: TidyFlags.getFlagPropertyPath('sheet-theme-settings'),
    get(doc: any): ThemeSettingsV3 | null | undefined {
      return TidyFlags.tryGetFlag<ThemeSettingsV3>(
        doc,
        TidyFlags.sheetThemeSettings.key
      );
    },
    set(doc: any, settings: ThemeSettingsV3) {
      return TidyFlags.setFlag(doc, TidyFlags.sheetThemeSettings.key, settings);
    },
    unset(doc: any) {
      return TidyFlags.unsetFlag(doc, TidyFlags.sheetThemeSettings.key);
    },
  };

  /**
   * Configuration for sheet sidebar tabs. Controls aspects like whether to include tabs.
   */
  static sidebarTabConfiguration = {
    key: 'sidebar-tab-configuration',
    prop: TidyFlags.getFlagPropertyPath('sidebar-tab-configuration'),
    /** Gets sidebar tab configuration. */
    get(doc: any): SheetTabConfiguration | null | undefined {
      let config = TidyFlags.tryGetFlag<SheetTabConfiguration>(
        doc,
        TidyFlags.sidebarTabConfiguration.key
      );

      if (!config) {
        return null;
      }

      config = TabConfigurationSchema.clean(config);
      TabConfigurationSchema.validate(config, { fallback: true });
      return config;
    },
    /** Sets sidebar tab configuration. */
    set(doc: any, config: SheetTabConfiguration) {
      const toSave = TabConfigurationSchema.clean(config);
      TabConfigurationSchema.validate(toSave, { fallback: true });

      return TidyFlags.setFlag(
        doc,
        TidyFlags.sidebarTabConfiguration.key,
        toSave
      );
    },
    /** Clears sidebar tab configuration. */
    unset(doc: any) {
      return TidyFlags.unsetFlag(doc, TidyFlags.sidebarTabConfiguration.key);
    },
  };

  /**
   * Configuration for sheet tabs. Controls aspects like whether to include tabs.
   */
  static tabConfiguration = {
    key: 'tab-configuration',
    prop: TidyFlags.getFlagPropertyPath('tab-configuration'),
    /** Gets tab configuration. */
    get(doc: any): SheetTabConfiguration | null | undefined {
      let config = TidyFlags.tryGetFlag<SheetTabConfiguration>(
        doc,
        TidyFlags.tabConfiguration.key
      );

      if (!config) {
        return null;
      }

      config = TabConfigurationSchema.clean(config);
      TabConfigurationSchema.validate(config, { fallback: true });
      return config;
    },
    /** Sets tab configuration. */
    set(doc: any, config: SheetTabConfiguration) {
      const toSave = TabConfigurationSchema.clean(config);
      TabConfigurationSchema.validate(toSave, { fallback: true });

      return TidyFlags.setFlag(doc, TidyFlags.tabConfiguration.key, toSave);
    },
    /** Clears tab configuration. */
    unset(doc: any) {
      return TidyFlags.unsetFlag(doc, TidyFlags.tabConfiguration.key);
    },
  };

  /**
   * The trait of an actor.
   * This is informational and not used for game logic.
   */
  static trait = {
    key: 'trait' as const,
    prop: TidyFlags.getFlagPropertyPath('trait'),
    /** Gets the trait of an actor. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.trait.key) ?? undefined
      );
    },
    /** Sets the trait of an actor. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.trait.key, value);
    },
    /** Clears the trait of an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.trait.key);
    },
  };

  /**
   * The weight of an actor.
   * For this module, it is only an informational biographical field.
   */
  static weight = {
    key: 'weight' as const,
    prop: TidyFlags.getFlagPropertyPath('weight'),
    /** Gets the weight of an actor. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.weight.key) ?? undefined
      );
    },
    /** Sets the weight of an actor. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.weight.key, value);
    },
    /** Clears the weight of an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.weight.key);
    },
  };

  /**
   * Attempts to get a flag from a document.
   * @param flagged A document which supports flags.
   * @param flagName The name of the flag to get.
   * @returns The flag's value, or `undefined` if the flag is not set.
   *
   * @remarks
   * This function is generic, but it is not performing parsing of the flag's value.
   * It is simply doing an optimistic cast to the target type.
   */
  static tryGetFlag<T>(flagged: any | undefined, flagName: string) {
    return (
      flagged ? flagged.getFlag(CONSTANTS.MODULE_ID, flagName) : undefined
    ) as T | null | undefined;
  }

  /**
   * Sets a flag on a document.
   * @param flagged A document to set the flag on.
   * @param flagName The name of the flag to set.
   * @param value The value to set the flag to.
   * @returns A promise that resolves when the flag is set.
   */
  static setFlag(
    flagged: any,
    flagName: string,
    value: unknown
  ): Promise<void> {
    return flagged.setFlag(CONSTANTS.MODULE_ID, flagName, value);
  }

  /**
   * Clears a flag from a document.
   * @param flagged A document to clear the flag from.
   * @param flagName The name of the flag to clear.
   * @returns A promise that resolves when the flag is cleared.
   */
  static unsetFlag(flagged: any, flagName: string): Promise<void> {
    return flagged.unsetFlag(CONSTANTS.MODULE_ID, flagName);
  }
}
