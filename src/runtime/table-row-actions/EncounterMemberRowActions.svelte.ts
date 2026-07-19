import type { ActorRowAction } from 'src/types/types';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EncounterMemberRowActionRuntimeImpl extends RowActionRuntimeBase<ActorRowAction> {
  settingKey: string = 'encounterMember';

  override _getDefaultRowActions() {
    return [
      {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'removeMember',
          'data-uuid': args.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
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

export const EncounterMemberRowActionRuntime =
  new EncounterMemberRowActionRuntimeImpl();
