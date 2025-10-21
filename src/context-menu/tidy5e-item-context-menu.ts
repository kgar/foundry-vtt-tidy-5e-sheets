import {
  actorUsesActionFeature,
  isItemInActionList,
} from 'src/features/actions/actions.svelte';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings } from 'src/settings/settings.svelte';
import type { Item5e } from 'src/types/item.types';
import { warn } from 'src/utils/logging';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { AttributePins } from 'src/features/attribute-pins/AttributePins';
import { isNil } from 'src/utils/data';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { getItemContextOptionsQuadrone } from './tidy5e-item-context-menu-quadrone';

export function configureItemContextMenu(element: HTMLElement, app: any) {
  const id = element.closest('[data-item-id]')?.getAttribute('data-item-id');

  let item =
    app.document.type === CONSTANTS.ITEM_TYPE_CONTAINER
      ? app.document.system.getContainedItem(id)
      : app.document.items.get(id);

  // Parts of ContextMenu doesn't play well with promises, so don't show menus for containers in packs
  if (!item || item instanceof Promise) return;

  const isQuadroneSheet = element.closest('.quadrone');

  ui.context.menuItems = isQuadroneSheet
    ? getItemContextOptionsQuadrone(app, item, element)
    : getItemContextOptions(app, item, element);

  TidyHooks.dnd5eGetItemContextOptions(item, ui.context.menuItems);
}

/**
 * Prepare an array of context menu options which are available for owned Item documents.
 * @param {Item5e} item                   The Item for which the context menu is activated
 * @returns {ContextMenuEntry[]}          An array of context menu options offered for the Item
 * @returns                               Context menu options.
 */
