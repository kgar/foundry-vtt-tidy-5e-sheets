import { CONSTANTS } from 'src/constants';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { getItemContextOptionsQuadrone } from './tidy5e-item-context-menu-quadrone';

export function configureItemContextMenu(element: HTMLElement, app: any) {
  const id = element.closest('[data-item-id]')?.getAttribute('data-item-id');

  let item =
    app.document.type === CONSTANTS.ITEM_TYPE_CONTAINER
      ? app.document.system.getContainedItem(id)
      : app.document.items.get(id);

  // Parts of ContextMenu doesn't play well with promises, so don't show menus for containers in packs
  if (!item || item instanceof Promise) return;

  ui.context.menuItems = getItemContextOptionsQuadrone(app, item, element);

  TidyHooks.dnd5eGetItemContextOptions(item, ui.context.menuItems);
}
