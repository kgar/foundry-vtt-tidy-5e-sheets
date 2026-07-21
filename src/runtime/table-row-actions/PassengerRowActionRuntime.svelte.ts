import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class PassengerRowActionRuntimeImpl extends RowActionRuntimeBase<'passenger'> {
  domain = 'passenger' as const;
}

export const PassengerRowActionRuntime = new PassengerRowActionRuntimeImpl();