export function getItemContextOptions(
  app: any,
  item: Item5e,
  element: HTMLElement
): ContextMenuEntry[] {
  if (!settings.value.useContextMenu) {
    return [];
  }

  const itemParent = item.actor ? item.actor : item.parent;
  const itemParentIsActor =
    itemParent?.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR;

  let options: ContextMenuEntry[] = [];

  // Toggle Attunement State
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
        ? "<i class='fas fa-sun fa-fw' style='color: var(--t5e-warning-accent-color);'></i>"
        : "<i class='fas fa-sun fa-fw'></i>",
      callback: () =>
        item.update({
          'system.attuned': !item.system.attuned,
        }),
      condition: () =>
        item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
    });
  }

  // Toggle Charged State

  options.push({
    name: !item.isOnCooldown
      ? 'DND5E.ContextMenuActionExpendCharge'
      : 'DND5E.ContextMenuActionCharge',
    icon: !item.isOnCooldown
      ? '<i class="fa-regular fa-bolt"></i>'
      : '<i class="fa-solid fa-bolt"></i>',
    callback: () =>
      item.update({
        'system.uses.spent': !item.isOnCooldown ? item.system.uses.max : 0,
      }),
    condition: () =>
      item.hasRecharge &&
      item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'state',
  });

  /* 
  // TODO: New equip icons. Right now the sheet doesn't check for quadrone.
        ? "<i class='fas fa-hand-fist equip-icon fa-fw' style='color: var(--t5e-warning-accent-color);'></i> "
        : "<i class='fa-regular fa-hand fa-fw'></i> ",
  */

  // Toggle Equipped State
  if ('equipped' in item.system) {
    const isEquipped = item.system.equipped;
    options.push({
      name: isEquipped
        ? 'TIDY5E.ContextMenuActionUnequip'
        : 'TIDY5E.ContextMenuActionEquip',
      icon: isEquipped
        ? "<i class='fas fa-user-alt fa-fw' style='color: var(--t5e-warning-accent-color);'></i> "
        : "<i class='fas fa-user-alt fa-fw'></i> ",
      callback: () => item.update({ 'system.equipped': !isEquipped }),
      condition: () =>
        item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
    });
  }

  // Toggle Prepared State
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
      callback: () => item.update({ 'system.prepared': newValue }),
      condition: () =>
        item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
    });
  }

  options.push({
    name: 'DND5E.Identify',
    icon: "<i class='fas fa-magnifying-glass fa-fw'></i>",
    callback: () => item.update({ 'system.identified': true }),
    condition: () =>
      item.system.identified === false &&
      FoundryAdapter.canIdentify(item) &&
      !FoundryAdapter.isLockedInCompendium(item),
  });

  const isCharacter =
    itemParentIsActor && itemParent.type === CONSTANTS.SHEET_TYPE_CHARACTER;
  if (isCharacter) {
    // Add favorites to context menu
    let isFav = FoundryAdapter.isItemFavorited(item);

    options.push({
      name: isFav ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
      icon: isFav
        ? `<i class='fas fa-bookmark fa-fw' style='color: var(--t5e-warning-accent-color)'></i>`
        : `<i class='fas fa-bookmark fa-fw inactive'></i>`,
      callback: () => {
        if (!item) {
          warn(`tidy5e-context-menu | Item Not Found`);
          return;
        }
        FoundryAdapter.toggleFavoriteItem(item);
      },
      condition: () =>
        !!itemParent &&
        'favorites' in itemParent.system &&
        !FoundryAdapter.isLockedInCompendium(item),
    });

    options.push({
      name: 'TIDY5E.ContextMenuActionPinToAttributes',
      icon: `<i class="fa-solid fa-thumbtack"></i>`,
      callback: () => AttributePins.pin(item, 'item'),
      condition: () =>
        item.isOwner &&
        !FoundryAdapter.isLockedInCompendium(item) &&
        AttributePins.isPinnable(item, 'item') &&
        !AttributePins.isPinned(item),
      group: 'pins',
    });

    options.push({
      name: 'TIDY5E.ContextMenuActionUnpinFromAttributes',
      icon: `<i class="fa-solid fa-xmark" style='color: var(--t5e-warning-accent-color)'></i>`,
      callback: () => AttributePins.unpin(item),
      condition: () =>
        item.isOwner &&
        !FoundryAdapter.isLockedInCompendium(item) &&
        AttributePins.isPinnable(item, 'item') &&
        AttributePins.isPinned(item),
      group: 'pins',
    });

    const isAttributeItemPin = !!element.closest('[data-pin-id]');

    if (isAttributeItemPin) {
      options.push({
        name: 'TIDY5E.ContextMenuActionShowLimitedUses',
        icon: '<i class="fa-solid fa-fw"></i>',
        callback: () => AttributePins.setItemResourceType(item, 'limited-uses'),
        condition: () =>
          item.isOwner &&
          !FoundryAdapter.isLockedInCompendium(item) &&
          !isNil(item.system.quantity) &&
          AttributePins.getResourceType(item) !== 'limited-uses',
        group: 'pins',
      });
      options.push({
        name: 'TIDY5E.ContextMenuActionShowQuantity',
        icon: '<i class="fa-solid fa-fw"></i>',
        callback: () => AttributePins.setItemResourceType(item, 'quantity'),
        condition: () =>
          item.isOwner &&
          !FoundryAdapter.isLockedInCompendium(item) &&
          !isNil(item.system.quantity) &&
          AttributePins.getResourceType(item) !== 'quantity',
        group: 'pins',
      });
    }
  }

  options.push({
    name: 'TIDY5E.ContextMenuActionView',
    icon: '<i class="fas fa-eye fa-fw"></i>',
    callback: () =>
      item.sheet.render(true, { mode: CONSTANTS.SHEET_MODE_PLAY }),
  });

  options.push({
    name: 'TIDY5E.ContextMenuActionEdit',
    icon: '<i class="fas fa-pencil-alt fa-fw"></i>',
    callback: () =>
      item.sheet.render(true, { mode: CONSTANTS.SHEET_MODE_EDIT }),
    condition: () => item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
  });

  options.push({
    name: 'DND5E.ContextMenuActionDuplicate',
    icon: "<i class='fas fa-copy fa-fw'></i>",
    condition: () =>
      item.canDuplicate &&
      item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(item),

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

  if (item.type === 'spell') {
    options.push({
      name: 'TIDY5E.ContextMenuActionDelete',
      icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5e-warning-accent-color);'></i>",
      callback: () => FoundryAdapter.onActorItemDelete(itemParent, item),
      condition: () =>
        item.canDelete &&
        item.isOwner &&
        !FoundryAdapter.isLockedInCompendium(item),
    });
    options.push({
      name: 'DOCUMENT.DND5E.Activity',
      icon: "<i class='fas fa-gear fa-fw'></i>",
      callback: () => item.system.linkedActivity.sheet.render(true),
      condition: () =>
        !item.canDelete &&
        item.system.linkedActivity &&
        item.isOwner &&
        !FoundryAdapter.isLockedInCompendium(item),
    });
  } else {
    options.push({
      name: 'DND5E.ContextMenuActionDelete',
      icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5e-warning-accent-color);'></i>",
      callback: () => {
        return itemParent
          ? FoundryAdapter.onActorItemDelete(itemParent, item)
          : item.deleteDialog();
      },
      condition: () =>
        item.isOwner && !FoundryAdapter.isLockedInCompendium(item),
    });
  }

  options.push({
    name: 'DND5E.Scroll.CreateScroll',
    icon: '<i class="fa-solid fa-scroll"></i>',
    callback: async () => {
      const options: Record<string, unknown> = {};

      if (settings.value.includeFlagsInSpellScrollCreation) {
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
    condition: () =>
      item.type === 'spell' &&
      !item.system.linkedActivity &&
      itemParent?.isOwner &&
      !FoundryAdapter.isLockedInCompendium(itemParent),
    group: 'action',
  });

  const active = isItemInActionList(item);

  options.push({
    name: active
      ? 'TIDY5E.Actions.SetOverrideFalse'
      : 'TIDY5E.Actions.SetOverrideTrue',
    icon: active
      ? '<i class="fas fa-fist-raised" style="color: var(--t5e-warning-accent-color)"></i>'
      : '<i class="fas fa-fist-raised"></i>',
    callback: () => {
      TidyFlags.actionFilterOverride.set(item, !isItemInActionList(item));
    },
    condition: () =>
      item.type !== CONSTANTS.ITEM_TYPE_FACILITY &&
      itemParentIsActor &&
      actorUsesActionFeature(itemParent),
  });

  options.push({
    name: 'TIDY5E.Actions.ResetActionDefault',
    icon: '<i class="fas fa-fist-raised" style="color: var(--t5e-warning-accent-color)"></i>',
    callback: () => {
      TidyFlags.actionFilterOverride.unset(item);
    },
    condition: () =>
      TidyFlags.actionFilterOverride.get(item) !== undefined &&
      itemParentIsActor &&
      actorUsesActionFeature(itemParent),
  });

  options.push({
    name: 'TIDY5E.Section.SectionSelectorChooseSectionTooltip',
    icon: '<i class="fas fa-diagram-cells"></i>',
    callback: () =>
      new SectionSelectorApplication({
        flag: TidyFlags.section.prop,
        sectionType: FoundryAdapter.localize('TIDY5E.Section.Label'),
        callingDocument: itemParent ?? item,
        document: item,
      }).render(true),
    condition: () =>
      item.isOwner &&
      SheetSections.itemSupportsCustomSections(item.type) &&
      app.currentTabId !== CONSTANTS.TAB_ACTOR_ACTIONS &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'sections',
  });

  options.push({
    name: 'TIDY5E.Section.SectionSelectorChooseActionSectionTooltip',
    icon: '<i class="fas fa-diagram-cells"></i>',
    callback: () =>
      new SectionSelectorApplication({
        flag: TidyFlags.actionSection.prop,
        sectionType: FoundryAdapter.localize('TIDY5E.Section.ActionLabel'),
        callingDocument: itemParent ?? item,
        document: item,
      }).render(true),
    condition: () =>
      item.isOwner &&
      SheetSections.itemSupportsCustomSections(item.type) &&
      app.currentTabId === CONSTANTS.TAB_ACTOR_ACTIONS &&
      !FoundryAdapter.isLockedInCompendium(item),
    group: 'sections',
  });

  options.push({
    name: 'DND5E.DisplayCard',
    icon: '<i class="fas fa-message-arrow-up-right"></i>',
    callback: () => item.displayCard(),
  });

  return options;
}
