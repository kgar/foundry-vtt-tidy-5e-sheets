import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class VehicleAssignedCrewColumnRuntimeImpl extends ColumnRuntimeBase<'vehicleAssignedCrew'> {
  domain = 'vehicleAssignedCrew' as const;
}

export const VehicleAssignedCrewColumnRuntime = new VehicleAssignedCrewColumnRuntimeImpl();
