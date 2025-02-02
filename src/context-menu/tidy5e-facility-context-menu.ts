import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';

export function configureFacilityContextMenu(
  element: HTMLElement,
  app: any
) {
  const occupantUuid = element.getAttribute('data-actor-uuid');
  const index = element.getAttribute('data-index');
  const facilityId = element.getAttribute('data-facility-id');
  const facilityName = element.getAttribute('data-facility-name');
  const prop = element.getAttribute('data-prop');

  let contextOptions: ContextMenuEntry[] = [
    {
      name: 'TIDY5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      callback: async () => {
        const actor = await fromUuid(occupantUuid);
        actor?.sheet.render(true);
      },
      condition: () => app.actor.isOwner && !app.actor.compendium?.locked,
    },
    {
      name: FoundryAdapter.localize(
        'TIDY5E.Facilities.ContextMenuActionRemove',
        { facilityName }
      ),
      icon: "<i class='fas fas fa-trash t5e-warning-color fa-fw'></i>",
      callback: async () => {
        await app.actor.sheet.deleteOccupant(facilityId, prop, Number(index));
      },
      condition: () => app.actor.isOwner && !app.actor.compendium?.locked,
    },
  ];

  ui.context.menuItems = contextOptions;
  TidyHooks.dnd5eGetFacilityOccupantContextOptions(
    app.document,
    app.document.items.get(facilityId),
    occupantUuid,
    prop,
    index !== null ? Number(index) : null,
    ui.context.menuItems
  );
}
