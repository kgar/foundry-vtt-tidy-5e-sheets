import { CONSTANTS } from 'src/constants';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
} from '../types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import GroupMemberInspirationColumn from 'src/sheets/quadrone/item/columns/GroupMemberInspirationColumn.svelte';
import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';

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
      widthRems: 7,
    };

    const hpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.HP'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 7,
    };

    const hdColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.HitDie'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 7,
    };

    const acColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.AC'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 7,
    };

    const characterXpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.XP'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 7,
    };

    const npcXpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.XP'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 7,
    };

    const damageThresholdColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.HITPOINTS.DT.Abbr'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 7,
    };

    const crewColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.VehicleCrew'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 7,
    };

    const cargoColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.VehicleCargo'),
      },
      cellContent: {
        type: 'component',
        component: GroupMemberInspirationColumn,
      },
      widthRems: 7,
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
      widthRems: 7,
    };

    return {
      [CONSTANTS.SHEET_TYPE_GROUP]: {
        [CONSTANTS.TAB_MEMBERS]: {
          [CONSTANTS.SHEET_TYPE_CHARACTER]: {
            inspiration: { ...inspirationColumn, order: 100, priority: 100 },
            hp: { ...hpColumn, order: 200, priority: 100 },
            hd: { ...hdColumn, order: 300, priority: 100 },
            ac: { ...acColumn, order: 400, priority: 100 },
            characterXp: { ...characterXpColumn, order: 100, priority: 100 },
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
