import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class PassengerRowActionRuntimeImpl extends RowActionRuntimeBase<'passenger'> {
  domain = 'passenger' as const;

  override _getDefaultRowActionKeys() {
    return ['remove', 'menu'];
  }
}

export const PassengerRowActionRuntime = new PassengerRowActionRuntimeImpl();
