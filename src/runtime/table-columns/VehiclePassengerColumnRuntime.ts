import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class VehiclePassengerColumnRuntimeImpl extends ColumnRuntimeBase<'vehiclePassenger'> {
  domain = 'vehiclePassenger' as const;
}

export const VehiclePassengerColumnRuntime = new VehiclePassengerColumnRuntimeImpl();
