import { CONSTANTS } from 'src/constants';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import type {
  Actor5e,
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  GroupTrait,
  GroupTraitBase,
  MeasurableGroupTrait,
  MultiActorMemberPortraitContext,
  MultiActorQuadroneContext,
} from 'src/types/types';
import type {
  ApplicationClosingOptions,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { Inventory } from 'src/features/sections/Inventory';
import type { CurrencyContext, Item5e } from 'src/types/item.types';
import { Container } from 'src/features/containers/Container';
import { SheetSections } from 'src/features/sections/SheetSections';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { TidyFlags } from 'src/api';
import type { Group5eMember as MultiActor5eMember } from 'src/types/group.types';
import type { DropEffectValue } from 'src/mixins/DragAndDropBaseMixin';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { isNil } from 'src/utils/data';
import { mapGetOrInsertComputed } from 'src/utils/map';
import { Tidy5eCharacterSheetQuadrone } from './Tidy5eCharacterSheetQuadrone.svelte';
import { Tidy5eNpcSheetQuadrone } from './Tidy5eNpcSheetQuadrone.svelte';

export function Tidy5eMultiActorSheetQuadroneBase<
  TContext extends MultiActorQuadroneContext<any>
>(sheetType: string) {
  const TidyActorSheetBase = Tidy5eActorSheetQuadroneBase<TContext>(sheetType);

  abstract class Tidy5eMultiActorSheetQuadroneBase extends TidyActorSheetBase {
    async _prepareContext(
      options: ApplicationRenderOptions
    ): Promise<MultiActorQuadroneContext<Tidy5eMultiActorSheetQuadroneBase>> {
      const actorContext = (await super._prepareContext(
        options
      )) as ActorSheetQuadroneContext;

      const currencies: CurrencyContext[] = [];
      Object.keys(CONFIG.DND5E.currencies).forEach((key) =>
        currencies.push({
          key: key,
          value: this.actor.system.currency[key] as number,
          abbr:
            CONFIG.DND5E.currencies[key as keyof typeof CONFIG.DND5E.currencies]
              ?.abbreviation ?? key,
        })
      );

      const context = {
        containerPanelItems: await Inventory.getContainerPanelItems(
          actorContext.items
        ),
        currencies,
        inventory: [],
        showContainerPanel:
          TidyFlags.showContainerPanel.get(this.actor) == true,
        ...actorContext,
      };

      for (const panelItem of context.containerPanelItems) {
        const ctx = context.itemContext[panelItem.container.id];
        ctx.containerContents = await Container.getContainerContents(
          panelItem.container,
          {
            hasActor: true,
            unlocked: actorContext.unlocked,
          }
        );
      }

      return context;
    }

    _prepareItems(context: TContext) {
      const inventoryRowActions = TableRowActionsRuntime.getInventoryRowActions(
        context,
        { hasActionsTab: false, canEquip: false }
      );

      const inventory: ActorInventoryTypes =
        Inventory.getDefaultInventorySections({
          rowActions: inventoryRowActions,
        });

      let inventoryItems = Array.from(this.actor.items).reduce(
        (inventoryItems: Item5e[], item: Item5e) => {
          const ctx = (context.itemContext[item.id] ??= {});

          // Individual item preparation
          this._prepareItem(item, ctx);

          const isWithinContainer = this.actor.items.has(item.system.container);

          if (!isWithinContainer && Inventory.isItemInventoryType(item)) {
            inventoryItems.push(item);
          }

          return inventoryItems;
        },
        [] as Item5e[]
      );

      const inventoryTypes = Inventory.getInventoryTypes();
      // Organize items
      // Section the items by type
      for (let item of inventoryItems) {
        const ctx = (context.itemContext[item.id] ??= {});
        ctx.totalWeight = item.system.totalWeight?.toNearest(0.1);
        Inventory.applyInventoryItemToSection(inventory, item, inventoryTypes, {
          canCreate: true,
          rowActions: inventoryRowActions,
        });
      }

      SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
        context.actor,
        CONSTANTS.TAB_ACTOR_INVENTORY
      ).forEach((s) => {
        inventory[s] ??= Inventory.createInventorySection(s, inventoryTypes, {
          canCreate: true,
          rowActions: inventoryRowActions,
        });
      });

      context.inventory = Object.values(inventory);
    }

    protected _prepareItem(item: Item5e, ctx: TContext) {}

    async _preparePortrait(
      actor: Actor5e
    ): Promise<MultiActorMemberPortraitContext> {
      const showTokenPortrait = this.actor.getFlag(
        CONSTANTS.DND5E_SYSTEM_ID,
        CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT
      );

      const token = actor.isToken ? actor.token : actor.prototypeToken;

      const defaults = Actor.implementation.getDefaultArtwork(actor._source);
      let src = showTokenPortrait ? token.texture.src : actor.img;

      if (showTokenPortrait && token?.randomImg) {
        const images = await actor.getTokenImages();
        src = images[Math.floor(Math.random() * images.length)];
      }

      if (!src) {
        src = showTokenPortrait ? defaults.texture.src : defaults.img;
      }

      return {
        src,
        isVideo: foundry.helpers.media.VideoHelper.hasVideoExtension(src),
        shape: ThemeQuadrone.getActorPortraitShape(actor),
      };
    }

    getGpSummary(actor: Actor5e) {
      const currency = actor.system.currency;

      return Math.round(
        Object.keys(currency).reduce((total, key) => {
          return key in CONFIG.DND5E.currencies
            ? total + currency[key] / CONFIG.DND5E.currencies[key].conversion
            : total;
        }, 0)
      );
    }

    _prepareMemberLanguages(
      actor: any,
      languages: Map<string, MeasurableGroupTrait<number>>
    ) {
      let memberLanguages =
        actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
          ? Tidy5eCharacterSheetQuadrone._getLanguageTraits(actor)
          : actor.type === CONSTANTS.SHEET_TYPE_NPC
          ? Tidy5eNpcSheetQuadrone._getLanguageTraits(actor)
          : [];

      memberLanguages.forEach((language) => {
        const actorLanguageTrait = {
          label: language.label,
          units: language.units,
          unitsKey: language.unitsKey,
          value: language.value !== undefined ? language.value : undefined,
        };

        const groupLanguage = mapGetOrInsertComputed(
          languages,
          language.label,
          () => ({
            identifiers: new Map<string, MeasurableGroupTrait<number>>(),
            ...actorLanguageTrait,
          })
        );

        groupLanguage.identifiers.set(actor.uuid, actorLanguageTrait);

        const actorLanguageUniversalValue =
          actorLanguageTrait.value !== undefined &&
          !isNil(actorLanguageTrait.unitsKey, '')
            ? dnd5e.utils.convertLength(
                actorLanguageTrait.value,
                actorLanguageTrait.unitsKey,
                'ft'
              )
            : undefined;

        const groupLanguageUniversalValue =
          groupLanguage.value !== undefined &&
          !isNil(groupLanguage.unitsKey, '')
            ? dnd5e.utils.convertLength(
                groupLanguage.value,
                groupLanguage.unitsKey,
                'ft'
              )
            : undefined;

        if (
          actorLanguageUniversalValue &&
          actorLanguageUniversalValue > (groupLanguageUniversalValue ?? 0)
        ) {
          groupLanguage.value = actorLanguageTrait.value;
          groupLanguage.units = actorLanguageTrait.units;
          groupLanguage.unitsKey = actorLanguageTrait.unitsKey;
        }

        if (!isNil(actor.system.attributes.languages?.custom, '')) {
          dnd5e.utils
            .splitSemicolons(actor.system.attributes.languages.custom?.trim())
            .forEach((customLanguage: string) => {
              const entry = mapGetOrInsertComputed(
                languages,
                customLanguage,
                () => ({
                  label: customLanguage,
                  identifiers: new Map<string, GroupTraitBase<number>>(),
                })
              );

              entry?.identifiers.set(actor.uuid, { label: customLanguage });
            });
        }
      });
    }

    _prepareMemberSpeeds(
      actor: any,
      speeds: Map<string, MeasurableGroupTrait<number>>
    ) {
      let unitsKey = actor.system.attributes.movement.units;
      let unitsConfig = CONFIG.DND5E.movementUnits[unitsKey];
      let units = unitsConfig?.abbreviation ?? unitsKey;

      Object.entries<number | unknown>(
        actor.system.attributes.movement
      ).forEach(([key, speed]) => {
        const movementType = CONFIG.DND5E.movementTypes[key];
        if (typeof speed !== 'number' || speed <= 0 || !movementType) {
          return;
        }

        let actorSpeedTrait: GroupTraitBase<number> = {
          label: movementType.label,
          units: units,
          unitsKey: unitsKey,
          value: speed,
        };

        let groupSpeed = mapGetOrInsertComputed(speeds, key, () => ({
          identifiers: new Map<string, MeasurableGroupTrait<number>>(),
          ...actorSpeedTrait,
        }));

        groupSpeed.identifiers.set(actor.uuid, actorSpeedTrait);

        const actorSpeedUniversalValue =
          actorSpeedTrait.value !== undefined &&
          !isNil(actorSpeedTrait.unitsKey, '')
            ? dnd5e.utils.convertLength(
                actorSpeedTrait.value,
                actorSpeedTrait.unitsKey,
                'ft'
              )
            : undefined;

        const groupSpeedUniversalValue =
          groupSpeed.value !== undefined && !isNil(groupSpeed.unitsKey, '')
            ? dnd5e.utils.convertLength(
                groupSpeed.value,
                groupSpeed.unitsKey,
                'ft'
              )
            : undefined;

        if (
          actorSpeedUniversalValue &&
          actorSpeedUniversalValue > (groupSpeedUniversalValue ?? 0)
        ) {
          groupSpeed.value = actorSpeedTrait.value;
          groupSpeed.units = actorSpeedTrait.units;
          groupSpeed.unitsKey = actorSpeedTrait.unitsKey;
        }
      });
    }

    _prepareMemberSenses(
      actor: any,
      senses: Map<string, MeasurableGroupTrait<number>>
    ) {
      let unitsKey = actor.system.attributes.movement.units;
      let unitsConfig = CONFIG.DND5E.movementUnits[unitsKey];
      let units = unitsConfig?.abbreviation ?? unitsKey;

      Object.entries(actor.system.attributes.senses ?? {}).forEach(
        ([key, sense]) => {
          const label = CONFIG.DND5E.senses[key];
          if (typeof sense !== 'number' || sense === 0 || !label) {
            return;
          }

          let actorSenseTrait: GroupTraitBase<number> = {
            label: label,
            units: units,
            unitsKey: unitsKey,
            value: sense,
          };

          let groupSense = mapGetOrInsertComputed(senses, key, () => ({
            identifiers: new Map<string, MeasurableGroupTrait<number>>(),
            ...actorSenseTrait,
          }));

          groupSense.identifiers.set(actor.uuid, actorSenseTrait);

          const actorSenseUniversalValue =
            actorSenseTrait.value !== undefined &&
            !isNil(actorSenseTrait.unitsKey, '')
              ? dnd5e.utils.convertLength(
                  actorSenseTrait.value,
                  actorSenseTrait.unitsKey,
                  'ft'
                )
              : undefined;

          const groupSenseUniversalValue =
            groupSense.value !== undefined && !isNil(groupSense.unitsKey, '')
              ? dnd5e.utils.convertLength(
                  groupSense.value,
                  groupSense.unitsKey,
                  'ft'
                )
              : undefined;

          if (
            actorSenseUniversalValue &&
            actorSenseUniversalValue > (groupSenseUniversalValue ?? 0)
          ) {
            groupSense.value = actorSenseTrait.value;
            groupSense.units = actorSenseTrait.units;
            groupSense.unitsKey = actorSenseTrait.unitsKey;
          }
        }
      );

      if (!isNil(actor.system.attributes.senses?.special, '')) {
        dnd5e.utils
          .splitSemicolons(actor.system.attributes.senses.special?.trim())
          .forEach((specialSense: string) => {
            const entry = mapGetOrInsertComputed(senses, specialSense, () => ({
              label: specialSense,
              identifiers: new Map<string, GroupTraitBase<number>>(),
            }));

            entry?.identifiers.set(actor.uuid, { label: specialSense });
          });
      }
    }

    _prepareMemberTrait(
      trait: 'ci' | 'di' | 'dr' | 'dv',
      actor: Actor5e,
      map: Map<string, GroupTrait>
    ) {
      throw new Error('TODO: prepare traits');
    }

    /* -------------------------------------------- */
    /*  Drag and Drop                               */
    /* -------------------------------------------- */

    _onDragStart(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
    ): void {
      const memberId = event.currentTarget
        .closest('[data-tidy-draggable][data-member-id]')
        ?.getAttribute('data-member-id');

      if (!memberId) {
        super._onDragStart(event);
        return;
      }

      const actor = this.#findMemberActor(memberId);

      if (!actor) {
        return;
      }

      const dragData = actor.toDragData();
      dragData['groupId'] = this.actor.id;
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }

    async _onDropActiveEffect(
      ..._args: any[]
    ): Promise</*ActiveEffect*/ unknown | boolean> {
      // Tidy Multi-Actor Sheets do not support active effect drops.
      return false;
    }

    async _onDropActor(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data: Actor5e
    ): Promise<object | boolean | undefined> {
      if (!this.isEditable) {
        return false;
      }

      const cls = getDocumentClass(CONSTANTS.DOCUMENT_NAME_ACTOR);
      const sourceActor = await cls.fromDropData(data);
      if (!sourceActor) {
        return;
      }

      const dragEventData =
        foundry.applications.ux.TextEditor.getDragEventData(event);
      const groupId = dragEventData['groupId'];

      if (groupId !== this.actor.id) {
        return this.actor.system.addMember(sourceActor);
      }

      const dropTarget = event.target?.closest<HTMLElement>(
        '[data-tidy-draggable][data-member-id]'
      );
      const targetMemberId = dropTarget?.getAttribute('data-member-id');

      const targetMemberActor = this.#findMemberActor(targetMemberId);

      if (
        !dropTarget ||
        !targetMemberActor ||
        targetMemberId === sourceActor.id
      ) {
        return false;
      }

      return await this._onSortMember(sourceActor, targetMemberActor);
    }

    #findMemberActor(actorId: string | null | undefined): Actor5e | undefined {
      return this.actor.system.members.find(
        (m: MultiActor5eMember) => m.actor.id === actorId
      )?.actor;
    }

    async _onSortMember(sourceActor: Actor5e, targetActor: Actor5e) {
      const membersCollection: MultiActor5eMember[] =
        this.actor.system.toObject().members;
      const sourceIndex = membersCollection.findIndex(
        (m) => m.actor === sourceActor.id
      );
      const targetIndex = membersCollection.findIndex(
        (m) => m.actor === targetActor.id
      );

      const sortBefore = sourceIndex > targetIndex;

      if (sortBefore) {
        const sourceMember = membersCollection.splice(sourceIndex, 1)[0];
        membersCollection.splice(targetIndex, 0, sourceMember);
      } else {
        const sourceMember = membersCollection[sourceIndex];
        membersCollection.splice(targetIndex + 1, 0, sourceMember);
        membersCollection.splice(sourceIndex, 1);
      }

      return await this.actor.update({ 'system.members': membersCollection });
    }

    async _onDropFolder(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data: Record<string, any>
    ) {
      if (!this.isEditable) {
        return false;
      }

      const folder = await Folder.implementation.fromDropData(data);

      if (folder.type === CONSTANTS.DOCUMENT_NAME_ACTOR) {
        const results: any[] = [];
        for (let actor of folder.contents) {
          results.push(await this.actor.system.addMember(actor));
        }
        return results;
      }

      return await super._onDropFolder(event, data);
    }

    /** @inheritDoc */
    async _onDropItem(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      item: Item5e
    ) {
      const { uuid } =
        event.target.closest<HTMLElement>('[data-uuid]')?.dataset ?? {};
      const target = await fromUuid(uuid);
      if (target instanceof foundry.documents.Actor)
        return target.sheet._onDropCreateItems(event, [item]);
      return super._onDropItem(event, item);
    }

    /** @inheritDoc */
    async _onDropCreateItems(
      event: DragEvent,
      items: Item5e[],
      behavior?: DropEffectValue | null
    ) {
      let foundNonPhysical = false;
      items = items.filter((item) => {
        if (
          !item.system.constructor._schemaTemplates?.includes(
            dnd5e.dataModels.item.PhysicalItemTemplate
          )
        ) {
          foundNonPhysical = true;
          return false;
        }
        return true;
      });
      if (foundNonPhysical)
        ui.notifications.warn('DND5E.Group.Warning.PhysicalItemOnly', {
          localize: true,
        });
      return super._onDropCreateItems(event, items, behavior);
    }
  }

  return Tidy5eMultiActorSheetQuadroneBase;
}
