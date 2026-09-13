import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type { OccupantContext } from 'src/types/types';

/**
 * Prepare an item's crew, one per point of crew capacity, plus any extra
 * assigned slots.
 */
export function prepareCrewAssignments(
  item: Item5e,
): Promise<OccupantContext[]> {
  const assigned: string[] = item.system.crew?.value ?? [];
  const slots = Math.max(item.system.crew?.max ?? 0, assigned.length);

  return Promise.all(
    Array.fromRange(slots).map(async (index: number) => {
      const uuid = assigned[index];
      return { actor: uuid ? await fromUuid(uuid) : undefined, uuid };
    }),
  );
}

/**
 * Assign an actor to an item, respecting its crew capacity. When the item 
 * belongs to a vehicle, also add to the vehicle crew.
 */
export async function assignCrewMember(item: Item5e, actorUuid: string) {
  const crew = item.system.crew;

  if (!crew) {
    return;
  }

  const assigned: string[] = [...(crew.value ?? [])];

  if (assigned.includes(actorUuid) || assigned.length >= (crew.max ?? 0)) {
    return;
  }

  assigned.push(actorUuid);

  return await updateCrew(item, assigned, actorUuid);
}

/**
 * Replace an item's crew member in the same slot for broken links.
 */
export async function replaceCrewMember(
  item: Item5e,
  previousUuid: string,
  actorUuid: string,
) {
  const assigned: string[] = [...(item.system.crew?.value ?? [])];
  const index = assigned.indexOf(previousUuid);

  if (index === -1) {
    return await assignCrewMember(item, actorUuid);
  }

  if (assigned.includes(actorUuid)) {
    assigned.splice(index, 1);
  } else {
    assigned[index] = actorUuid;
  }

  return await updateCrew(item, assigned, actorUuid);
}

/**
 * Update an item's crew. When the item belongs to a vehicle, also add to
 * the vehicle crew.
 */
async function updateCrew(item: Item5e, assigned: string[], actorUuid: string) {
  const vehicle =
    item.actor?.type === CONSTANTS.SHEET_TYPE_VEHICLE ? item.actor : undefined;

  if (!vehicle) {
    return await item.update({ 'system.crew.value': assigned });
  }

  const itemUpdates = { _id: item.id };
  foundry.utils.setProperty(itemUpdates, 'system.crew.value', assigned);

  const actorUpdates = { items: [itemUpdates] };

  // An actor manning a station is part of the vehicle's crew.
  const roster: string[] = vehicle.system.crew?.value ?? [];
  if (!roster.includes(actorUuid)) {
    Object.assign(
      actorUpdates,
      vehicle.system.getCrewUpdates(
        CONSTANTS.SECTION_TYPE_CREW,
        actorUuid,
        '+1',
      ),
    );
  }

  return await vehicle.update(actorUpdates);
}

/**
 * Remove an actor from an item's crew without updating vehicle crew.
 */
export async function unassignCrewMember(item: Item5e, actorUuid: string) {
  const assigned: string[] = [...(item.system.crew?.value ?? [])];

  if (!assigned.findSplice((uuid: string) => uuid === actorUuid)) {
    return;
  }

  return await item.update({ 'system.crew.value': assigned });
}
