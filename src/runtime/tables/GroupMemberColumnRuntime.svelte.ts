import { CONSTANTS } from 'src/constants';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
  ColumnSpecificationCalculatedWidthArgs,
} from '../types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import GroupMemberInspirationColumn from 'src/sheets/quadrone/item/columns/GroupMemberInspirationColumn.svelte';
import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';
import GroupMemberHpColumn from 'src/sheets/quadrone/item/columns/GroupMemberHpColumn.svelte';
import GroupMemberHdColumn from 'src/sheets/quadrone/item/columns/GroupMemberHdColumn.svelte';
import GroupMemberAcColumn from 'src/sheets/quadrone/item/columns/GroupMemberAcColumn.svelte';
import GroupCharacterXpColumn from 'src/sheets/quadrone/item/columns/GroupCharacterXpColumn.svelte';
import GroupNpcXpColumn from 'src/sheets/quadrone/item/columns/GroupNpcXpColumn.svelte';
import GroupVehicleDtColumn from 'src/sheets/quadrone/item/columns/GroupVehicleDtColumn.svelte';
import GroupVehicleCrewColumn from 'src/sheets/quadrone/item/columns/GroupVehicleCrewColumn.svelte';
import GroupVehicleCargoColumn from 'src/sheets/quadrone/item/columns/GroupVehicleCargoColumn.svelte';

type ColumnSpecificationBase = Omit<ColumnSpecification, 'priority' | 'order'>;

class GroupMemberColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    const inspirationColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Inspiration'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 4.5,
    };

    const hpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.HP'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberHpColumn,
      },
      widthRems: 3.75,
    };

    const hdColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.HitDie'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberHdColumn,
      },
      widthRems: 3.75,
    };

    const acColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.AC'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberAcColumn,
      },
      widthRems: 3,
    };

    const characterXpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.ExperiencePoints.Abbreviation'),
      },
      cellContent: {
        type: 'component',
        component: GroupCharacterXpColumn,
      },
      widthRems: 3.75,
    };

    const npcXpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.ExperiencePoints.Abbreviation'),
      },
      cellContent: {
        type: 'component',
        component: GroupNpcXpColumn,
      },
      widthRems: 3.75,
    };

    const damageThresholdColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.HITPOINTS.DT.Abbr'),
      },
      cellContent: {
        type: 'component',
        component: GroupVehicleDtColumn,
      },
      widthRems: 3,
    };

    const crewColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.VehicleCrew'),
      },
      cellContent: {
        type: 'component',
        component: GroupVehicleCrewColumn,
      },
      widthRems: 3.75,
    };

    const cargoColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.VehicleCargo'),
      },
      cellContent: {
        type: 'component',
        component: GroupVehicleCargoColumn,
      },
      widthRems: 3.75,
    };

    const actionsColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: '',
      },
      cellContent: {
        type: 'component',
        component: DocumentActionsColumn,
      },
      widthRems: (section: ColumnSpecificationCalculatedWidthArgs) => {
        let paddingX = 0.1875;
        let buttonWidth = 1.5;
        return buttonWidth * section.rowActions.length + paddingX;
      },
    };

    return {
      [CONSTANTS.SHEET_TYPE_GROUP]: {
        [CONSTANTS.TAB_MEMBERS]: {
          [CONSTANTS.SHEET_TYPE_CHARACTER]: {
            inspiration: { ...inspirationColumn, order: 100, priority: 100 },
            hp: { ...hpColumn, order: 200, priority: 100 },
            hd: { ...hdColumn, order: 300, priority: 100 },
            ac: { ...acColumn, order: 400, priority: 100 },
            characterXp: { ...characterXpColumn, order: 500, priority: 100 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
          [CONSTANTS.SHEET_TYPE_NPC]: {
            hp: { ...hpColumn, order: 100, priority: 100 },
            hd: { ...hdColumn, order: 200, priority: 100 },
            ac: { ...acColumn, order: 300, priority: 100 },
            npcXp: { ...npcXpColumn, order: 400, priority: 100 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
          [CONSTANTS.SHEET_TYPE_VEHICLE]: {
            hp: { ...hpColumn, order: 100, priority: 100 },
            ac: { ...acColumn, order: 200, priority: 100 },
            dt: { ...damageThresholdColumn, order: 300, priority: 100 },
            crew: { ...crewColumn, order: 400, priority: 100 },
            cargo: { ...cargoColumn, order: 500, priority: 100 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
        },
      },
    };
  }
}

export const GroupMemberColumnRuntime = new GroupMemberColumnRuntimeImpl();
