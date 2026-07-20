import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class DraftAnimalMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'draftAnimal'> {
  domain = 'draftAnimal' as const;

  override _getDefaultRowActionKeys() {
    return ['remove', 'menu'];
  }
}

export const DraftAnimalMemberRowActionRuntime =
  new DraftAnimalMemberRowActionRuntimeImpl();
