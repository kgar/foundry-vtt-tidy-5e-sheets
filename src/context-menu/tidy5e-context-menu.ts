import {
  actorUsesActionFeature,
  isItemInActionList,
  toggleActionFilterOverride,
} from 'src/features/actions/actions';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings';
import type { Item5e } from 'src/types/item';
import { warn } from 'src/utils/logging';

export function initTidy5eContextMenu(
  sheet: any,
  html: any,
  contextMenuSelector: string = '[data-context-menu]'
) {
  FoundryAdapter.createContextMenu(html, contextMenuSelector, [], {
    onOpen: onItemContext.bind(sheet),
  });
}
/**
 * Handle activation of a context menu for an embedded Item or ActiveEffect document.
 * Dynamically populate the array of context menu options.
 * @param {HTMLElement} element       The HTML element for which the context menu is activated
 * @protected
 */
function onItemContext(element: HTMLElement) {
  const contextMenuType = element.getAttribute('data-context-menu');
  const id = element.getAttribute('data-context-menu-entity-id');
  // TODO: rewrite context menu so that it's better integrated with the rest of Tidy 5e Sheets.
  // @ts-ignore
  const that: any = this as any;

  // Active Effects
  if (contextMenuType === CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS) {
    const effect = that.actor.effects.get(id);
    if (!effect) {
      return;
    }

    // TODO: Leverage the API to aggregate any registered context menu options; pass in the context of the current item for reference.
    ui.context.menuItems = getActiveEffectContextOptions(effect);
    Hooks.call("dnd5e.getActiveEffectContextOptions", effect, ui.context.menuItems);
  }
  // Items
  else if (contextMenuType === CONSTANTS.CONTEXT_MENU_TYPE_ITEMS) {
    const item = that.actor.items.get(id);
    if (!item) return;

    // TODO: Leverage the API to aggregate any registered context menu options; pass in the context of the current item for reference.
    ui.context.menuItems = getItemContextOptions(item);
    Hooks.call("dnd5e.getItemContextOptions", item, ui.context.menuItems);
  } else {
    warn(
      `Unable to show context menu. The menu type ${contextMenuType} is not supported. Put a [data-context-menu] attribute on the target entity and implement the handler where this warning appears.`
    );
  }
}

function getActiveEffectContextOptions(effect: any) {
  const actor = effect.actor ? effect.actor : effect.parent;
  if (!actor?.isOwner || !SettingsProvider.settings.useContextMenu.get()) {
    return [];
  }

  if (
    actor.type === CONSTANTS.SHEET_TYPE_CHARACTER &&
    !FoundryAdapter.allowCharacterEffectsManagement(actor)
  ) {
    return [];
  }

  let tidy5eKgarContextOptions = [
    {
      name: effect.disabled
        ? 'DND5E.ContextMenuActionEnable'
        : 'DND5E.ContextMenuActionDisable',
      icon: effect.disabled
        ? "<i class='fas fa-check fa-fw'></i>"
        : "<i class='fas fa-times fa-fw'></i>",
      callback: () => effect.update({ disabled: !effect.disabled }),
    },
    {
      name: 'DND5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      callback: () => effect.sheet.render(true),
    },
  ];

  if (canEditEffect(effect)) {
    tidy5eKgarContextOptions = tidy5eKgarContextOptions.concat([
      {
        name: 'DND5E.ContextMenuActionDuplicate',
        icon: "<i class='fas fa-copy fa-fw'></i>",
        callback: () =>
          effect.clone(
            {
              name: FoundryAdapter.localize('DOCUMENT.CopyOf', {
                name: effect.name,
              }),
            },
            { save: true }
          ),
      },
      {
        name: 'DND5E.ContextMenuActionDelete',
        icon: `<i class="fas fa-trash fa-fw t5ek-warning-color"></i>`,
        callback: () => effect.deleteDialog(),
      },
    ]);
  }

  return tidy5eKgarContextOptions;
}

