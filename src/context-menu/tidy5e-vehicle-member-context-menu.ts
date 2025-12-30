import { TidyHooks } from 'src/api';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry, CrewArea5e } from 'src/foundry/foundry.types';
import type { Tidy5eVehicleSheetQuadrone } from 'src/sheets/quadrone/Tidy5eVehicleSheetQuadrone.svelte';

export function configureVehicleMemberContextMenu(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone
) {
  ui.context.menuItems = getVehicleMemberContextOptionsQuadrone(element, app);

  TidyHooks.tidy5eSheetsGetVehicleMemberContextOptions(
    app.document,
    element,
    getMemberUuid(element),
    getVehicleItemId(element),
    getCrewArea(element),
    ui.context.menuItems
  );
}

/**
 * Prepare an array of context menu options which are available for a member of a group.
 * @param group    The group for which the context menu is activated.
 * @param actor    The actor for whom the context menu is activate.
 * @returns        Context menu options.
 */
function getVehicleMemberContextOptionsQuadrone(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone
) {
  const vehicleItemId = getVehicleItemId(element);

  const area = getCrewArea(element);

  let options: ContextMenuEntry[] = vehicleItemId
    ? getVehicleItemMemberOptions(element, app, vehicleItemId)
    : area === 'crew'
    ? getCrewMemberOptions(element, app)
    : area === 'draft'
    ? getDraftMemberOptions(element, app)
    : [];

  return options;
}

function getCrewArea(element: HTMLElement) {
  return element.closest('[data-area]')?.getAttribute('data-area') as CrewArea5e |
    undefined;
}

function getVehicleItemId(element: HTMLElement) {
  return element.closest('[data-item-id]')?.getAttribute('data-item-id') as
    | string
    | undefined;
}

function getVehicleItemMemberOptions(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone,
  vehicleItemId: string
): ContextMenuEntry[] {
  const brokenLink = !!element.closest('.broken');
  const empty = !!element.closest('.empty');
  const memberUuid = element
    .closest('[data-member-uuid]')
    ?.getAttribute('data-member-uuid');

  const item = app.document.items.get(vehicleItemId);

  if (!item) {
    return [];
  }

  return [
    {
      name: 'TIDY5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      callback: async () => {
        const actor = await fromUuid(memberUuid);
        actor?.sheet.render(true);
      },
      condition: () =>
        !empty &&
        !brokenLink &&
        app.actor.isOwner &&
        !FoundryAdapter.isLockedInCompendium(app.actor),
    },
    {
      name: FoundryAdapter.localize('TIDY5E.ContextMenuActionUnassign'),
      condition: () => !!memberUuid,
      icon: '<i class="fa-solid fa-trash"></i>',
      callback: async () => {
        const actor = await fromUuid(memberUuid);

        if (item) {
          await app._unassignCrew(actor, item);
        }
      },
    },
    {
      name: FoundryAdapter.localize('TIDY5E.AddSpecific', {
        name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Label'),
      }),
      condition: () => empty,
      icon: '<i class="fa-solid fa-book-open-reader"></i>',
      callback: () => app.browseAssignActor(item),
    },
  ];
}

function getDraftMemberOptions(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone
): ContextMenuEntry[] {
  const canChange = canChangeDocument(app);

  const memberUuid = getMemberUuid(element);

  return [
    {
      name: 'TIDY5E.ContextMenuActionRemoveDraftAnimal',
      icon: '<i class="fa-solid fa-trash"></i>',
      condition: () => canChange,
      callback: async () => {
        if (memberUuid) {
          await app.removeDraftAnimal(memberUuid);
        }
      },
    },
  ];
}

function getCrewMemberOptions(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone
): ContextMenuEntry[] {
  const memberUuid = getMemberUuid(element);

  const assigned = !!element.closest(
    '[data-area="crew"][data-tidy-section-key="assigned"]'
  );

  const unassigned = !!element.closest(
    '[data-area="crew"][data-tidy-section-key="unassigned"]'
  );

  const assignableItems = app.getAssignableItems();

  const currentlyAssignedItemId = assigned
    ? element
        .closest('[data-assigned-item-id]')
        ?.getAttribute('data-assigned-item-id')
    : undefined;

  const area = element.closest('[data-area]')?.getAttribute('data-area') as
    | CrewArea5e
    | undefined;

  const canChange = canChangeDocument(app);

  const assignableItemOptions: ContextMenuEntry[] = Object.values(
    assignableItems
  )
    .filter(
      (mountableItem) =>
        mountableItem.id !== currentlyAssignedItemId &&
        mountableItem.crew.value < mountableItem.crew.max
    )
    .map((mountableItem) => {
      return {
        name: `${FoundryAdapter.localize(
          'TIDY5E.ContextMenuActionAssignToEntity',
          { entityName: mountableItem.name }
        )} ${mountableItem.crew.value}/${mountableItem.crew.max}`,
        icon: '<i class="fa-solid fa-user fa-fw"></i>',
        condition: () => area === 'crew' && canChange,
        callback: async () => {
          const actor = await fromUuid(memberUuid);

          const currentlyAssignedItem = app.document.items.get(
            currentlyAssignedItemId
          );

          if (currentlyAssignedItem) {
            await app._unassignCrew(actor, currentlyAssignedItem);
          }

          const newItemToAssign = app.document.items.get(mountableItem.id);

          await app._assignCrew(actor, newItemToAssign, { src: area });
        },
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return [
    {
      name: FoundryAdapter.localize('TIDY5E.ContextMenuActionUnassign'),
      icon: '<i class="fa-solid fa-trash fa-fw"></i>',
      condition: () => !!currentlyAssignedItemId && canChange,
      callback: async () => {
        const actor = await fromUuid(memberUuid);

        const currentlyAssignedItem = app.document.items.get(
          currentlyAssignedItemId
        );

        if (currentlyAssignedItemId) {
          await app._unassignCrew(actor, currentlyAssignedItem);
        }
      },
    },
    ...assignableItemOptions,
  ];
}
function getMemberUuid(element: HTMLElement) {
  return element
    .closest('[data-member-uuid]')
    ?.getAttribute('data-member-uuid') as string | undefined;
}

function canChangeDocument(app: Tidy5eVehicleSheetQuadrone) {
  return (
    app.document.isOwner && !FoundryAdapter.isLockedInCompendium(app.document)
  );
}
