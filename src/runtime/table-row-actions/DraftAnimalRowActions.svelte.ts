import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class DraftAnimalMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'draftAnimal'> {
  domain = 'draftAnimal' as const;
}

export const DraftAnimalMemberRowActionRuntime =
  new DraftAnimalMemberRowActionRuntimeImpl();
