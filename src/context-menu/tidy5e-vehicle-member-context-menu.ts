import { TidyHooks } from 'src/foundry/TidyHooks';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry, CrewArea5e } from 'src/foundry/foundry.types';
import type { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import type { Tidy5eVehicleSheetQuadrone } from 'src/sheets/quadrone/Tidy5eVehicleSheetQuadrone.svelte';

/**
 * Crew can be managed from the vehicle sheet, as well as from the sheet of a
 * mountable item which has its own crew roster.
 */
type VehicleMemberContextMenuApp =
  Tidy5eVehicleSheetQuadrone | Tidy5eItemSheetQuadrone;

export function configureVehicleMemberContextMenu(
  element: HTMLElement,
  app: VehicleMemberContextMenuApp,
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
  app: VehicleMemberContextMenuApp,
) {
  const vehicleItemId = getVehicleItemId(element);

  const area = getCrewArea(element);

  let options: ContextMenuEntry[] = vehicleItemId
    ? getVehicleItemMemberOptions(element, app, vehicleItemId)
    : area === 'crew' || area === 'passengers'
      ? getCrewMemberOptions(element, app as Tidy5eVehicleSheetQuadrone)
      : area === 'draft'
        ? getDraftMemberOptions(element, app as Tidy5eVehicleSheetQuadrone)
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
  app: VehicleMemberContextMenuApp,
  vehicleItemId: string,
): ContextMenuEntry[] {
  const brokenLink = !!element.closest('.broken');
  const empty = !!element.closest('.empty');
  const memberUuid = element.closest('[data-uuid]')?.getAttribute('data-uuid');

  // Either a vehicle or the mountable item itself can summon this menu.
  const item =
    app.document.items?.get(vehicleItemId) ??
    (app.document.id === vehicleItemId ? app.document : undefined);

  // The owning actor governs permissions, when there is one.
  const permissionsDocument = app.document.actor ?? app.document;

  if (!item) {
    return [];
  }

  return [
    {
      label: 'TIDY5E.CONTEXTMENU.Action.Edit',
      icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
      onClick: async () => {
        const actor = await fromUuid(memberUuid);
        app._openDocumentSheet(actor);
      },
      visible: () =>
        !empty &&
        !brokenLink &&
        permissionsDocument.isOwner &&
        !FoundryAdapter.isLockedInCompendium(permissionsDocument),
    },
    {
      label: brokenLink
        ? FoundryAdapter.localize('TIDY5E.COMMON.Action.RemoveNamed', {
            name: FoundryAdapter.localize('TIDY5E.COMMON.BrokenLink'),
          })
        : FoundryAdapter.localize('TIDY5E.CONTEXTMENU.Action.Unassign'),
      visible: () => !!memberUuid,
      icon: '<i class="fa-solid fa-user-minus"></i>',
      onClick: async () => {
        if (item && memberUuid) {
          await app._unassignCrew(memberUuid, item.uuid);
        }
      },
    },
    {
      label: FoundryAdapter.localize('TIDY5E.COMMON.Action.AddNamed', {
        name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Label'),
      }),
      // A broken link is replaced in place by the chosen actor.
      visible: () => empty || brokenLink,
      icon: '<i class="fa-solid fa-book-atlas"></i>',
      onClick: () =>
        app.browseAssignActor(
          item,
          brokenLink ? (memberUuid ?? undefined) : undefined,
        ),
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
      label: FoundryAdapter.localize('TIDY5E.COMMON.Action.RemoveNamed', {
        name: FoundryAdapter.localize(
          'TIDY5E.VEHICLE.Member.DraftAnimal.Title.one',
        ),
      }),
      icon: '<i class="fa-solid fa-trash"></i>',
      visible: () => canChange,
      onClick: async () => {
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
          'TIDY5E.CONTEXTMENU.Action.AssignTo',
          { entityName: mountableItem.name },
        )} ${mountableItem.crew?.value ?? '0'}/${
          mountableItem.crew?.max ?? '—'
        }`,
        icon: '<i class="fa-solid fa-user-plus fa-fw"></i>',
        visible: () => area === 'crew' && canChange,
        onClick: async () => {
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
      label: FoundryAdapter.localize('TIDY5E.CONTEXTMENU.Action.Unassign'),
      icon: '<i class="fa-solid fa-user-minus fa-fw"></i>',
      visible: () => !!currentlyAssignedItemId && canChange,
      onClick: async () => {
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
      label: FoundryAdapter.localize('TIDY5E.COMMON.Action.RemoveNamed', {
        name: FoundryAdapter.localize('TIDY5E.VEHICLE.Crew.Unassigned.Title'),
      }),
      icon: '<i class="fa-solid fa-trash"></i>',
      visible: () => area === 'crew' && unassigned && canChange,
      onClick: async () => {
        if (memberUuid) {
          app.removeUnassignedCrew(memberUuid);
        }
      },
    },
    {
      label: FoundryAdapter.localize('TIDY5E.COMMON.Action.RemoveNamed', {
        name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Passengers'),
      }),
      icon: '<i class="fa-solid fa-trash"></i>',
      visible: () => area === 'passengers' && canChange,
      onClick: async () => {
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
