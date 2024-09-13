import {
  actorUsesActionFeature,
  isItemInActionList,
} from 'src/features/actions/actions';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings';
import type { Item5e } from 'src/types/item.types';
import { warn } from 'src/utils/logging';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { Actor5e } from 'src/types/types';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';

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
function onItemContext(this: any, element: HTMLElement) {
  const contextMenuType = element.getAttribute('data-context-menu');

  const app: any = this as any;

  // Active Effects
  if (contextMenuType === CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS) {
    const effectId = element.getAttribute('data-effect-id') ?? '';
    const parentId = element.getAttribute('data-parent-id') ?? '';

    const effect = FoundryAdapter.getEffect({
      document: app.document,
      effectId: effectId,
      parentId: parentId,
    });

    if (!effect) {
      return;
    }

    // TODO: Leverage the API to aggregate any registered context menu options; pass in the context of the current item for reference.
    ui.context.menuItems = getActiveEffectContextOptions(effect, app);
    TidyHooks.dnd5eGetActiveEffectContextOptions(effect, ui.context.menuItems);
  }
  // Items
  else if (contextMenuType === CONSTANTS.CONTEXT_MENU_TYPE_ITEMS) {
    const uuid = element.getAttribute('data-context-menu-document-uuid');
    const item = fromUuidSync(uuid);
    if (!item) return;

    ui.context.menuItems = getItemContextOptions(item);
    TidyHooks.dnd5eGetItemContextOptions(item, ui.context.menuItems);
  }
  // Group Members
  else if (contextMenuType === CONSTANTS.CONTEXT_MENU_TYPE_GROUP_MEMBER) {
    const actor = fromUuidSync(
      element.getAttribute('data-context-menu-document-uuid')
    );

    const group = fromUuidSync(
      element
        .closest('[data-document-uuid]')
        ?.getAttribute('data-document-uuid')
    );

    if (!actor || !group) return;

    ui.context.menuItems = getGroupMemberContextOptions(group, actor);
    TidyHooks.tidy5eSheetsGetGroupMemberContextOptions(
      group,
      actor,
      ui.context.menuItems
    );

    return;
  } else {
    warn(
      `Unable to show context menu. The menu type ${contextMenuType} is not supported. Put a [data-context-menu] attribute on the target entity and implement the handler where this warning appears.`
    );
  }
}

function getActiveEffectContextOptions(effect: any, app: any) {
  const effectParent = effect.parent;

  // Assumption: Either the effect belongs to the character or is transferred from an item.
  const actor = effectParent.actor ?? effectParent;

  if (
    !effectParent?.isOwner ||
    !SettingsProvider.settings.useContextMenu.get()
  ) {
    return [];
  }

  if (
    actor.type === CONSTANTS.SHEET_TYPE_CHARACTER &&
    !FoundryAdapter.allowCharacterEffectsManagement(actor)
  ) {
    return [];
  }

  const isConcentrationEffect = FoundryAdapter.isConcentrationEffect(
    effect,
    app
  );

  const isFav = FoundryAdapter.isEffectFavorited(effect, actor);
  const favoriteIcon = 'fa-bookmark';

  let tidy5eKgarContextOptions = [
    {
      name: 'DND5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      callback: () => effect.sheet.render(true),
    },
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
      condition: () => canEditEffect(effect),
    },
    {
      name: 'DND5E.ContextMenuActionDelete',
      icon: `<i class="fas fa-trash fa-fw t5e-warning-color"></i>`,
      callback: () => effect.deleteDialog(),
      condition: () => canEditEffect(effect) && !isConcentrationEffect,
    },
    {
      name: effect.disabled
        ? 'DND5E.ContextMenuActionEnable'
        : 'DND5E.ContextMenuActionDisable',
      icon: effect.disabled
        ? "<i class='fas fa-check fa-fw'></i>"
        : "<i class='fas fa-times fa-fw'></i>",
      callback: () => effect.update({ disabled: !effect.disabled }),
      condition: () => effect.isOwner && !isConcentrationEffect,
      group: 'state',
    },
    {
      name: 'DND5E.ConcentrationBreak',
      icon: '<dnd5e-icon src="systems/dnd5e/icons/svg/break-concentration.svg"></dnd5e-icon>',
      condition: () => isConcentrationEffect,
      callback: () => app.document.endConcentration(effect),
      group: 'state',
    },
    {
      name: isFav ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
      icon: isFav
        ? `<i class='fas ${favoriteIcon} fa-fw' style='color: var(--t5e-warning-accent-color)'></i>`
        : `<i class='fas ${favoriteIcon} fa-fw inactive'></i>`,
      condition: () => 'favorites' in actor.system,
      callback: () => {
        if (!effect) {
          warn(`tidy5e-context-menu | Effect Not Found.`);
          return;
        }
        FoundryAdapter.toggleFavoriteEffect(effect);
      },
      group: 'state',
    },
  ];

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
 * @returns                               Context menu options.
 */
