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

  // Active Effects
  if (contextMenuType === CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS) {
    const effect = this.actor.effects.get(id);
    if (!effect) {
      return;
    }

    // TODO: Leverage the API to aggregate any registered context menu options; pass in the context of the current item for reference.
    ui.context.menuItems = getActiveEffectContextOptions(effect);
  }
  // Items
  else if (contextMenuType === CONSTANTS.CONTEXT_MENU_TYPE_ITEMS) {
    const item = this.actor.items.get(id);
    if (!item) return;

    // TODO: Leverage the API to aggregate any registered context menu options; pass in the context of the current item for reference.
    ui.context.menuItems = getItemContextOptions(item);
  } else {
    warn(
      `Unable to show context menu. The menu type ${contextMenuType} is not supported. Put a [data-context-menu] attribute on the target entity and implement the handler where this warning appears.`
    );
  }
}

function getActiveEffectContextOptions(effect: any) {
  const actor = effect.actor ? effect.actor : effect.parent;
  if (!actor?.isOwner || SettingsProvider.settings.rightClickDisabled.get()) {
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
              label: game.i18n.format('DOCUMENT.CopyOf', {
                name: effect.label,
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
  return FoundryAdapter.canEditActor(actor);
}

/**
 * Prepare an array of context menu options which are available for owned Item documents.
 * @param {Item5e} item                   The Item for which the context menu is activated
 * @returns {ContextMenuEntry[]}          An array of context menu options offered for the Item
 * @protected
 */
function getItemContextOptions(item: Item5e) {
  const actor = item.actor ? item.actor : item.parent;
  if (!actor || SettingsProvider.settings.rightClickDisabled.get()) {
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
    else toggleTitle = game.i18n.localize('DND5E.SpellUnprepared');

    canPrepare = item.system.level >= 1;
  } else {
    isActive = !!item.system.equipped;
    toggleTitle = game.i18n.localize(
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
      name: isAttuned ? 'T5EK.Deattune' : 'T5EK.Attune',
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
      name: isEquipped ? 'T5EK.Unequip' : 'T5EK.Equip',
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
        name: isActive ? 'T5EK.Unprepare' : 'T5EK.Prepare',
        icon: isActive
          ? "<i class='fas fa-book fa-fw'></i>"
          : "<i class='fas fa-book fa-fw'></i>",
        callback: () =>
          item.update({ 'system.preparation.prepared': !isPrepared }),
      });
    }
  }

  // TODO SUPPORT FAVORITE ON NPC ?
  if (isCharacter) {
    // Add favorites to context menu
    let isFav = FoundryAdapter.isItemFavorite(item);

    let favoriteIcon = 'fa-bookmark';

    options.push({
      name: isFav ? 'T5EK.RemoveFav' : 'T5EK.AddFav',
      icon: isFav
        ? `<i class='fas ${favoriteIcon} fa-fw'></i>`
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
        let isFav = FoundryAdapter.isItemFavorite(item);

        item.update({
          [`flags.${CONSTANTS.MODULE_ID}.favorite`]: !isFav,
        });
        // Sync favorite flag with module 'favorite-items'
        if (game.modules.get('favorite-items')?.active) {
          item.update({
            'flags.favorite-items.favorite': !isFav,
          });
        }
      },
    });
  }
  /*
 // Standard Options
 const options = [
   {
     name: "DND5E.ContextMenuActionEdit",
     icon: "<i class='fas fa-edit fa-fw'></i>",
     callback: () => item.sheet.render(true)
   },
   {
     name: "DND5E.ContextMenuActionDuplicate",
     icon: "<i class='fas fa-copy fa-fw'></i>",
     condition: () => !["race", "background", "class", "subclass"].includes(item.type),
     callback: () => item.clone({name: game.i18n.format("DOCUMENT.CopyOf", {name: item.name})}, {save: true})
   },
   {
     name: "DND5E.ContextMenuActionDelete",
     icon: "<i class='fas fa-trash fa-fw'></i>",
     callback: () => item.deleteDialog()
   }
 ]
 */

  if (item.type === 'spell') {
    options.push({
      name: 'T5EK.EditSpell',
      icon: "<i class='fas fa-pencil-alt fa-fw'></i>",
      callback: () => item.sheet.render(true),
    });
    if (FoundryAdapter.canEditActor(actor)) {
      options.push({
        name: 'DND5E.ContextMenuActionDuplicate',
        icon: "<i class='fas fa-copy fa-fw'></i>",
        condition: () =>
          !['race', 'background', 'class', 'subclass'].includes(item.type),
        callback: () =>
          item.clone(
            { name: game.i18n.format('DOCUMENT.CopyOf', { name: item.name }) },
            { save: true }
          ),
      });
      options.push({
        name: 'T5EK.DeleteSpell',
        icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5ek-warning-accent-color);'></i>",
        callback: () => item.deleteDialog(),
      });
    }
  } else {
    options.push({
      name: 'DND5E.ContextMenuActionEdit',
      icon: "<i class='fas fa-pencil-alt fa-fw'></i>",
      callback: () => item.sheet.render(true),
    });

    if (FoundryAdapter.canEditActor(actor)) {
      options.push({
        name: 'DND5E.ContextMenuActionDuplicate',
        icon: "<i class='fas fa-copy fa-fw'></i>",
        condition: () =>
          !['race', 'background', 'class', 'subclass'].includes(item.type),
        callback: () =>
          item.clone(
            { name: game.i18n.format('DOCUMENT.CopyOf', { name: item.name }) },
            { save: true }
          ),
      });
      options.push({
        name: 'DND5E.ContextMenuActionDelete',
        icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5ek-warning-accent-color);'></i>",
        callback: () => item.deleteDialog(),
      });
    }
  }
  return options;
}
