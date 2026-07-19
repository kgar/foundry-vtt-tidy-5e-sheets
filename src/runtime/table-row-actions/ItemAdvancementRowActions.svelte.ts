import type { AdvancementRowAction, ItemRowAction } from 'src/types/types';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ItemAdvancementMemberRowActionRuntimeImpl extends RowActionRuntimeBase<AdvancementRowAction> {
  settingKey: string = 'itemAdvancement';

  override _getDefaultRowActions() {
    return [
      {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item.system.advancement?.get(args.id),
        }),
      } satisfies AdvancementRowAction<typeof EditButton>,
      {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item.system.advancement?.get(args.id),
          deleteFn: () =>
            args.item.system.advancement
              ?.get(args.id)
              ?.deleteDialog({ sheet: args.item }),
        }),
      } satisfies AdvancementRowAction<typeof DeleteButton>,
      {
        component: MenuButton,
        props: () => ({
          targetSelector: '.advancement-item',
        }),
      } satisfies ItemRowAction<typeof MenuButton>,
    ];
  }
}

export const ItemAdvancementMemberRowActionRuntime =
  new ItemAdvancementMemberRowActionRuntimeImpl();