function getItemContextOptions(item: Item5e) {
  if (!item?.isOwner || !SettingsProvider.settings.useContextMenu.get()) {
    return [];
  }

  const itemParent = item.actor ? item.actor : item.parent;
  const itemParentIsActor =
    itemParent?.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR;
  const isUnlocked =
    !itemParentIsActor || FoundryAdapter.isActorSheetUnlocked(itemParent);
  let options = [];

  let toggleTitle = '';
  let canToggle = false;
  let isActive = false;
  let canPrepare = false;

  if (item.type === 'spell') {
    const prep = item.system.preparation || {};
    const isAlways = prep.mode === CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS;
    const isPrepared = !!prep.prepared;
    isActive = isPrepared;
    if (isAlways) toggleTitle = CONFIG.DND5E.spellPreparationModes.always.label;
    else if (isPrepared)
      toggleTitle = CONFIG.DND5E.spellPreparationModes.prepared.label;
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
    });
  }

  // Toggle Charged State
  if (item.system.recharge?.value) {
    options.push({
      name: item.system.recharge.charged
        ? 'DND5E.ContextMenuActionExpendCharge'
        : 'DND5E.ContextMenuActionCharge',
      icon: '<i class="fa-solid fa-bolt"></i>',
      callback: () =>
        item.update({
          'system.recharge.charged': !item.system.recharge?.charged,
        }),
      condition: () => item.isOwner,
      group: 'state',
    });
  }

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

  if (item.system.identified === false && FoundryAdapter.canIdentify(item)) {
    options.push({
      name: 'DND5E.Identify',
      icon: "<i class='fas fa-magnifying-glass fa-fw'></i>",
      callback: () => item.update({ 'system.identified': true }),
    });
  }

  const isCharacter =
    itemParentIsActor && itemParent.type === CONSTANTS.SHEET_TYPE_CHARACTER;
  if (isCharacter) {
    // Add favorites to context menu
    let isFav = FoundryAdapter.isItemFavorited(item);

    const favoriteIcon = 'fa-bookmark';

    options.push({
      name: isFav ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
      icon: isFav
        ? `<i class='fas ${favoriteIcon} fa-fw' style='color: var(--t5e-warning-accent-color)'></i>`
        : `<i class='fas ${favoriteIcon} fa-fw inactive'></i>`,
      callback: () => {
        if (!item) {
          warn(`tidy5e-context-menu | Item Not Found`);
          return;
        }
        FoundryAdapter.toggleFavoriteItem(item);
      },
    });
  }

  if (item.type === 'spell') {
    options.push({
      name: 'TIDY5E.ContextMenuActionEdit',
      icon: "<i class='fas fa-pencil-alt fa-fw'></i>",
      callback: () => item.sheet.render(true),
    });
    if (isUnlocked) {
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
        icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5e-warning-accent-color);'></i>",
        callback: () => FoundryAdapter.onActorItemDelete(itemParent, item),
      });
    }
  } else {
    options.push({
      name: 'DND5E.ContextMenuActionEdit',
      icon: "<i class='fas fa-pencil-alt fa-fw'></i>",
      callback: () => item.sheet.render(true),
    });

    if (isUnlocked) {
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
        icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5e-warning-accent-color);'></i>",
        callback: () => {
          return itemParent
            ? FoundryAdapter.onActorItemDelete(itemParent, item)
            : item.deleteDialog();
        },
      });
    }
  }

  if (itemParentIsActor && actorUsesActionFeature(itemParent)) {
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
    });

    const overridden = TidyFlags.actionFilterOverride.get(item) !== undefined;
    if (overridden) {
      options.push({
        name: 'TIDY5E.Actions.ResetActionDefault',
        icon: '<i class="fas fa-fist-raised" style="color: var(--t5e-warning-accent-color)"></i>',
        callback: () => {
          TidyFlags.actionFilterOverride.unset(item);
        },
      });
    }
  }
  return options;
}

/**
 * Prepare an array of context menu options which are available for a member of a group.
 * @param group    The group for which the context menu is activated.
 * @param actor    The actor for whom the context menu is activate.
 * @returns        Context menu options.
 */
function getGroupMemberContextOptions(group: Actor5e, actor: Actor5e) {
  const unlocked = FoundryAdapter.isActorSheetUnlocked(group);

  let options: ContextMenuEntry[] = [
    {
      name: 'TIDY5E.Group.RemoveMemberFromGroup',
      icon: `<i class="fas fa-trash fa-fw t5e-warning-color"></i>`,
      callback: () => group.removeMember(actor.id),
      condition: () => unlocked,
    },
  ];

  return options;
}
