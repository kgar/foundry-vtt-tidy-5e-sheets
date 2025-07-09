import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings } from 'src/settings/settings.svelte';
import { warn } from 'src/utils/logging';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { getActiveEffectContextOptionsQuadrone } from './tidy5e-active-effect-context-menu-quadrone';

export function configureActiveEffectsContextMenu(
  element: HTMLElement,
  app: any
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

  const isQuadroneSheet = element.closest('.quadrone');

  ui.context.menuItems = isQuadroneSheet
    ? getActiveEffectContextOptionsQuadrone(effect, app)
    : getActiveEffectContextOptions(effect, app);
  TidyHooks.dnd5eGetActiveEffectContextOptions(effect, ui.context.menuItems);
}

export function getActiveEffectContextOptions(effect: any, app: any) {
  const effectParent = effect.parent;

  // Assumption: Either the effect belongs to the character or is transferred from an item.
  const actor = effectParent.actor ?? effectParent;

  if (!effectParent?.isOwner || !settings.value.useContextMenu) {
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

  let tidy5eKgarContextOptions: ContextMenuEntry[] = [
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
  return actor?.isOwner === true;
}
