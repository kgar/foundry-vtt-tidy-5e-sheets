import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { FacilityOccupants } from 'src/foundry/dnd5e.types';
import type { Item5e } from 'src/types/item.types';
import type {
  Actor5e,
  ChosenFacilityContext,
  FacilitiesContext,
  FacilityDefenderContext,
  FacilityOccupancyContext,
  FacilityOccupantContext,
} from 'src/types/types';
import { systemSettings } from 'src/settings/settings.svelte';
import { isNil } from 'src/utils/data';

/**
 * Context of all facilities and defenders for an actor.
 */
export type PreparedFacilities = {
  /** Every defender across all facilities */
  defenders: FacilityDefenderContext[];
  facilities: FacilitiesContext;
  /** Facility context by ID */
  byId: Map<string, ChosenFacilityContext>;
};

/**
 * When do facilities unlock, from the system config.
 */
export function getUnlockThresholdLevel(): number {
  const { basic, special } = CONFIG.DND5E.facilities.advancement;

  return Math.min(
    ...Object.keys(basic).map(Number),
    ...Object.keys(special).map(Number),
  );
}

/**
 * Prepare bastion facility data for display.
 */
export async function prepareFacilities(
  actor: Actor5e,
): Promise<PreparedFacilities> {
  const allDefenders: FacilityDefenderContext[] = [];
  const basic: ChosenFacilityContext[] = [];
  const special: ChosenFacilityContext[] = [];
  const byId = new Map<string, ChosenFacilityContext>();

  // TODO: Consider batching compendium lookups. Most occupants are likely to all be from the same compendium.
  for (const facility of Object.values<any>(actor.itemTypes.facility)) {
    const { id, img, labels, name, system } = facility;
    const {
      building,
      craft,
      defenders,
      disabled,
      free,
      hirelings,
      level,
      order,
      progress,
      size,
      trade,
      type,
    } = system;
    const subtitle = [];

    if (!isNil(order, '')) {
      subtitle.push(CONFIG.DND5E.facilities.orders[order]?.label ?? order);
    }

    if (trade.stock.max) {
      subtitle.push(`${trade.stock.value ?? 0} &sol; ${trade.stock.max}`);
    }

    subtitle.push(
      building.built
        ? CONFIG.DND5E.facilities.sizes[size].label
        : FoundryAdapter.localize('DND5E.FACILITY.Build.Unbuilt'),
    );

    if (!isNil(level)) {
      subtitle.push(
        FoundryAdapter.localize('DND5E.LevelNumber', { level: level }),
      );
    }

    const chosenFacilityContext: ChosenFacilityContext = {
      building,
      craft: craft.item ? await fromUuid(craft.item) : null,
      creatures: await prepareFacilityOccupants(trade.creatures),
      defenders: await prepareFacilityOccupants(defenders),
      disabled,
      executing: CONFIG.DND5E.facilities.orders[progress.order]?.icon,
      facility: facility,
      free,
      hirelings: await prepareFacilityOccupants(hirelings),
      id,
      img: foundry.utils.getRoute(img),
      isSpecial: type.value === CONSTANTS.FACILITY_TYPE_SPECIAL,
      labels,
      name,
      progress,
      subtitle: subtitle.join(' &bull; '),
    };

    allDefenders.push(
      ...chosenFacilityContext.defenders
        .map((occupant) => {
          const actor = occupant.actor;
          if (!actor) return null;
          const { img, name, uuid } = actor;
          return { img, name, uuid, facility: facility.id };
        })
        .filter((d) => !!d),
    );

    if (chosenFacilityContext.isSpecial) {
      special.push(chosenFacilityContext);
    } else {
      basic.push(chosenFacilityContext);
    }

    byId.set(facility.id, chosenFacilityContext);
  }

  const facilities: FacilitiesContext = {
    basic: { builtFacilities: basic, available: [], count: 0, max: 0 },
    special: { builtFacilities: special, available: [], count: 0, max: 0 },
  };

  [CONSTANTS.FACILITY_TYPE_BASIC, CONSTANTS.FACILITY_TYPE_SPECIAL].forEach(
    (type) => {
      const group = facilities[type];
      const config = CONFIG.DND5E.facilities.advancement[type];
      let [, available] =
        Object.entries(config)
          .reverse()
          .find(([level]) => {
            return level <= actor.system.details.level;
          }) ?? [];
      group.count = group.builtFacilities.filter(
        ({ free }) => type === CONSTANTS.FACILITY_TYPE_BASIC || !free,
      ).length;
      group.max = available ?? 0;
      available = (available ?? 0) - group.count;
      group.available = Array.fromRange(Math.max(0, available)).map(() => {
        return { label: `DND5E.FACILITY.AvailableFacility.${type}.free` };
      });
    },
  );

  if (!facilities.basic.available.length) {
    facilities.basic.available.push({
      label: 'DND5E.FACILITY.AvailableFacility.basic.build',
    });
  }

  facilities.basic.builtFacilities = facilities.basic.builtFacilities.sort(
    (a, b) => a.facility.sort - b.facility.sort,
  );
  facilities.special.builtFacilities = facilities.special.builtFacilities.sort(
    (a, b) => a.facility.sort - b.facility.sort,
  );

  return {
    defenders: allDefenders,
    facilities,
    byId,
  };
}

