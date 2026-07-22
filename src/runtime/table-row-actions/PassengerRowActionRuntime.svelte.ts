import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class PassengerRowActionRuntimeImpl extends RowActionRuntimeBase<'vehiclePassenger'> {
  domain = 'vehiclePassenger' as const;
}

export const PassengerRowActionRuntime = new PassengerRowActionRuntimeImpl();
