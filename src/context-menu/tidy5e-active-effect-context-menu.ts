import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { warn } from 'src/utils/logging';

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

  ui.context.menuItems = getActiveEffectContextOptionsQuadrone(
    effect,
    app,
    element
  );
  TidyHooks.dnd5eGetActiveEffectContextOptions(effect, ui.context.menuItems);
}

function getActiveEffectContextOptionsQuadrone(
  effect: any,
  app: any,
  element: HTMLElement
) {
  const effectParent = effect.parent;

  // Assumption: Either the effect belongs to the character or is transferred from an item.
  const actor = effectParent.actor ?? effectParent;

  if (!effectParent?.isOwner) {
    return [];
  }

  const isConcentrationEffect = FoundryAdapter.isConcentrationEffect(
    effect,
    app
  );

  const isInFavorites = !!element.closest('.favorites');

  const isFav = FoundryAdapter.isEffectFavorited(effect, actor);

  let tidy5eKgarContextOptions: ContextMenuEntry[] = [
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
      name: 'DND5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      callback: () => effect.sheet.render(true),
      group: 'common',
    },
    {
      name: isFav ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
      icon: isFav
        ? `<i class='fa-regular fa-star fa-fw'></i>`
        : `<i class='fa-solid fa-star fa-fw inactive'></i>`,
      condition: () => 'favorites' in actor.system,
      callback: () => {
        if (!effect) {
          warn(`tidy5e-context-menu | Effect Not Found.`);
          return;
        }
        FoundryAdapter.toggleFavoriteEffect(effect);
      },
      group: 'common',
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
      condition: () => !isInFavorites && canEditEffect(effect),
      group: 'common',
    },
    {
      name: 'DND5E.ContextMenuActionDelete',
      icon: `<i class="fas fa-trash fa-fw" style='color: var(--t5e-warning-accent-color);'></i>`,
      callback: () => effect.deleteDialog(),
      condition: () =>
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
