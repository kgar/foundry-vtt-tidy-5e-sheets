import type { ActorRowAction } from 'src/types/types';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class PassengerRowActionRuntimeImpl extends RowActionRuntimeBase<ActorRowAction> {
  settingKey: string = 'passenger';

  override _getDefaultRowActions() {
    return [
      {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'removePassengers',
          'data-uuid': args.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
            name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Passengers'),
          }),
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

export const PassengerRowActionRuntime =
  new PassengerRowActionRuntimeImpl();
