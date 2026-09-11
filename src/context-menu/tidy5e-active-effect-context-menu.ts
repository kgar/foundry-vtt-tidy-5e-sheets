import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { warn } from 'src/utils/logging';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';

export function configureActiveEffectsContextMenu(
  element: HTMLElement,
  app: any,
) {
  const effectId =
    element.closest('[data-effect-id]')?.getAttribute('data-effect-id') ?? '';
  const parentId =
    element.closest('[data-parent-id]')?.getAttribute('data-parent-id') ?? '';

  const effect = FoundryAdapter.getEffect({
    document: app.document,
    effectId: effectId,
    parentId: parentId,
  });

  if (!effect) {
    return;
  }

  ui.context.menuItems = getActiveEffectContextOptions(effect, app, element);
  TidyHooks.dnd5eGetActiveEffectContextOptions(effect, ui.context.menuItems);
}

export function getActiveEffectContextOptions(
  effect: any,
  app: any,
  element: HTMLElement,
) {
  const effectParent = effect.parent;

  // Assumption: Either the effect belongs to the character or is transferred from an item.
  const actor = effectParent.actor ?? effectParent;

  if (!effectParent?.isOwner) {
    return [];
  }

  const isConcentrationEffect = FoundryAdapter.isConcentrationEffect(
    effect,
    app,
  );

  const isInFavorites = !!element.closest('.favorites');

  const isFav = FoundryAdapter.isEffectFavorited(effect, actor);

  let tidy5eKgarContextOptions: ContextMenuEntry[] = [
    {
      label: 'TIDY5E.CONTEXTMENU.Action.ViewSourceItem',
      icon: '<i class="fas fa-eye fa-fw"></i>',
      group: 'common',
      onClick: () =>
        app._renderChild(effect.item.sheet, {
          mode: CONSTANTS.SHEET_MODE_PLAY,
        }),
      visible: () =>
        !!effect.item &&
        app.document.documentName !== CONSTANTS.DOCUMENT_NAME_ITEM,
    },
    {
      label: effect.disabled
        ? 'DND5E.ContextMenuActionEnable'
        : 'DND5E.ContextMenuActionDisable',
      icon: effect.disabled
        ? "<i class='fas fa-check fa-fw'></i>"
        : "<i class='fas fa-times fa-fw'></i>",
      onClick: () => effect.update({ disabled: !effect.disabled }),
      visible: () => effect.isOwner && !isConcentrationEffect,
      group: 'state',
    },
    {
      label: 'DND5E.CONCENTRATION.Action.Break',
      icon: '<dnd5e-icon src="systems/dnd5e/icons/svg/break-concentration.svg"></dnd5e-icon>',
      visible: () => isConcentrationEffect,
      onClick: () => app.document.endConcentration(effect),
      group: 'state',
    },
    {
      label: 'DND5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      onClick: () => app._renderChild(effect.sheet),
      group: 'common',
    },
    {
      // TODO: Could we move this to TIDY5E.COMMON.Action.AddNamed?
      label: isFav ? 'TIDY5E.ACTOR.Favorites.Action.Remove' : 'TIDY5E.ACTOR.Favorites.Action.Add',
      icon: isFav
        ? `<i class='fa-regular fa-star fa-fw'></i>`
        : `<i class='fa-solid fa-star fa-fw inactive'></i>`,
      visible: () => 'favorites' in actor.system,
      onClick: () => {
        if (!effect) {
          warn(`tidy5e-context-menu | Effect Not Found.`);
          return;
        }
        FoundryAdapter.toggleFavoriteEffect(effect);
      },
      group: 'common',
    },
    {
      label: 'DND5E.ContextMenuActionDuplicate',
      icon: "<i class='fas fa-copy fa-fw'></i>",
      onClick: () =>
        effect.clone(
          {
            name: FoundryAdapter.localize('DOCUMENT.CopyOf', {
              name: effect.name,
            }),
          },
          { save: true },
        ),
      visible: () => !isInFavorites && canEditEffect(effect),
      group: 'common',
    },
    {
      label: 'DND5E.ContextMenuActionDelete',
      icon: `<i class="fas fa-trash fa-fw" style='color: var(--t5e-warning-accent-color);'></i>`,
      onClick: () => effect.deleteDialog({ sheet: actor?.sheet }),
      visible: () =>
        !isInFavorites && canEditEffect(effect) && !isConcentrationEffect,
      group: 'be-careful',
    },
  ];

  return tidy5eKgarContextOptions;
}

function canEditEffect(effect: any) {
  const actor = effect.actor ? effect.actor : effect.parent;
  return actor?.isOwner === true;
}
