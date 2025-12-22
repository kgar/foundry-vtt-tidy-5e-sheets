import type { ColumnSpecDocumentTypesToTabs } from '../types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';

class VehicleCrewMemberColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    return {};
  }
}

export const VehicleCrewMemberColumnRuntime =
  new VehicleCrewMemberColumnRuntimeImpl();