/**
 * Total of a type of occupant. Has uuid even if the parent actor is deleted.
 */
export function calculateOccupancy(
  facilities: ChosenFacilityContext[],
  slot: 'hirelings' | 'defenders' | 'creatures',
): FacilityOccupancyContext {
  return facilities.reduce(
    (totals, facility) => {
      const facilityOccupants = facility[slot];
      totals.max += facilityOccupants.length;
      totals.occupants += facilityOccupants.filter((facility) => !!facility.uuid).length;
      return totals;
    },
    { occupants: 0, max: 0 },
  );
}

/**
 * Advance a bastion turn for the provided actors only. This calls the
 * advancement per actor-only to let us limit it to the group.
 */
export async function advanceBastions(
  actors: Actor5e[],
  options?: { duration?: number },
): Promise<Actor5e[]> {
  const duration =
    options?.duration ?? systemSettings.value.bastionConfiguration.duration;

  const advanced: Actor5e[] = [];

  for (const actor of actors) {
    if (!actor.system.isCharacter || !actor.itemTypes.facility.length) {
      continue;
    }

    await dnd5e.bastion.advanceAllFacilities(actor, { duration });

    advanced.push(actor);
  }

  return advanced;
}

/**
 * Try to get gold cost for a facility order. This isn't saved, so we have
 * to get it from  types if it's around.
 * TODO: Get this from the order dialog and save it as a Tidy flag
 */
export function getOrderCost(
  chosen: ChosenFacilityContext,
): number | null {
  const order = chosen.progress.order;
  const system = chosen.facility.system;

  if (order === 'build') {
    return CONFIG.DND5E.facilities.sizes[system.building.size]?.value ?? null;
  }

  if (order === 'craft' || order === 'harvest') {
    const price = chosen.craft?.system?.price?.value;

    if (typeof price !== 'number') {
      return null;
    }

    // harvest has a quantity, craft is always 1.
    const quantity =
      order === 'harvest' ? (system.craft?.quantity ?? 1) : 1;

    return price * quantity;
  }

  return null;
}

/**
 * Prepare facility occupants for display.
 */
export function prepareFacilityOccupants(
  occupants: FacilityOccupants,
): Promise<FacilityOccupantContext[]> {
  const { max, value } = occupants;
  return Promise.all(
    Array.fromRange(max).map(async (i) => {
      const uuid = value[i];
      if (uuid) {
        const actor = await fromUuid(uuid);
        return {
          actor,
          uuid,
        }; // an actor can be removed from the system and still be associated here
      }
      return {
        actor: undefined,
        uuid: undefined,
      };
    }),
  );
}

/** Deleting an occupant from a facility. */
export function deleteOccupant(
  facility: Item5e,
  prop: string,
  index: number,
): Promise<Item5e> {
  let { value } = foundry.utils.getProperty(facility, prop);
  value = value.filter((_: any, i: number) => i !== index);
  return facility.update({ [`${prop}.value`]: value });
}

/** Use a facility, prompting for an activity/order. */
export function useFacility(args: {
  actor: Actor5e;
  facilityId: string | undefined;
  event: Event;
  /** The sheet to refresh after use */
  sheet: unknown;
}) {
  const { actor, facilityId, event, sheet } = args;

  const facility = actor.items.get(facilityId);

  if (facility?.system.disabled) {
    return;
  }

  return facility?.use({
    legacy: false,
    chooseActivity: true,
    event,
    options: { sheet },
  });
}

/**
 * Browse for a facility of the given type and add it to the target actor.
 */
export async function addFacility(args: {
  actor: Actor5e;
  facilityType: string;
  event: Event;
  /** For compendium browser detach, following 5e system (is this needed?) */
  detachOptions?: unknown;
  /**
   * Allow higher level factilities for GM use.
   */
  ignoreLevelRestriction?: boolean;
  /** Creates the chosen item on the target actor. */
  onSelected: (itemData: unknown, event: Event) => unknown;
}) {
  const {
    actor,
    facilityType,
    event,
    detachOptions,
    ignoreLevelRestriction = false,
    onSelected,
  } = args;

  if (
    !TidyHooks.tidy5eSheetsAddFacilityClicked(
      event,
      actor,
      CONSTANTS.ITEM_TYPE_FACILITY,
    )
  ) {
    return;
  }

  const otherType =
    facilityType === CONSTANTS.FACILITY_TYPE_BASIC
      ? CONSTANTS.FACILITY_TYPE_SPECIAL
      : CONSTANTS.FACILITY_TYPE_BASIC;

  const filters: Record<string, any> = {
    locked: {
      types: new Set([CONSTANTS.ITEM_TYPE_FACILITY]),
      additional: {
        type: { [facilityType]: 1, [otherType]: -1 },
        ...(ignoreLevelRestriction
          ? {}
          : { level: { max: actor.system.details.level } }),
      },
    },
  };

  const result = await dnd5e.applications.CompendiumBrowser.selectOne(
    { filters },
    detachOptions,
  );

  if (result) {
    onSelected(
      game.items.fromCompendium(await fromUuid(result), { keepId: true }),
      event,
    );
  }
}