function canEditEffect(effect: any) {
  const actor = effect.actor ? effect.actor : effect.parent;
  return FoundryAdapter.isActorSheetUnlocked(actor);
}

/**
 * Prepare an array of context menu options which are available for owned Item documents.
 * @param {Item5e} item                   The Item for which the context menu is activated
 * @returns {ContextMenuEntry[]}          An array of context menu options offered for the Item
 * @protected
 */
function getItemContextOptions(item: Item5e) {
  const actor = item.actor ? item.actor : item.parent;
  if (!actor?.isOwner || !SettingsProvider.settings.useContextMenu.get()) {
    return [];
  }

  let options = [];

  const isCharacter = actor.type === CONSTANTS.SHEET_TYPE_CHARACTER;

  let toggleTitle = '';
  let canToggle = false;
  let isActive = false;
  let canPrepare = false;

  if (item.type === 'spell') {
    const prep = item.system.preparation || {};
    const isAlways = prep.mode === CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS;
    const isPrepared = !!prep.prepared;
    isActive = isPrepared;
    if (isAlways) toggleTitle = CONFIG.DND5E.spellPreparationModes.always;
    else if (isPrepared)
      toggleTitle = CONFIG.DND5E.spellPreparationModes.prepared;
    else toggleTitle = FoundryAdapter.localize('DND5E.SpellUnprepared');

    canPrepare = item.system.level >= 1;
  } else {
    isActive = !!item.system.equipped;
    toggleTitle = FoundryAdapter.localize(
      isActive ? 'DND5E.Equipped' : 'DND5E.Unequipped'
    );
    canToggle = 'equipped' in item.system;

    canPrepare = item.system.level >= 1;
  }

  // Toggle Attunement State
  if (
    'attunement' in item.system &&
    item.system.attunement !== CONFIG.DND5E.attunementTypes.NONE
  ) {
    const isAttuned =
      item.system.attunement === CONFIG.DND5E.attunementTypes.ATTUNED;
    // options.push({
    //   name: isAttuned ? "DND5E.ContextMenuActionUnattune" : "DND5E.ContextMenuActionAttune",
    //   icon: "<i class='fas fa-sun fa-fw'></i>",
    //   callback: () => item.update({
    //     "system.attunement": CONFIG.DND5E.attunementTypes[isAttuned ? "REQUIRED" : "ATTUNED"]
    //   })
    // });
    options.push({
      name: isAttuned
        ? 'TIDY5E.ContextMenuActionUnattune'
        : 'TIDY5E.ContextMenuActionAttune',
      icon: isAttuned
        ? "<i class='fas fa-sun fa-fw' style='color: var(--t5ek-warning-accent-color);'></i>"
        : "<i class='fas fa-sun fa-fw'></i>",
      callback: () =>
        item.update({
          'system.attunement':
            CONFIG.DND5E.attunementTypes[isAttuned ? 'REQUIRED' : 'ATTUNED'],
        }),
    });
  }

  // Toggle Equipped State
  if ('equipped' in item.system) {
    // options.push({
    //   name: item.system.equipped ? "DND5E.ContextMenuActionUnequip" : "DND5E.ContextMenuActionEquip",
    //   icon: "<i class='fas fa-shield-alt fa-fw'></i>",
    //   callback: () => item.update({"system.equipped": !item.system.equipped})
    // });
    const isEquipped = item.system.equipped;
    options.push({
      name: isEquipped
        ? 'TIDY5E.ContextMenuActionUnequip'
        : 'TIDY5E.ContextMenuActionEquip',
      icon: isEquipped
        ? "<i class='fas fa-user-alt fa-fw' style='color: var(--t5ek-warning-accent-color);'></i> "
        : "<i class='fas fa-user-alt fa-fw'></i> ",
      callback: () => item.update({ 'system.equipped': !isEquipped }),
    });
  }

  // Toggle Prepared State
  if ('preparation' in item.system) {
    if (FoundryAdapter.canPrepareSpell(item)) {
      const isPrepared = item.system?.preparation?.prepared === true;
      options.push({
        name: isActive
          ? 'TIDY5E.ContextMenuActionUnprepare'
          : 'TIDY5E.ContextMenuActionPrepare',
        icon: isActive
          ? "<i class='fas fa-book fa-fw'></i>"
          : "<i class='fas fa-book fa-fw'></i>",
        callback: () =>
          item.update({ 'system.preparation.prepared': !isPrepared }),
      });
    }
  }

  if (isCharacter) {
    // Add favorites to context menu
    let isFav = FoundryAdapter.isDocumentFavorited(item);

    let favoriteIcon = 'fa-bookmark';

    options.push({
      name: isFav ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
      icon: isFav
        ? `<i class='fas ${favoriteIcon} fa-fw' style='color: var(--t5ek-warning-accent-color)'></i>`
        : `<i class='fas ${favoriteIcon} fa-fw inactive'></i>`,
      callback: () => {
        // const item_id = ev[0].dataset.itemId; //ev.currentTarget.closest('[data-item-id]').dataset.itemId;
        // const item = actor.items.get(item_id);
        if (!item) {
          warn(
            `tidy5e-context-menu | _getItemContextOptions | Item no founded!`
          );
          return;
        }
        FoundryAdapter.toggleFavorite(item);
      },
    });
  }

  if (item.type === 'spell') {
    options.push({
      name: 'TIDY5E.ContextMenuActionEdit',
      icon: "<i class='fas fa-pencil-alt fa-fw'></i>",
      callback: () => item.sheet.render(true),
    });
    if (FoundryAdapter.isActorSheetUnlocked(actor)) {
      options.push({
        name: 'DND5E.ContextMenuActionDuplicate',
        icon: "<i class='fas fa-copy fa-fw'></i>",
        condition: () =>
          !['race', 'background', 'class', 'subclass'].includes(item.type),
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
      options.push({
        name: 'TIDY5E.ContextMenuActionDelete',
        icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5ek-warning-accent-color);'></i>",
        callback: () => FoundryAdapter.onActorItemDelete(actor, item),
      });
    }
  } else {
    options.push({
      name: 'DND5E.ContextMenuActionEdit',
      icon: "<i class='fas fa-pencil-alt fa-fw'></i>",
      callback: () => item.sheet.render(true),
    });

    if (FoundryAdapter.isActorSheetUnlocked(actor)) {
      options.push({
        name: 'DND5E.ContextMenuActionDuplicate',
        icon: "<i class='fas fa-copy fa-fw'></i>",
        condition: () =>
          !['race', 'background', 'class', 'subclass'].includes(item.type),
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
      options.push({
        name: 'DND5E.ContextMenuActionDelete',
        icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5ek-warning-accent-color);'></i>",
        callback: () => FoundryAdapter.onActorItemDelete(actor, item),
      });
    }
  }

  if (actorUsesActionFeature(actor)) {
    const active = isItemInActionList(item);
    options.push({
      name: active
        ? 'TIDY5E.Actions.SetOverrideFalse'
        : 'TIDY5E.Actions.SetOverrideTrue',
      icon: active
        ? '<i class="fas fa-fist-raised" style="color: var(--t5ek-warning-accent-color)"></i>'
        : '<i class="fas fa-fist-raised"></i>',
      callback: () => {
        toggleActionFilterOverride(item);
      },
    });

    const overridden =
      FoundryAdapter.tryGetFlag(item, 'action-filter-override') !== undefined;
    if (overridden) {
      options.push({
        name: 'TIDY5E.Actions.ResetActionDefault',
        icon: '<i class="fas fa-fist-raised" style="color: var(--t5ek-warning-accent-color)"></i>',
        callback: () => {
          FoundryAdapter.unsetFlag(item, 'action-filter-override');
        },
      });
    }
  }
  return options;
}
