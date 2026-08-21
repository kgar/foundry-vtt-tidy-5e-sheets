import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class BastionFacilityColumnRuntimeImpl extends ColumnRuntimeBase<'bastionFacility'> {
  domain = 'bastionFacility' as const;
}

export const BastionFacilityColumnRuntime =
  new BastionFacilityColumnRuntimeImpl();
