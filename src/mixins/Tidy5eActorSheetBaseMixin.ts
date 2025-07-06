import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { type DropEffectValue } from './DragAndDropBaseMixin';
import type { Item5e } from 'src/types/item.types';
import { firstOfSet } from 'src/utils/set';
import { CONSTANTS } from 'src/constants';
import type {
  ApplicationConfiguration,
  ApplicationPosition,
} from 'src/types/application.types';
import type { Actor5e } from 'src/types/types';
import { settings } from 'src/settings/settings.svelte';
import ClassicTabSelectionFormApplication from 'src/applications/tab-selection/ClassicTabSelectionFormApplication.svelte';
import { isNil } from 'src/utils/data';
import { TidyFlags } from 'src/foundry/TidyFlags';

export function Tidy5eActorSheetBaseMixin(BaseApplication: any) {
  class Tidy5eActorSheetBase extends BaseApplication {
    _supportedItemTypes: Set<string> = new Set();
    _currentDragEvent: (DragEvent & { currentTarget: HTMLElement }) | undefined;

    constructor(options?: Partial<ApplicationConfiguration> | undefined) {
      super(options);
    }

    static readonly ACTOR_ACTIONS_AND_CONTROLS = {
      showPortraitArtwork: {
        control: {
          action: 'showPortraitArtwork',
          icon: 'fa-solid fa-image',
          label: 'SIDEBAR.CharArt',
          ownership: 'OWNER',
        },
        action: {
          showPortraitArtwork: Tidy5eActorSheetBase.#onShowPortraitArtwork,
        },
      },
      showTokenArtwork: {
        control: {
          action: 'showTokenArtwork',
          icon: 'fa-solid fa-image',
          label: 'SIDEBAR.TokenArt',
          ownership: 'OWNER',
        },
        action: {
          showTokenArtwork: Tidy5eActorSheetBase.#onShowTokenArtwork,
        },
      },
      openTabSelection: {
        control: {
          action: 'openTabSelection',
          icon: 'fas fa-file-invoice',
          label: 'TIDY5E.TabSelection.MenuOptionText',
          visible: function (this: Tidy5eActorSheetBase) {
            return this.isEditable;
          },
        },
        action: {
          openTabSelection: async function (this: { actor?: Actor5e }) {
            new ClassicTabSelectionFormApplication(this.actor).render(true);
          },
        },
      },
    };

    /* -------------------------------------------- */
    /*  Application Lifecycle Functions             */
    /* -------------------------------------------- */

    /**
     * Perform any dynamic behavior on controls which depends on the current state of the sheet.
     * @returns
     */
    _getHeaderControls() {
      const controls = super._getHeaderControls();

      return controls;
    }

    /* -------------------------------------------- */
    /*  Drag and Drop Handlers                      */
    /* -------------------------------------------- */

    async _onDrop(
      event: DragEvent & { currentTarget: HTMLElement }
    ): Promise<any> {
      this._currentDragEvent = event;
      const data = foundry.applications.ux.TextEditor.getDragEventData(event);
      const actor = this.actor;
      // TODO: Extract hook call
      const allowed = Hooks.call('dropActorSheetData', actor, this, data);
      if (allowed === false) return;

      // Handle different data types
      switch (data.type) {
        case 'ActiveEffect':
          return this._onDropActiveEffect(event, data);
        case 'Actor':
          return this._onDropActor(event, data);
        case 'Item':
          return this._onDropItem(event, data);
        case 'Folder':
          return this._onDropFolder(event, data);
      }
    }

    /**
     * Handle the dropping of ActiveEffect data onto an Actor Sheet
     */
    async _onDropActiveEffect(
      _currentDragEvent: DragEvent & { currentTarget: HTMLElement },
      data: Record<string, any>
    ): Promise</*ActiveEffect*/ unknown | boolean> {
      const effect = await ActiveEffect.implementation.fromDropData(data);

      if (!this.actor.isOwner || !effect) {
        return false;
      }

      if (effect?.target === this.actor) {
        return false;
      }

      return ActiveEffect.create(effect.toObject(), { parent: this.actor });
    }

    /** @override */
    async _onDropActor(event: DragEvent, actor: Actor5e) {
      const canPolymorph =
        game.user.isGM ||
        (this.actor.isOwner && game.settings.get('dnd5e', 'allowPolymorphing'));
      if (!canPolymorph || this.tabGroups.primary === 'bastion') return;

      // Configure the transformation
      const settings =
        await dnd5e.applications.actor.TransformDialog.promptSettings(
          this.actor,
          actor,
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

      return this.actor.transformInto(actor, settings);
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
      const isSupportedItemType =
        this._supportedItemTypes.size === 0 ||
        this._supportedItemTypes.has(itemData.type);

      // Check to make sure items of this type are allowed on this actor
      if (!isSupportedItemType) {
        ui.notifications.warn(
          game.i18n.format('DND5E.ActorWarningInvalidItem', {
            itemType: game.i18n.localize(
              CONFIG.Item.typeLabels[
                itemData.type as keyof typeof CONFIG.Item.typeLabels
              ]
            ),
            actorType: game.i18n.localize(
              CONFIG.Actor.typeLabels[
                this.actor.type as keyof typeof CONFIG.Actor.typeLabels
              ]
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
      if (stacked) return false;

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
                CONFIG.Item.typeLabels[
                  itemData.type as keyof typeof CONFIG.Item.typeLabels
                ]
              ),
              actorType: game.i18n.localize(
                CONFIG.Actor.typeLabels[
                  this.actor.type as keyof typeof CONFIG.Actor.typeLabels
                ]
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
      if (itemData.type === 'spell') this._onDropSpell(itemData, event);

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

    /**
     * Adjust the preparation mode of a dropped spell depending on the drop location on the sheet.
     */
    _onDropSpell(itemData: any, event: DragEvent) {
      if (!['npc', 'character'].includes(this.document.type)) return;

      const dropTarget = event?.target;

      if (!dropTarget || !(dropTarget instanceof HTMLElement)) {
        return;
      }

      // Determine the section it is dropped on, if any.
      let header = dropTarget.closest<HTMLElement>('.items-header'); // Dropped directly on the header.
      if (header === null) {
        const list = dropTarget.closest<HTMLElement>('.item-list'); // Dropped inside an existing list.
        header =
          list?.previousElementSibling instanceof HTMLElement
            ? list.previousElementSibling
            : null;
      }

      const { level, preparationMode } =
        header?.closest<HTMLElement>('[data-level]')?.dataset ?? {};

      // Determine the actor's spell slot progressions, if any.
      const spellcastKeys = Object.keys(CONFIG.DND5E.spellcastingTypes);
      const progs = Object.values(this.document.classes).reduce<Set<string>>(
        (acc: any, cls: any) => {
          const type = cls.spellcasting?.type;
          if (spellcastKeys.includes(type)) acc.add(type);
          return acc;
        },
        new Set()
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

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    /**
     * Handle header control button clicks to render the Prototype Token configuration sheet.
     * @this {ActorSheetV2}
     * @param {PointerEvent} event
     */
    static async #onConfigureToken(
      this: { position: ApplicationPosition; token?: any; actor?: Actor5e },
      event: PointerEvent
    ) {
      event.preventDefault();
      const renderOptions = {
        left: Math.max(this.position.left - 560 - 10, 10),
        top: this.position.top,
      };
      if (this.token) {
        return this.token.sheet.render(true, renderOptions);
      } else {
        new CONFIG.Token.prototypeSheetClass(
          this.actor.prototypeToken,
          renderOptions
        ).render(true);
      }
    }

    /* -------------------------------------------- */

    /**
     * Handle header control button clicks to display actor portrait artwork.
     * @this {ActorSheetV2}
     * @param {PointerEvent} event
     */
    static async #onShowPortraitArtwork(
      this: { actor?: Actor5e },
      event: PointerEvent
    ) {
      const { img, name, uuid } = this.actor;
      new ImagePopout(img, { title: name, uuid: uuid }).render(true);
    }

    /* -------------------------------------------- */

    /**
     * Handle header control button clicks to display actor portrait artwork.
     * @this {ActorSheetV2}
     * @param {PointerEvent} event
     */
    static async #onShowTokenArtwork(
      this: { actor?: Actor5e },
      event: PointerEvent
    ) {
      const { prototypeToken, name, uuid } = this.actor;
      new ImagePopout(prototypeToken.texture.src, {
        title: name,
        uuid: uuid,
      }).render(true);
    }
  }

  return Tidy5eActorSheetBase;
}
