import type { Item5e } from 'src/types/item.types';
import type { SheetTabSectionConfigs } from 'src/features/sections/sections.types';
import { CONSTANTS } from 'src/constants';
import { isNil } from 'src/utils/data';
import type { Actor5e } from 'src/types/types';
import type { TidyFlagNamedNotes, TidyFlagUnnamedNotes } from './TidyFlags.types';

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

  static actionSection = {
    key: 'actionSection' as const,
    prop: TidyFlags.getFlagPropertyPath('actionSection'),
    get(item: Item5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(item, TidyFlags.actionSection.key) ??
        undefined
      );
    },
    set(item: Item5e, value: string) {
      return TidyFlags.setFlag(item, TidyFlags.actionSection.key, value);
    },
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.actionSection.key);
    },
  };

  static age = {
    key: 'age' as const,
    prop: TidyFlags.getFlagPropertyPath('age'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.age.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.age.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.age.key);
    },
  };

  /**
   * Determines whether an actor's sheet should be editable per the sheet lock feature (default `true`).
   * @param actor the actor
   * @returns whether the sheet should be editable per the sheet lock feature
   */
  static allowEdit = {
    key: 'allow-edit',
    prop: TidyFlags.getFlagPropertyPath('allow-edit'),
    get(document: any): boolean {
      return TidyFlags.tryGetFlag<boolean>(document, 'allow-edit') ?? true;
    },
    set(document: any, value: boolean) {
      return TidyFlags.setFlag(document, TidyFlags.allowEdit.key, value);
    },
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.allowEdit.key);
    },
  };

  static appearance = {
    key: 'appearance' as const,
    prop: TidyFlags.getFlagPropertyPath('appearance'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.appearance.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.appearance.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.appearance.key);
    },
  };

  static bond = {
    key: 'bond' as const,
    prop: TidyFlags.getFlagPropertyPath('bond'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.bond.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.bond.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.bond.key);
    },
  };

  static classFilter = {
    key: 'classFilter' as const,
    prop: TidyFlags.getFlagPropertyPath('classFilter'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.classFilter.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.classFilter.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.classFilter.key);
    },
  };

  static exhaustion = {
    key: 'exhaustion' as const,
    prop: TidyFlags.getFlagPropertyPath('exhaustion'),
    get(actor: Actor5e): number | undefined {
      return (
        TidyFlags.tryGetFlag<number>(actor, TidyFlags.exhaustion.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: number): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.exhaustion.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.exhaustion.key);
    },
  };

  static eyes = {
    key: 'eyes' as const,
    prop: TidyFlags.getFlagPropertyPath('eyes'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.eyes.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.eyes.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.eyes.key);
    },
  };

  static faith = {
    key: 'faith' as const,
    prop: TidyFlags.getFlagPropertyPath('faith'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.faith.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.faith.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.faith.key);
    },
  };

  static flaw = {
    key: 'flaw' as const,
    prop: TidyFlags.getFlagPropertyPath('flaw'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.flaw.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.flaw.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.flaw.key);
    },
  };

  static gender = {
    key: 'gender' as const,
    prop: TidyFlags.getFlagPropertyPath('gender'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.gender.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.gender.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.gender.key);
    },
  };

  static hair = {
    key: 'hair' as const,
    prop: TidyFlags.getFlagPropertyPath('hair'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.hair.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.hair.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.hair.key);
    },
  };

  static height = {
    key: 'height' as const,
    prop: TidyFlags.getFlagPropertyPath('height'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.height.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.height.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.height.key);
    },
  };

  static ideal = {
    key: 'ideal' as const,
    prop: TidyFlags.getFlagPropertyPath('ideal'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.ideal.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.ideal.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.ideal.key);
    },
  };

  static inventoryGrid = {
    key: 'inventory-grid',
    prop: TidyFlags.getFlagPropertyPath('inventory-grid'),
    get(document: any): boolean {
      return (
        TidyFlags.tryGetFlag<boolean>(document, TidyFlags.inventoryGrid.key) ===
        true
      );
    },
    set(document: any) {
      return TidyFlags.setFlag(document, TidyFlags.inventoryGrid.key, true);
    },
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.inventoryGrid.key);
    },
  };

  static maxPreparedSpells = {
    key: 'maxPreparedSpells' as const,
    prop: TidyFlags.getFlagPropertyPath('maxPreparedSpells'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.maxPreparedSpells.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.maxPreparedSpells.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.maxPreparedSpells.key);
    },
  };

  static motion = {
    key: 'motion' as const,
    prop: TidyFlags.getFlagPropertyPath('motion'),
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(actor, TidyFlags.motion.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.motion.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.motion.key);
    },
  };

  static notes = {
    key: 'notes' as const,
    prop: TidyFlags.getFlagPropertyPath('notes'),
    get(actor: Actor5e): TidyFlagUnnamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagUnnamedNotes>(actor, TidyFlags.notes.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: TidyFlagUnnamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes.key);
    },
    members: {
      value: {
        key: 'notes.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes.value'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes.members.value.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes.members.value.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes.members.value.key);
        },
      },
    },
  };

  static notes1 = {
    key: 'notes1' as const,
    prop: TidyFlags.getFlagPropertyPath('notes1'),
    get(actor: Actor5e): TidyFlagNamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagNamedNotes>(actor, TidyFlags.notes1.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: TidyFlagNamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes1.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes1.key);
    },
    members: {
      name: {
        key: 'notes1.name' as const,
        prop: TidyFlags.getFlagPropertyPath('notes1.name'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes1.members.name.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes1.members.name.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes1.members.name.key);
        },
      },
      value: {
        key: 'notes1.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes1.value'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes1.members.value.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes1.members.value.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes1.members.value.key);
        },
      },
    },
  };

  static notes2 = {
    key: 'notes2' as const,
    prop: TidyFlags.getFlagPropertyPath('notes2'),
    get(actor: Actor5e): TidyFlagNamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagNamedNotes>(actor, TidyFlags.notes2.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: TidyFlagNamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes2.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes2.key);
    },
    members: {
      name: {
        key: 'notes2.name' as const,
        prop: TidyFlags.getFlagPropertyPath('notes2.name'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes2.members.name.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes2.members.name.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes2.members.name.key);
        },
      },
      value: {
        key: 'notes2.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes2.value'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes2.members.value.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes2.members.value.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes2.members.value.key);
        },
      },
    },
  };

  static notes3 = {
    key: 'notes3' as const,
    prop: TidyFlags.getFlagPropertyPath('notes3'),
    get(actor: Actor5e): TidyFlagNamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagNamedNotes>(actor, TidyFlags.notes3.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: TidyFlagNamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes3.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes3.key);
    },
    members: {
      name: {
        key: 'notes3.name' as const,
        prop: TidyFlags.getFlagPropertyPath('notes3.name'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes3.members.name.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes3.members.name.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes3.members.name.key);
        },
      },
      value: {
        key: 'notes3.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes3.value'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes3.members.value.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes3.members.value.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes3.members.value.key);
        },
      },
    },
  };

  static notes4 = {
    key: 'notes4' as const,
    prop: TidyFlags.getFlagPropertyPath('notes4'),
    get(actor: Actor5e): TidyFlagNamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagNamedNotes>(actor, TidyFlags.notes4.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: TidyFlagNamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes4.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes4.key);
    },
    members: {
      name: {
        key: 'notes4.name' as const,
        prop: TidyFlags.getFlagPropertyPath('notes4.name'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes4.members.name.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes4.members.name.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes4.members.name.key);
        },
      },
      value: {
        key: 'notes4.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes4.value'),
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes4.members.value.key
            ) ?? undefined
          );
        },
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes4.members.value.key,
            value
          );
        },
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes4.members.value.key);
        },
      },
    },
  };

  static parentClass = {
    key: 'parentClass' as const,
    prop: TidyFlags.getFlagPropertyPath('parentClass'),
    get(item: Item5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(item, TidyFlags.parentClass.key) ??
        undefined
      );
    },
    set(item: Item5e, value: string): Promise<void> {
      return TidyFlags.setFlag(item, TidyFlags.parentClass.key, value);
    },
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.parentClass.key);
    },
  };

  static playerName = {
    key: 'playerName' as const,
    prop: TidyFlags.getFlagPropertyPath('playerName'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.playerName.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.playerName.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.playerName.key);
    },
  };

  static section = {
    key: 'section' as const,
    prop: TidyFlags.getFlagPropertyPath('section'),
    get(item: Item5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(item, TidyFlags.section.key) ?? undefined
      );
    },
    set(item: Item5e, value: string) {
      return TidyFlags.setFlag(item, TidyFlags.section.key, value);
    },
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

  static selectedTabs = {
    key: 'selected-tabs' as const,
    prop: TidyFlags.getFlagPropertyPath('selected-tabs'),
    get(actor: Actor5e): string[] | undefined {
      return (
        TidyFlags.tryGetFlag<string[]>(actor, TidyFlags.selectedTabs.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: string[]): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.selectedTabs.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.selectedTabs.key);
    },
  };

  static showContainerPanel = {
    key: 'showContainerPanel' as const,
    prop: TidyFlags.getFlagPropertyPath('showContainerPanel'),
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          actor,
          TidyFlags.showContainerPanel.key
        ) ?? undefined
      );
    },
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.showContainerPanel.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.showContainerPanel.key);
    },
  };

  static showLegendaryToolbar = {
    key: 'show-legendary-toolbar' as const,
    prop: TidyFlags.getFlagPropertyPath('show-legendary-toolbar'),
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          actor,
          TidyFlags.showLegendaryToolbar.key
        ) ?? undefined
      );
    },
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(
        actor,
        TidyFlags.showLegendaryToolbar.key,
        value
      );
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.showLegendaryToolbar.key);
    },
  };

  static showNpcPersonalityInfo = {
    key: 'showNpcPersonalityInfo' as const,
    prop: TidyFlags.getFlagPropertyPath('showNpcPersonalityInfo'),
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          actor,
          TidyFlags.showNpcPersonalityInfo.key
        ) ?? undefined
      );
    },
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(
        actor,
        TidyFlags.showNpcPersonalityInfo.key,
        value
      );
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.showNpcPersonalityInfo.key);
    },
  };

  static skillsExpanded = {
    key: 'skillsExpanded' as const,
    prop: TidyFlags.getFlagPropertyPath('skillsExpanded'),
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(actor, TidyFlags.skillsExpanded.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.skillsExpanded.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.skillsExpanded.key);
    },
  };

  static skin = {
    key: 'skin' as const,
    prop: TidyFlags.getFlagPropertyPath('skin'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.skin.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.skin.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.skin.key);
    },
  };

  static spellbookGrid = {
    key: 'spellbook-grid',
    prop: TidyFlags.getFlagPropertyPath('spellbook-grid'),
    get(document: any): boolean {
      return (
        TidyFlags.tryGetFlag<boolean>(document, TidyFlags.spellbookGrid.key) ===
        true
      );
    },
    set(document: any) {
      return TidyFlags.setFlag(document, TidyFlags.spellbookGrid.key, true);
    },
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.spellbookGrid.key);
    },
  };

  static trait = {
    key: 'trait' as const,
    prop: TidyFlags.getFlagPropertyPath('trait'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.trait.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.trait.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.trait.key);
    },
  };

  static weight = {
    key: 'weight' as const,
    prop: TidyFlags.getFlagPropertyPath('weight'),
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.weight.key) ?? undefined
      );
    },
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.weight.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.weight.key);
    },
  };

  static tryGetFlag<T>(flagged: any, flagName: string) {
    return flagged.getFlag(CONSTANTS.MODULE_ID, flagName) as
      | T
      | null
      | undefined;
  }

  static setFlag(
    flagged: any,
    flagName: string,
    value: unknown
  ): Promise<void> {
    return flagged.setFlag(CONSTANTS.MODULE_ID, flagName, value);
  }

  static traitsExpanded = {
    key: 'traitsExpanded' as const,
    prop: TidyFlags.getFlagPropertyPath('traitsExpanded'),
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(actor, TidyFlags.traitsExpanded.key) ??
        undefined
      );
    },
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.traitsExpanded.key, value);
    },
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.traitsExpanded.key);
    },
  };

  static unsetFlag(flagged: any, flagName: string): Promise<void> {
    return flagged.unsetFlag(CONSTANTS.MODULE_ID, flagName);
  }
}
