import type { ActorRowAction } from 'src/types/types';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class AssignedCrewMemberRowActionRuntimeImpl extends RowActionRuntimeBase<ActorRowAction> {
  settingKey: string = 'assignedCrew';

  override _getDefaultRowActions() {
    return [
      {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'unassignCrew',
          'data-member-uuid': args.actor.uuid,
          'data-item-uuid': args.ctx?.assignedTo?.uuid,
          iconClasses: 'fa-solid fa-user-minus',
          tooltip: FoundryAdapter.localize('TIDY5E.ContextMenuActionUnassign'),
        }),
      } satisfies ActorRowAction<typeof GenericActionButton>,
      {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActorRowAction<typeof MenuButton>,
    ];
  }
}

export const AssignedCrewMemberRowActionRuntime =
  new AssignedCrewMemberRowActionRuntimeImpl();
