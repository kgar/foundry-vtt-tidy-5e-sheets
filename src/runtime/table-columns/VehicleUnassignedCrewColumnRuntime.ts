import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class VehicleUnassignedCrewColumnRuntimeImpl extends ColumnRuntimeBase<'vehicleUnassignedCrew'> {
  domain = 'vehicleUnassignedCrew' as const;
}

export const VehicleUnassignedCrewColumnRuntime = new VehicleUnassignedCrewColumnRuntimeImpl();
