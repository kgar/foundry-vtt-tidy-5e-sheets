import { CONSTANTS } from 'src/constants';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
  ColumnSpecificationCalculatedWidthArgs,
} from '../types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';
import GroupMemberHpColumn from 'src/sheets/quadrone/item/columns/GroupMemberHpColumn.svelte';
import EncounterMemberCrColumn from 'src/sheets/quadrone/item/columns/EncounterMemberCrColumn.svelte';
import EncounterMemberQuantityColumn from 'src/sheets/quadrone/item/columns/EncounterMemberQuantityColumn.svelte';
import { systemSettings } from 'src/settings/settings.svelte';
import MemberActionsColumnHeader from 'src/sheets/quadrone/item/columns/MemberActionsColumnHeader.svelte';
import EncounterMemberQtyFormulaColumn from 'src/sheets/quadrone/item/columns/EncounterMemberQtyFormulaColumn.svelte';
import EncounterMemberInitiativeColumn from 'src/sheets/quadrone/item/columns/EncounterMemberInitiativeColumn.svelte';
import GroupXpColumn from 'src/sheets/quadrone/item/columns/GroupXpColumn.svelte';

type ColumnSpecificationBase = Omit<ColumnSpecification, 'priority' | 'order'>;

class EncounterMemberColumnRuntimeImpl extends TableColumnRuntimeBase {
  _minWidthRems = 15;

  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    const crColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.AbbreviationCR'),
      },
      cellContent: {
        type: 'component',
        component: EncounterMemberCrColumn,
      },
      widthRems: 2.5,
    };

    const quantityColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Quantity'),
      },
      cellContent: {
        type: 'component',
        component: EncounterMemberQuantityColumn,
      },
      widthRems: 4.75,
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
      widthRems: 2.5,
    };

    const npcXpColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.ExperiencePoints.Abbreviation'),
      },
      cellContent: {
        type: 'component',
        component: GroupXpColumn,
      },
      condition: () =>
        systemSettings.value.levelingMode !==
        CONSTANTS.SYSTEM_SETTING_LEVELING_MODE_NO_XP,
      widthRems: 4,
    };

    const qtyFormulaColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Formula'),
      },
      cellContent: {
        type: 'component',
        component: EncounterMemberQtyFormulaColumn,
      },
      widthRems: 4,
    };

    const actionsColumn: ColumnSpecificationBase = {
      headerClasses: 'header-cell-actions',
      headerContent: {
        type: 'component',
        component: MemberActionsColumnHeader,
      },
      cellContent: {
        type: 'component',
        component: DocumentActionsColumn,
      },
      cellClasses: 'tidy-table-actions',
      widthRems: (section: ColumnSpecificationCalculatedWidthArgs) => {
        let paddingX = 0.1875;
        let buttonWidth = 1.5;
        return buttonWidth * section.rowActions.length + paddingX;
      },
    };

    const initiativeColumn: ColumnSpecificationBase = {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Initiative'),
      },
      cellContent: {
        type: 'component',
        component: EncounterMemberInitiativeColumn,
      },
      widthRems: 4.5,
    };

    return {
      [CONSTANTS.SHEET_TYPE_ENCOUNTER]: {
        [CONSTANTS.TAB_MEMBERS]: {
          [CONSTANTS.SHEET_TYPE_NPC]: {
            cr: { ...crColumn, order: 100, priority: 500 },
            quantity: { ...quantityColumn, order: 400, priority: 500 },
            qtyFormulaColumn: {
              ...qtyFormulaColumn,
              order: 400,
              priority: 500,
            },
            hp: { ...hpColumn, order: 300, priority: 300 },
            npcXp: { ...npcXpColumn, order: 400, priority: 500 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
        },
        [CONSTANTS.TAB_ACTOR_COMBAT]: {
          [CONSTANTS.SHEET_TYPE_NPC]: {
            cr: { ...crColumn, order: 100, priority: 100 },
            quantity: { ...quantityColumn, order: 400, priority: 200 },
            initiative: { ...initiativeColumn, order: 300, priority: 300 },
            actionsColumn: { ...actionsColumn, order: 1000, priority: 1000 },
          },
        },
      },
    };
  }
}

export const EncounterMemberColumnRuntime =
  new EncounterMemberColumnRuntimeImpl();
