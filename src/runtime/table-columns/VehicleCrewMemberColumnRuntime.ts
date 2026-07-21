import { CONSTANTS } from 'src/constants';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
} from 'src/types/types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import VehicleMemberCrColumn from 'src/sheets/quadrone/item/columns/VehicleMemberCrColumn.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import VehicleMemberQuantityColumn from 'src/sheets/quadrone/item/columns/VehicleMemberQuantityColumn.svelte';
import VehicleCrewMemberAssignedColumn from 'src/sheets/quadrone/item/columns/VehicleCrewMemberAssignedColumn.svelte';
import VehicleCrewAssignToColumn from 'src/sheets/quadrone/item/columns/VehicleCrewAssignToColumn.svelte';
import { getDefaultItemColumns } from './default-item-columns';
import VehicleMemberHpColumn from 'src/sheets/quadrone/item/columns/VehicleMemberHpColumn.svelte';

type ColumnSpecificationBase = Omit<ColumnSpecification, 'priority' | 'order'>;

class VehicleMemberColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    const defaultItemColumns = getDefaultItemColumns();

    const localize = FoundryAdapter.localize;

    const crColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: localize('DND5E.AbbreviationCR'),
      },
      cellContent: {
        type: 'component',
        component: VehicleMemberCrColumn,
      },
      widthRems: 3,
    };

    const hpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: localize('TIDY5E.Vehicle.Equipment.HP.Label'),
      },
      cellContent: {
        type: 'component',
        component: VehicleMemberHpColumn,
      },
      widthRems: 4,
    };

    const assignToColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: localize('TIDY5E.Vehicle.Member.AssignTo.Label'),
      },
      cellContent: {
        type: 'component',
        component: VehicleCrewAssignToColumn,
      },
      widthRems: 10,
    };

    const qtyColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: localize('DND5E.QuantityAbbr'),
      },
      cellContent: {
        type: 'component',
        component: VehicleMemberQuantityColumn,
      },
      widthRems: 5,
    };

    const assignedColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: localize('DND5E.VEHICLE.Crew.Assigned'),
      },
      cellContent: {
        type: 'component',
        component: VehicleCrewMemberAssignedColumn,
      },
      widthRems: 10,
    };

    return {
      [CONSTANTS.SHEET_TYPE_VEHICLE]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            cr: { ...crColumn, priority: 10, order: 10 },
            hp: { ...hpColumn, priority: 20, order: 20 },
          },
        },
        [CONSTANTS.TAB_VEHICLE_CREW_AND_PASSENGERS]: {
          [CONSTANTS.SECTION_KEY_UNASSIGNED]: {
            cr: { ...crColumn, priority: 10, order: 10 },
            qty: { ...qtyColumn, priority: 20, order: 20 },
            assignTo: { ...assignToColumn, priority: 30, order: 30 },
          },
          [CONSTANTS.SECTION_KEY_ASSIGNED]: {
            cr: { ...crColumn, priority: 10, order: 10 },
            hp: { ...hpColumn, priority: 20, order: 20 },
            assigned: { ...assignedColumn, priority: 30, order: 30 },
          },
          [CONSTANTS.SECTION_KEY_PASSENGERS]: {
            cr: { ...crColumn, priority: 10, order: 10 },
            qty: { ...qtyColumn, priority: 20, order: 20 },
          },
        },
      },
    };
  }
}

export const VehicleMemberColumnRuntime = new VehicleMemberColumnRuntimeImpl();
