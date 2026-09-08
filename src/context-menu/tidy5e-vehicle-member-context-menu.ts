import { TidyHooks } from 'src/foundry/TidyHooks';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry, CrewArea5e } from 'src/foundry/foundry.types';
import type { Tidy5eVehicleSheetQuadrone } from 'src/sheets/quadrone/Tidy5eVehicleSheetQuadrone.svelte';

export function configureVehicleMemberContextMenu(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone,
) {
  ui.context.menuItems = getVehicleMemberContextOptions(element, app);

  TidyHooks.tidy5eSheetsGetVehicleMemberContextOptions(
    app.document,
    element,
    getMemberUuid(element),
    getVehicleItemId(element),
    getCrewArea(element),
    ui.context.menuItems,
  );
}

/**
 * Prepare an array of context menu options which are available for a member of a group.
 * @param group    The group for which the context menu is activated.
 * @param actor    The actor for whom the context menu is activate.
 * @returns        Context menu options.
 */
function getVehicleMemberContextOptions(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone,
) {
  const vehicleItemId = getVehicleItemId(element);

  const area = getCrewArea(element);

  let options: ContextMenuEntry[] = vehicleItemId
    ? getVehicleItemMemberOptions(element, app, vehicleItemId)
    : area === 'crew' || area === 'passengers'
      ? getCrewMemberOptions(element, app)
      : area === 'draft'
        ? getDraftMemberOptions(element, app)
        : [];

  return options;
}

function getCrewArea(element: HTMLElement) {
  return element.closest('[data-area]')?.getAttribute('data-area') as
    CrewArea5e | undefined;
}

function getVehicleItemId(element: HTMLElement) {
  return element.closest('[data-item-id]')?.getAttribute('data-item-id') as
    string | undefined;
}

function getVehicleItemMemberOptions(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone,
  vehicleItemId: string,
): ContextMenuEntry[] {
  const brokenLink = !!element.closest('.broken');
  const empty = !!element.closest('.empty');
  const memberUuid = element.closest('[data-uuid]')?.getAttribute('data-uuid');

  const item = app.document.items.get(vehicleItemId);

  if (!item) {
    return [];
  }

  return [
    {
      label: 'TIDY5E.ContextMenuActionEdit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      callback: async () => {
        const actor = await fromUuid(memberUuid);
        app._openDocumentSheet(actor);
      },
      visible: () =>
        !empty &&
        !brokenLink &&
        app.actor.isOwner &&
        !FoundryAdapter.isLockedInCompendium(app.actor),
    },
    {
      label: FoundryAdapter.localize('TIDY5E.ContextMenuActionUnassign'),
      visible: () => !!memberUuid,
      icon: '<i class="fa-solid fa-user-minus"></i>',
      callback: async () => {
        if (item && memberUuid) {
          await app._unassignCrew(memberUuid, item.uuid);
        }
      },
    },
    {
      label: FoundryAdapter.localize('TIDY5E.AddSpecific', {
        name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Label'),
      }),
      visible: () => empty,
      icon: '<i class="fa-solid fa-book-atlas"></i>',
      callback: () => app.browseAssignActor(item),
    },
  ];
}

function getDraftMemberOptions(
  element: HTMLElement,
  app: Tidy5eVehicleSheetQuadrone,
): ContextMenuEntry[] {
  const canChange = canChangeDocument(app);

  const memberUuid = getMemberUuid(element);

  return [
    {
      label: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
        name: FoundryAdapter.localize(
          'TIDY5E.Vehicle.Member.DraftAnimal.Label',
        ),
      }),
      icon: '<i class="fa-solid fa-trash"></i>',
      visible: () => canChange,
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
  app: Tidy5eVehicleSheetQuadrone,
): ContextMenuEntry[] {
  const memberUuid = getMemberUuid(element);

  const assigned = !!element.closest(
    '[data-area="crew"][data-tidy-section-key="assigned"]',
  );

  const unassigned = !!element.closest(
    '[data-area="crew"][data-tidy-section-key="unassigned"]',
  );

  const assignableItems = app.getAssignableItems();

  const currentlyAssignedItemId = assigned
    ? element
        .closest('[data-assigned-item-id]')
        ?.getAttribute('data-assigned-item-id')
    : undefined;

  const area = element.closest('[data-area]')?.getAttribute('data-area') as
    CrewArea5e | undefined;

  const canChange = canChangeDocument(app);

  const assignableItemOptions: ContextMenuEntry[] = Object.values(
    assignableItems,
  )
    .map<ContextMenuEntry>((mountableItem) => {
      return {
        label: `${FoundryAdapter.localize(
          'TIDY5E.ContextMenuActionAssignToEntity',
          { entityName: mountableItem.name },
        )} ${mountableItem.crew?.value ?? '0'}/${
          mountableItem.crew?.max ?? '—'
        }`,
        icon: '<i class="fa-solid fa-user-plus fa-fw"></i>',
        visible: () => area === 'crew' && canChange,
        callback: async () => {
          if (!memberUuid) {
            return;
          }

          const currentlyAssignedItem = app.document.items.get(
            currentlyAssignedItemId,
          );

          if (currentlyAssignedItem) {
            await app._unassignCrew(memberUuid, currentlyAssignedItem.uuid);
          }

          const newItemToAssign = app.document.items.get(mountableItem.id);

          await app._assignCrew(memberUuid, newItemToAssign, { src: area });
        },
      };
    })
    .sort((a, b) => (a.label && b.label ? a.label.localeCompare(b.label) : 0));

  return [
    {
      label: FoundryAdapter.localize('TIDY5E.ContextMenuActionUnassign'),
      icon: '<i class="fa-solid fa-user-minus fa-fw"></i>',
      visible: () => !!currentlyAssignedItemId && canChange,
      callback: async () => {
        if (!memberUuid) {
          return;
        }

        const currentlyAssignedItem = app.document.items.get(
          currentlyAssignedItemId,
        );

        if (currentlyAssignedItemId) {
          await app._unassignCrew(memberUuid, currentlyAssignedItem.uuid);
        }
      },
    },
    ...assignableItemOptions,
    {
      label: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
        name: FoundryAdapter.localize(
          'TIDY5E.Vehicle.Section.Crew.Unassigned.Label',
        ),
      }),
      icon: '<i class="fa-solid fa-trash"></i>',
      visible: () => area === 'crew' && unassigned && canChange,
      callback: async () => {
        if (memberUuid) {
          app.removeUnassignedCrew(memberUuid);
        }
      },
    },
    {
      label: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
        name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Passengers'),
      }),
      icon: '<i class="fa-solid fa-trash"></i>',
      visible: () => area === 'passengers' && canChange,
      callback: async () => {
        if (memberUuid) {
          app.removePassengers(memberUuid);
        }
      },
    },
  ];
}
function getMemberUuid(element: HTMLElement) {
  return element.closest('[data-uuid]')?.getAttribute('data-uuid') as
    string | undefined;
}

function canChangeDocument(app: Tidy5eVehicleSheetQuadrone) {
  return (
    app.document.isOwner && !FoundryAdapter.isLockedInCompendium(app.document)
  );
}
