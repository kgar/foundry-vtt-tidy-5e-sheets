import type { ActivityRowAction } from 'src/types/types';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ActivityRowActionRuntimeImpl extends RowActionRuntimeBase<ActivityRowAction> {
  settingKey: string = 'activity';

  override _getDefaultRowActions() {
    return [
      {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.activity }),
      } satisfies ActivityRowAction<typeof EditButton>,
      {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.activity,
        }),
      } satisfies ActivityRowAction<typeof DeleteButton>,
      {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActivityRowAction<typeof MenuButton>,
    ];
  }
}

export const ActivityRowActionRuntime = new ActivityRowActionRuntimeImpl();
