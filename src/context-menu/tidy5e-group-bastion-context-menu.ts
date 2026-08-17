import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';

/**
 * Resolve the member actor and, when the row has one, the facility item it owns.
 *
 * Facilities on the group bastions tab belong to **member** actors, not to the
 * group. Every row therefore carries `data-member-uuid`, and the document has to
 * be resolved through that member rather than `app.document.items`.
 */
function resolveRow(element: HTMLElement): {
  member: Actor5e | undefined;
  facility: Item5e | undefined;
} {
  const memberUuid =
    element.closest<HTMLElement>('[data-member-uuid]')?.dataset.memberUuid;

  const member = memberUuid ? fromUuidSync(memberUuid) : undefined;

  // Facility rows carry `data-facility-id`; order rows identify the same document
  // with the generic `data-item-id`.
  const facilityId =
    element.closest<HTMLElement>('[data-facility-id]')?.dataset.facilityId ??
    element.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;

  return {
    member,
    facility: facilityId ? member?.items.get(facilityId) : undefined,
  };
}

/** Menu for a party member's bastion card header. */
export function configureGroupBastionMemberContextMenu(
  element: HTMLElement,
  app: any,
) {
  const { member } = resolveRow(element);

  if (!member) {
    return;
  }

  const canModify = () =>
    member.isOwner && !FoundryAdapter.isLockedInCompendium(member);

  ui.context.menuItems = [
    {
      name: 'DND5E.FACILITY.AvailableFacility.basic.build',
      icon: '<i class="fa-solid fa-trowel fa-fw"></i>',
      condition: canModify,
      callback: (_target, event) =>
        app.addMemberFacility(member, CONSTANTS.FACILITY_TYPE_BASIC, event),
    },
    {
      name: 'DND5E.FACILITY.AvailableFacility.special.free',
      icon: '<i class="fa-solid fa-building-columns fa-fw"></i>',
      condition: canModify,
      callback: (_target, event) =>
        app.addMemberFacility(member, CONSTANTS.FACILITY_TYPE_SPECIAL, event),
    },
  ] satisfies ContextMenuEntry[];
}

/** Menu for a single facility row, either in the orders table or under a member. */
export function configureGroupBastionFacilityContextMenu(
  element: HTMLElement,
  app: any,
) {
  const { member, facility } = resolveRow(element);

  if (!member || !facility) {
    return;
  }

  const canModify = () =>
    facility.isOwner && !FoundryAdapter.isLockedInCompendium(facility);

  ui.context.menuItems = [
    {
      name: 'TIDY5E.ContextMenuActionView',
      icon: '<i class="fas fa-eye fa-fw"></i>',
      group: 'common',
      callback: () =>
        app._renderChild(facility.sheet, { mode: CONSTANTS.SHEET_MODE_PLAY }),
    },
    {
      name: 'TIDY5E.ContextMenuActionEdit',
      icon: '<i class="fa-solid fa-pen-to-square fa-fw"></i>',
      condition: canModify,
      group: 'common',
      callback: () =>
        app._renderChild(facility.sheet, { mode: CONSTANTS.SHEET_MODE_EDIT }),
    },
    {
      name: 'DND5E.FACILITY.Order.Execute',
      icon: '<i class="fa-solid fa-scroll fa-fw"></i>',
      condition: () => canModify() && !facility.system.disabled,
      group: 'common',
      callback: (_target, event) =>
        app.useMemberFacility(member, facility.id, event),
    },
    {
      // Cancels the order outright. Deliberately skips the system's order
      // evaluation, so no gold or crafted items are awarded.
      name: 'TIDY5E.Bastion.Group.DeleteOrder.Label',
      icon: '<i class="fa-solid fa-ban fa-fw"></i>',
      condition: () => canModify() && !isNil(facility.system.progress?.order, ''),
      group: 'common',
      callback: () =>
        facility.update({
          'system.progress': { value: 0, max: null, order: '' },
        }),
    },
    {
      // TODO: Tidy-only functionality here, not via the system.
      name: 'TIDY5E.Bastion.Group.KillDefenders.Label',
      icon: '<i class="fa-solid fa-skull fa-fw"></i>',
      classes: 'color-text-lighter',
      condition: () => canModify() && facility.system.defenders?.max > 0,
      group: 'common',
      callback: () => {},
    },
    {
      name: 'TIDY5E.ContextMenuActionDelete',
      icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5e-warning-accent-color);'></i>",
      condition: () => canModify() && facility.canDelete,
      group: 'be-careful',
      callback: () => facility.deleteDialog({ sheet: app }),
    },
  ] satisfies ContextMenuEntry[];
}
