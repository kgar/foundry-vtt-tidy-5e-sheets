import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';

export function configureFacilityContextMenu(element: HTMLElement, app: any) {
  const occupantUuid =
    element.closest<HTMLElement>('[data-actor-uuid]')?.dataset.actorUuid;
  const index = element.closest<HTMLElement>('[data-index]')?.dataset.index;
  const facilityId =
    element.closest<HTMLElement>('[data-facility-id]')?.dataset.facilityId;
  const facilityName = element.closest<HTMLElement>('[data-facility-name]')
    ?.dataset.facilityName;
  const prop = element.closest<HTMLElement>('[data-prop]')?.dataset.prop;

  if (!prop || !occupantUuid) {
    return;
  }

  let contextOptions: ContextMenuEntry[] = [
    {
      name: 'TIDY5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      callback: async () => {
        const actor = await fromUuid(occupantUuid);
        app._openDocumentSheet(actor);
      },
      condition: () =>
        app.actor.isOwner && !FoundryAdapter.isLockedInCompendium(app.actor),
    },
    {
      name: FoundryAdapter.localize(
        'TIDY5E.Facilities.ContextMenuActionRemove',
        { facilityName },
      ),
      icon: "<i class='fas fas fa-trash t5e-warning-color fa-fw'></i>",
      callback: async () => {
        await app.actor.sheet.deleteOccupant(facilityId, prop, Number(index));
      },
      condition: () =>
        app.actor.isOwner && !FoundryAdapter.isLockedInCompendium(app.actor),
    },
  ];

  ui.context.menuItems = contextOptions;
  TidyHooks.dnd5eGetFacilityOccupantContextOptions(
    app.document,
    app.document.items.get(facilityId),
    occupantUuid,
    prop,
    index !== null ? Number(index) : null,
    ui.context.menuItems,
  );
}
