import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class DraftAnimalMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'vehicleDraftAnimal'> {
  domain = 'vehicleDraftAnimal' as const;
}

export const DraftAnimalMemberRowActionRuntime =
  new DraftAnimalMemberRowActionRuntimeImpl();
