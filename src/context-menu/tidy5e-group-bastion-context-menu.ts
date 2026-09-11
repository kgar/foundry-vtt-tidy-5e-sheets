import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';

/**
 * We're resolving the characters in the groups for each facility.
 */
function resolveRow(element: HTMLElement): {
  member: Actor5e | undefined;
  facility: Item5e | undefined;
} {
  const memberUuid =
    element.closest<HTMLElement>('[data-member-uuid]')?.dataset.memberUuid;

  const member = memberUuid ? fromUuidSync(memberUuid) : undefined;

  // Facility rows carry `data-facility-id`; order rows identify the same document
  // with a generic `data-item-id`.
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
      label: 'DND5E.FACILITY.AvailableFacility.basic.build',
      icon: '<i class="fa-solid fa-trowel fa-fw"></i>',
      visible: canModify,
      onClick: (event) =>
        app.addMemberFacility(member, CONSTANTS.FACILITY_TYPE_BASIC, event),
    },
    {
      label: 'DND5E.FACILITY.AvailableFacility.special.free',
      icon: '<i class="fa-solid fa-building-columns fa-fw"></i>',
      visible: canModify,
      onClick: (event) =>
        app.addMemberFacility(member, CONSTANTS.FACILITY_TYPE_SPECIAL, event),
    },
    {
      label: 'TIDY5E.Bastion.Group.MaintainOrder.Label',
      icon: '<i class="fa-solid fa-broom fa-fw"></i>',
      visible: () =>
        FoundryAdapter.userIsGm() &&
        canModify() &&
        !!member.itemTypes.facility?.length,
      group: 'common',
      onClick: () => app.issueMemberMaintainOrder(member),
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
      label: 'TIDY5E.ContextMenuActionView',
      icon: '<i class="fas fa-eye fa-fw"></i>',
      group: 'common',
      onClick: () =>
        app._renderChild(facility.sheet, { mode: CONSTANTS.SHEET_MODE_PLAY }),
    },
    {
      label: 'TIDY5E.ContextMenuActionEdit',
      icon: '<i class="fa-solid fa-pen-to-square fa-fw"></i>',
      visible: canModify,
      group: 'common',
      onClick: () =>
        app._renderChild(facility.sheet, { mode: CONSTANTS.SHEET_MODE_EDIT }),
    },
    {
      label: 'DND5E.FACILITY.Order.Execute',
      icon: '<i class="fa-solid fa-scroll fa-fw"></i>',
      visible: () =>
        canModify() &&
        !facility.system.disabled &&
        isNil(facility.system.progress?.order, ''),
      group: 'common',
      onClick: (event) =>
        app.useMemberFacility(member, facility.id, event),
    },
    {
      // Runs the system's order evaluation so gold and crafted items are awarded.
      label: 'TIDY5E.Bastion.Group.CompleteOrder.Label',
      icon: '<i class="fa-solid fa-clipboard-check fa-fw"></i>',
      visible: () =>
        FoundryAdapter.userIsGm() &&
        canModify() &&
        !isNil(facility.system.progress?.order, ''),
      group: 'common',
      onClick: () => app.completeMemberFacilityOrder(facility),
    },
    {
      // Cancels the order, skipping the system's order evaluation, so no gold
      // or crafted items are awarded.
      label: 'TIDY5E.Bastion.Group.CancelOrder.Label',
      icon: '<i class="fa-solid fa-xmark fa-fw"></i>',
      visible: () => canModify() && !isNil(facility.system.progress?.order, ''),
      group: 'common',
      onClick: () =>
        facility.update({
          'system.progress': { value: 0, max: null, order: '' },
        }),
    },
    // {
    //   // TODO: Tidy-only functionality here, not via the system.
    //   label: 'TIDY5E.Bastion.Group.KillDefenders.Label',
    //   icon: '<i class="fa-solid fa-skull fa-fw"></i>',
    //   classes: 'color-text-lighter',
    //   visible: () => canModify() && facility.system.defenders?.max > 0,
    //   group: 'common',
    //   onClick: () => {console.log('TODO: Kill defenders functionality');},
    // },
    {
      label: 'TIDY5E.ContextMenuActionDelete',
      icon: "<i class='fas fa-trash fa-fw' style='color: var(--t5e-warning-accent-color);'></i>",
      visible: () => canModify() && facility.canDelete,
      group: 'be-careful',
      onClick: () => facility.deleteDialog({ sheet: app }),
    },
  ] satisfies ContextMenuEntry[];
}
