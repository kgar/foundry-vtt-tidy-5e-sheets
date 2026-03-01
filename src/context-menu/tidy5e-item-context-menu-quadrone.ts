import { TidyFlags } from 'src/foundry/TidyFlags';
import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
import { CONSTANTS } from 'src/constants';
import { isItemInActionList } from 'src/features/actions/actions.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { ActorInspirationRuntime } from 'src/runtime/actor/ActorInspirationRuntime.svelte';
import { SettingsProvider } from 'src/settings/settings.svelte';
import type { Item5e } from 'src/types/item.types';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { isNil } from 'src/utils/data';
import type { ActionItemInclusionMode } from 'src/types/types';

/**
 * Prepare an array of context menu options which are available for owned Item documents.
 * @param {Item5e} item                   The Item for which the context menu is activated
 * @returns {ContextMenuEntry[]}          An array of context menu options offered for the Item
 * @returns                               Context menu options.
 */
export function getItemContextOptionsQuadrone(
  app: any,
  item: Item5e,
  element: HTMLElement
): ContextMenuEntry[] {
  const itemParent = item.actor ? item.actor : item.parent;
  const itemParentIsActor =
    itemParent?.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR;
  const isCharacter =
    itemParentIsActor && itemParent.type === CONSTANTS.SHEET_TYPE_CHARACTER;

  const isInFavorites = !!element.closest('.favorites');

  let options: ContextMenuEntry[] = [];

  // Common - these are standard options, or they're options that Tidy offers which interface with standard foundry behaviors.

  options.push({
    name: 'TIDY5E.ContextMenuActionView',
    icon: '<i class="fas fa-eye fa-fw"></i>',
    group: 'common',
    callback: () =>
      item.sheet.render(true, { mode: CONSTANTS.SHEET_MODE_PLAY }),
  });

  options.push({
    name: 'TIDY5E.ContextMenuActionEdit',
    icon: '<i class="fa-solid fa-pen-to-square fa-fw"></i>',
    condition: () => item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
    group: 'common',
    callback: () =>
      item.sheet.render(true, { mode: CONSTANTS.SHEET_MODE_EDIT }),
  });

  if (
    !!CONFIG.DND5E.attunementTypes[
      item.system.attunement as keyof typeof CONFIG.DND5E.attunementTypes
    ] &&
    !FoundryAdapter.concealDetails(item)
  ) {
    options.push({
      name: item.system.attuned
        ? 'TIDY5E.ContextMenuActionUnattune'
        : 'TIDY5E.ContextMenuActionAttune',
      icon: item.system.attuned
        ? "<i class='fa-regular fa-sun fa-fw'></i>"
        : "<i class='fa-solid fa-sun fa-fw'></i>",
      group: 'common',
      callback: () =>
        item.update({
          'system.attuned': !item.system.attuned,
        }),
      condition: () =>
        item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
    });
  }

  if ('equipped' in item.system) {
    const isEquipped = item.system.equipped;
    options.push({
      name: isEquipped
        ? 'TIDY5E.ContextMenuActionUnequip'
        : 'TIDY5E.ContextMenuActionEquip',
      icon: isEquipped
        ? "<i class='fa-regular fa-hand fa-fw'></i>"
        : "<i class='fa-solid fa-hand-fist equip-icon fa-fw'></i>",
      group: 'common',
      callback: () => item.update({ 'system.equipped': !isEquipped }),
      condition: () =>
        item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
    });
  }

  if (FoundryAdapter.canPrepareSpell(item) && !item.system.linkedActivity) {
    const isPrepared =
      item.system?.prepared ===
      CONFIG.DND5E.spellPreparationStates.prepared.value;

    const newValue = ((item.system?.prepared ?? 0) + 1) % 2;
    options.push({
      name: isPrepared
        ? 'TIDY5E.ContextMenuActionUnprepare'
        : 'TIDY5E.ContextMenuActionPrepare',
      icon: isPrepared
        ? "<i class='fas fa-book fa-fw'></i>"
        : "<i class='fas fa-book fa-fw'></i>",
      group: 'common',
      callback: () => item.update({ 'system.prepared': newValue }),
      condition: () =>
        item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
    });
  }

  options.push({
    name: !item.isOnCooldown
      ? 'DND5E.ContextMenuActionExpendCharge'
      : 'DND5E.ContextMenuActionCharge',
    icon: !item.isOnCooldown
      ? '<i class="fa-regular fa-bolt"></i>'
      : '<i class="fa-solid fa-bolt"></i>',
    condition: () =>
      item.hasRecharge &&
      item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'common',
    callback: () =>
      item.update({
        'system.uses.spent': !item.isOnCooldown ? item.system.uses.max : 0,
      }),
  });

  if (isCharacter) {
    // Add favorites to context menu
    let isFav = FoundryAdapter.isItemFavorited(item);

    options.push({
      name: isFav ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
      icon: isFav
        ? `<i class='fa-regular fa-star fa-fw'></i>`
        : `<i class='fa-solid fa-star fa-fw inactive'></i>`,
      group: 'common',
      callback: () => {
        FoundryAdapter.toggleFavoriteItem(item);
      },
      condition: () =>
        !!itemParent?.isOwner &&
        'favorites' in itemParent.system &&
        !FoundryAdapter.isLockedInCompendium(item),
    });
  }

  options.push({
    name: 'DND5E.DisplayCard',
    icon: '<i class="fas fa-message-arrow-up-right"></i>',
    group: 'common',
    callback: () => item.displayCard(),
  });

  options.push({
    name: 'DND5E.Scroll.CreateScroll',
    icon: '<i class="fa-solid fa-scroll"></i>',
    condition: () =>
      !isInFavorites &&
      item.type === 'spell' &&
      !item.system.linkedActivity &&
      itemParent?.isOwner &&
      !FoundryAdapter.isLockedInCompendium(itemParent),
    group: 'action',
    callback: async () => {
      const options: Record<string, unknown> = {};

      if (SettingsProvider.settings.includeFlagsInSpellScrollCreation.get()) {
        options.flags = item.flags;
      }

      const scroll = await dnd5e.documents.Item5e.createScrollFromSpell(
        item,
        options
      );
      if (scroll) {
        dnd5e.documents.Item5e.create(scroll, { parent: itemParent });
      }
    },
  });

  options.push({
    name: 'DOCUMENT.DND5E.Activity',
    icon: "<i class='fas fa-gear fa-fw'></i>",
    condition: () =>
      item.type === 'spell' &&
      !item.canDelete &&
      item.system.linkedActivity &&
      item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'common',
    callback: () => item.system.linkedActivity.sheet.render(true),
  });

  options.push({
    name: 'DND5E.Identify',
    icon: "<i class='fas fa-magnifying-glass fa-fw'></i>",
    callback: () => item.update({ 'system.identified': true }),
    condition: () =>
      item.system.identified === false &&
      FoundryAdapter.canIdentify(item) &&
      !FoundryAdapter.isLockedInCompendium(item),
  });

  options.push({
    name: 'DND5E.ContextMenuActionDuplicate',
    icon: "<i class='fas fa-clone fa-fw'></i>",
    condition: () =>
      !isInFavorites &&
      item.canDuplicate &&
      item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'common',
    callback: () =>
      item.clone(
        {
          name: FoundryAdapter.localize('DOCUMENT.CopyOf', {
            name: item.name,
          }),
        },
        { save: true }
      ),
  });

  // Customize - These are things Tidy provides above and beyond the system for greater customization of the sheet.

  const inclusionMode: ActionItemInclusionMode =
    itemParent?.sheet.getSheetTabInclusionMode?.();

  const inSheetTab = isItemInActionList(item, inclusionMode);
  options.push({
    name: inSheetTab
      ? 'TIDY5E.ContextMenuActionRemoveFromSheetTab'
      : 'TIDY5E.ContextMenuActionAddToSheetTab',
    icon: inSheetTab
      ? '<i class="fa-regular fa-bookmark"></i>'
      : '<i class="fa-solid fa-bookmark"></i>',
    condition: () =>
      item.type !== CONSTANTS.ITEM_TYPE_FACILITY &&
      itemParentIsActor &&
      !!itemParent?.isOwner &&
      isCharacter,
    group: 'customize',
    callback: () => {
      TidyFlags.actionFilterOverride.set(item, !isItemInActionList(item));
    },
  });

  if (itemParent) {
    const inspirationSourceItem = itemParent.items.get(
      TidyFlags.inspirationSource.get(itemParent)
    );

    const itemInspirationSourceAvailable =
      !ActorInspirationRuntime.bankedInspirationConfig?.change &&
      !ActorInspirationRuntime.bankedInspirationConfig?.getData;

    const bankedInspirationIsEnabled =
      SettingsProvider.settings.enableBankedInspiration.get() &&
      (!SettingsProvider.settings.bankedInspirationGmOnly.get() ||
        FoundryAdapter.userIsGm());

    options.push({
      name: 'TIDY5E.ContextMenuActionSetAsInspirationSource',
      icon: '<i class="fa-solid fa-sparkles"></i>',
      condition: () =>
        bankedInspirationIsEnabled &&
        item.isOwner &&
        itemInspirationSourceAvailable &&
        item.type === CONSTANTS.ITEM_TYPE_FEAT &&
        item.system.uses?.max > 0 &&
        inspirationSourceItem?.id !== item.id,
      group: 'customize',
      callback: () => TidyFlags.inspirationSource.set(itemParent, item.id),
    });

    options.push({
      name: 'TIDY5E.ContextMenuActionRemoveAsInspirationSource',
      icon: '<i class="fa-regular fa-sparkles"></i>',
      condition: () =>
        bankedInspirationIsEnabled &&
        item.isOwner &&
        itemInspirationSourceAvailable &&
        inspirationSourceItem?.id === item.id,
      group: 'customize',
      callback: () => TidyFlags.inspirationSource.unset(itemParent),
    });
  }

  options.push({
    name: 'TIDY5E.Section.SectionSelectorChooseSectionTooltip',
    icon: '<i class="fa fa-diagram-cells"></i>',
    condition: () =>
      item.isOwner &&
      SheetSections.itemSupportsCustomSections(item.type) &&
      app.currentTabId !== CONSTANTS.TAB_ACTOR_ACTIONS &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'customize',
    callback: () =>
      new SectionSelectorApplication({
        flag: TidyFlags.section.prop,
        sectionType: FoundryAdapter.localize('TIDY5E.Section.Label'),
        callingDocument: itemParent ?? item,
        document: item,
      }).render(true),
  });

  let actionSectionContextName =
    itemParent?.type === CONSTANTS.SHEET_TYPE_CHARACTER
      ? FoundryAdapter.localize(
          'TIDY5E.Section.SectionSelectorChooseTabSectionTooltip',
          { tabName: FoundryAdapter.localize('Sheet') }
        )
      : itemParent?.type === CONSTANTS.SHEET_TYPE_NPC
      ? FoundryAdapter.localize(
          'TIDY5E.Section.SectionSelectorChooseTabSectionTooltip',
          { tabName: FoundryAdapter.localize('TIDY5E.StatblockTabName') }
        )
      : 'TIDY5E.Section.SectionSelectorChooseActionSectionTooltip';

  let actionSectionConfigTitle =
    itemParent?.type === CONSTANTS.SHEET_TYPE_CHARACTER
      ? FoundryAdapter.localize('Sheet')
      : itemParent?.type === CONSTANTS.SHEET_TYPE_NPC
      ? FoundryAdapter.localize('TIDY5E.StatblockTabName')
      : FoundryAdapter.localize('TIDY5E.Section.ActionLabel');

  options.push({
    name: actionSectionContextName,
    icon: '<i class="fas fa-diagram-cells"></i>',
    condition: () =>
      item.isOwner &&
      SheetSections.itemSupportsCustomSections(item.type) &&
      app.currentTabId === CONSTANTS.TAB_ACTOR_ACTIONS &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'customize',
    callback: () =>
      new SectionSelectorApplication({
        flag: TidyFlags.actionSection.prop,
        sectionType: actionSectionConfigTitle,
        callingDocument: itemParent ?? item,
        document: item,
      }).render(true),
  });

  options.push({
    name: 'TIDY5E.ContextMenuActionPin',
    icon: `<i class="fa-solid fa-thumbtack"></i>`,
    callback: () => SheetPinsProvider.pin(item, 'item'),
    condition: () =>
      item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(item) &&
      SheetPinsProvider.isPinnable(item, 'item') &&
      !SheetPinsProvider.isPinned(item),
    group: 'customize',
  });

  options.push({
    name: 'TIDY5E.ContextMenuActionUnpin',
    icon: `<i class="fa-regular fa-thumbtack"></i>`,
    callback: () => SheetPinsProvider.unpin(item),
    condition: () =>
      item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(item) &&
      SheetPinsProvider.isPinnable(item, 'item') &&
      SheetPinsProvider.isPinned(item),
    group: 'customize',
  });

  const isAttributeItemPin = !!element.closest('[data-pin-id]');

  if (isAttributeItemPin) {
    options.push({
      name: 'TIDY5E.ContextMenuActionShowLimitedUses',
      icon: '<i class="fa-solid fa-fw"></i>',
      callback: () =>
        SheetPinsProvider.setItemResourceType(item, 'limited-uses'),
      condition: () =>
        item.isOwner &&
        !FoundryAdapter.isLockedInCompendium(item) &&
        !isNil(item.system.quantity) &&
        SheetPinsProvider.getResourceType(item) !== 'limited-uses',
      group: 'customize',
    });
    options.push({
      name: 'TIDY5E.ContextMenuActionShowQuantity',
      icon: '<i class="fa-solid fa-fw"></i>',
      callback: () => SheetPinsProvider.setItemResourceType(item, 'quantity'),
      condition: () =>
        item.isOwner &&
        !FoundryAdapter.isLockedInCompendium(item) &&
        !isNil(item.system.quantity) &&
        SheetPinsProvider.getResourceType(item) !== 'quantity',
      group: 'customize',
    });
  }

  // Be Careful - These are the no-going-back changes

  options.push({
    name: 'TIDY5E.ContextMenuActionDelete',
    icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5e-warning-accent-color);'></i>",
    condition: () =>
      !isInFavorites &&
      item.canDelete &&
      item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'be-careful',
    callback: () =>
      itemParent?.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR
        ? FoundryAdapter.onActorItemDelete(itemParent, item)
        : item.deleteDialog(),
  });

  return options;
}
