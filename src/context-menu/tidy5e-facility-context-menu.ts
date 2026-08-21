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

  // Either an actor or an embedded item (has actor prop) can summon this menu.
  const actor = app.document.actor ?? app.document;
  const item = actor?.items.get(facilityId);

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
        actor.isOwner && !FoundryAdapter.isLockedInCompendium(actor),
    },
    {
      name: FoundryAdapter.localize(
        'TIDY5E.Facilities.ContextMenuActionRemove',
        { facilityName },
      ),
      icon: "<i class='fas fas fa-trash t5e-warning-color fa-fw'></i>",
      callback: async () => {
        await app.deleteOccupant(item, prop, Number(index));
      },
      condition: () =>
        actor.isOwner && !FoundryAdapter.isLockedInCompendium(actor),
    },
  ];

  ui.context.menuItems = contextOptions;
  TidyHooks.dnd5eGetFacilityOccupantContextOptions(
    actor,
    item,
    occupantUuid,
    prop,
    index !== null ? Number(index) : null,
    ui.context.menuItems,
  );
}
