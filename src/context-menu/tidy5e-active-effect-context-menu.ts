import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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

  ui.context.menuItems = getActiveEffectContextOptionsQuadrone(
    effect,
    app,
    element
  );
  TidyHooks.dnd5eGetActiveEffectContextOptions(effect, ui.context.menuItems);
}
