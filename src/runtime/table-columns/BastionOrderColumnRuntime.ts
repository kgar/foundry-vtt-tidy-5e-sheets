import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class BastionOrderColumnRuntimeImpl extends ColumnRuntimeBase<'bastionOrder'> {
  domain = 'bastionOrder' as const;
}

export const BastionOrderColumnRuntime = new BastionOrderColumnRuntimeImpl();
