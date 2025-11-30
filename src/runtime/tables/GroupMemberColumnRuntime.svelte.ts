import { CONSTANTS } from 'src/constants';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
  ColumnSpecificationCalculatedWidthArgs,
} from '../types';
import SectionActionsColumnHeader from 'src/sheets/quadrone/item/columns/SectionActionsColumnHeader.svelte';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import GroupMemberInspirationColumn from 'src/sheets/quadrone/item/columns/GroupMemberInspirationColumn.svelte';
import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';
import GroupMemberHpColumn from 'src/sheets/quadrone/item/columns/GroupMemberHpColumn.svelte';
import GroupMemberHdColumn from 'src/sheets/quadrone/item/columns/GroupMemberHdColumn.svelte';
import GroupMemberAcColumn from 'src/sheets/quadrone/item/columns/GroupMemberAcColumn.svelte';
import GroupCharacterXpColumn from 'src/sheets/quadrone/item/columns/GroupXpColumn.svelte';
import GroupVehicleDtColumn from 'src/sheets/quadrone/item/columns/GroupVehicleDtColumn.svelte';
import GroupVehicleCrewColumn from 'src/sheets/quadrone/item/columns/GroupVehicleCrewColumn.svelte';
import { systemSettings } from 'src/settings/settings.svelte';

type ColumnSpecificationBase = Omit<ColumnSpecification, 'priority' | 'order'>;

class GroupMemberColumnRuntimeImpl extends TableColumnRuntimeBase {
  _minWidthRems = 15;

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

    const xpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.ExperiencePoints.Abbreviation'),
      },
      cellContent: {
        type: 'component',
        component: GroupCharacterXpColumn,
      },
      condition: () =>
        systemSettings.value.levelingMode !==
        CONSTANTS.SYSTEM_SETTING_LEVELING_MODE_NO_XP,
      widthRems: 3.75,
    };

    const damageThresholdColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.HITPOINTS.DT.abbr'),
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
        html: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Label'),
      },
      cellContent: {
        type: 'component',
        component: GroupVehicleCrewColumn,
      },
      cellClasses: 'truncate',
      widthRems: 3.75,
    };

    const actionsColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'component',
        component: SectionActionsColumnHeader,
      },
      cellContent: {
        type: 'component',
        component: DocumentActionsColumn,
      },
      cellClasses: 'tidy-table-actions',
      headerClasses: 'header-cell-actions',
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
            inspiration: { ...inspirationColumn, order: 100, priority: 400 },
            hp: { ...hpColumn, order: 200, priority: 500 },
            hd: { ...hdColumn, order: 300, priority: 100 },
            ac: { ...acColumn, order: 400, priority: 200 },
            characterXp: { ...xpColumn, order: 500, priority: 300 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
          [CONSTANTS.SHEET_TYPE_NPC]: {
            hp: { ...hpColumn, order: 100, priority: 400 },
            hd: { ...hdColumn, order: 200, priority: 100 },
            ac: { ...acColumn, order: 300, priority: 200 },
            npcXp: { ...xpColumn, order: 400, priority: 300 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
          [CONSTANTS.SHEET_TYPE_VEHICLE]: {
            hp: { ...hpColumn, order: 100, priority: 400 },
            ac: { ...acColumn, order: 200, priority: 300 },
            dt: { ...damageThresholdColumn, order: 300, priority: 200 },
            crew: { ...crewColumn, order: 400, priority: 100 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            inspiration: { ...inspirationColumn, order: 100, priority: 400 },
            hp: { ...hpColumn, order: 200, priority: 500 },
            hd: { ...hdColumn, order: 300, priority: 100 },
            ac: { ...acColumn, order: 400, priority: 200 },
            characterXp: { ...xpColumn, order: 500, priority: 300 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
        },
      },
    };
  }
}

export const GroupMemberColumnRuntime = new GroupMemberColumnRuntimeImpl();
