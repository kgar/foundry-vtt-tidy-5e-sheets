import type { FacilityOccupantSlot } from 'src/types/types';

export function getTidyFacilityIcon(
    order: string
  ): Dnd5eIconSrc | FontAwesomeIconClass | null {
    const tidyIcon = TidyFacilityIconsMap[order];
  
    if (tidyIcon) {
      return {
        type: 'fa-icon-class',
        className: tidyIcon,
      };
    }
  
    const dnd5eIconSrc = CONFIG.DND5E.facilities.orders[order]?.icon;
  
    if (dnd5eIconSrc) {
      return {
        type: 'dnd5e-icon',
        src: dnd5eIconSrc,
      };
    }
  
    return null;
  }
  
  /** Localization keys for each kind of facility occupant. */
  export const FacilityOccupantSlotLabelsMap: Record<
    FacilityOccupantSlot,
    string
  > = {
    creatures: 'TIDY5E.Facilities.Creatures.Label',
    defenders: 'TIDY5E.Facilities.Defenders.Label',
    hirelings: 'TIDY5E.Facilities.Hirelings.Label',
  };

  export const TidyFacilityIconsMap: Record<string, string> = {
    build: 'fas fa-trowel-bricks',
    change: 'fas fa-rotate',
    craft: 'fas fa-hammer-crash',
    empower: 'fas fa-wreath-laurel',
    enlarge: 'fas fa-maximize',
    harvest: 'fas fa-wheat',
    maintain: 'fas fa-hammer-brush',
    recruit: 'fas fa-handshake-angle',
    repair: 'fas fa-screwdriver-wrench',
    research: 'fas fa-flask',
    trade: 'fas fa-coins',
  };
  
  type Dnd5eIconSrc = {
    type: 'dnd5e-icon';
    src: string;
  };
  
  type FontAwesomeIconClass = {
    type: 'fa-icon-class';
    className: string;
  };