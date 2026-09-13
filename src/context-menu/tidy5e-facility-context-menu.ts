import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';

const OccupantLabelsByProp: Record<string, string> = {
  'system.hirelings': 'DND5E.FACILITY.FIELDS.hirelings.max.label',
  'system.defenders': 'DND5E.FACILITY.FIELDS.defenders.max.label',
  'system.trade.creatures': 'TIDY5E.Facilities.Creatures.Label',
};

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

  // Broken links render an icon in place of the occupant's image.
  const brokenLink = !!element
    .closest('[data-context-menu]')
    ?.querySelector('.broken-link-icon');

  const canModify = () =>
    actor.isOwner && !FoundryAdapter.isLockedInCompendium(actor);

  let contextOptions: ContextMenuEntry[] = [
    {
      name: 'TIDY5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      callback: async () => {
        const actor = await fromUuid(occupantUuid);
        app._openDocumentSheet(actor);
      },
      condition: () => !brokenLink && canModify(),
    },
    {
      // A broken link is replaced in place by the chosen actor.
      name: FoundryAdapter.localize('TIDY5E.AddSpecific', {
        name: FoundryAdapter.localize(
          OccupantLabelsByProp[prop] ?? 'DOCUMENT.Actor',
        ),
      }),
      icon: '<i class="fa-solid fa-book-atlas fa-fw"></i>',
      callback: async () => {
        await app.replaceOccupant(item, prop, Number(index));
      },
      condition: () => brokenLink && canModify(),
    },
    {
      name: brokenLink
        ? FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
            name: FoundryAdapter.localize('TIDY5E.BrokenLink'),
          })
        : FoundryAdapter.localize('TIDY5E.Facilities.ContextMenuActionRemove', {
            facilityName,
          }),
      icon: "<i class='fas fas fa-trash t5e-warning-color fa-fw'></i>",
      callback: async () => {
        await app.deleteOccupant(item, prop, Number(index));
      },
      condition: canModify,
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
