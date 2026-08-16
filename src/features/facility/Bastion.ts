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
  FacilityOccupantContext,
} from 'src/types/types';
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
    basic: { chosen: basic, available: [], value: 0, max: 0 },
    special: { chosen: special, available: [], value: 0, max: 0 },
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
      group.value = group.chosen.filter(
        ({ free }) => type === CONSTANTS.FACILITY_TYPE_BASIC || !free,
      ).length;
      group.max = available ?? 0;
      available = (available ?? 0) - group.value;
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

  facilities.basic.chosen = facilities.basic.chosen.sort(
    (a, b) => a.facility.sort - b.facility.sort,
  );
  facilities.special.chosen = facilities.special.chosen.sort(
    (a, b) => a.facility.sort - b.facility.sort,
  );

  return {
    defenders: allDefenders,
    facilities,
    byId,
  };
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
  /** Compendium browser application options, usually from `sheet._detachOptions()`. */
  detachOptions?: unknown;
  /**
   * When true, offer facilities above the actor's level. Lets a GM stock a bastion
   * ahead of the level at which its facilities would normally unlock.
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
