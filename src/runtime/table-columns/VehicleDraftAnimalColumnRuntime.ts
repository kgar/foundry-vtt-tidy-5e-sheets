import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class VehicleDraftAnimalColumnRuntimeImpl extends ColumnRuntimeBase<'vehicleDraftAnimal'> {
  domain = 'vehicleDraftAnimal' as const;
}

export const VehicleDraftAnimalColumnRuntime = new VehicleDraftAnimalColumnRuntimeImpl();
