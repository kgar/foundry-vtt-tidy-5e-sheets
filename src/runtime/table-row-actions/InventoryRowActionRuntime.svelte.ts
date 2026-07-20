import type { Actor5e, ItemRowAction } from 'src/types/types';
import EquipButton from 'src/components/table-quadrone/table-buttons/EquipButton.svelte';
import CharacterSheetTabToggleButton from 'src/components/table-quadrone/table-buttons/CharacterSheetTabToggleButton.svelte';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import AttuneButton from 'src/components/table-quadrone/table-buttons/AttuneButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class InventoryRowActionRuntimeImpl extends RowActionRuntimeBase<ItemRowAction> {
  settingKey: string = 'inventory';

  override _getDefaultRowActions() {
    return [
      {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowAction<typeof EditButton>,
      {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item,
        }),
      } satisfies ItemRowAction<typeof DeleteButton>,
      {
        component: AttuneButton,
        condition: (args) =>
          args.rowDocument.isOwner &&
          !args.data.unlocked &&
          // TODO: remove doc type logic after partitioning
          (args.sheetDocument.system.isCharacter ||
            args.sheetDocument.system.isNPC) &&
          FoundryAdapter.isAttunementApplicable(args.rowDocument),
        props: (args) => ({
          doc: args.item,
          ctx: args.ctx,
        }),
      } satisfies ItemRowAction<typeof AttuneButton>,
      {
        component: EquipButton,
        props: (args) => ({ doc: args.item }),
        condition: (args) =>
          args.rowDocument.isOwner &&
          !args.data.unlocked &&
          // TODO: remove doc type logic after partitioning
          (args.sheetDocument.system.isCharacter ||
            args.sheetDocument.system.isNPC) &&
          'equipped' in args.rowDocument.system,
      } satisfies ItemRowAction<typeof EquipButton>,
      {
        component: CharacterSheetTabToggleButton,
        condition: (args) =>
          // TODO: remove doc type logic after partitioning
          args.sheetDocument.system.isCharacter &&
          args.rowDocument.isOwner &&
          !args.data.unlocked,
        props: (args) => ({
          doc: args.item,
          ctx: args.ctx,
        }),
      } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
      {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemRowAction<typeof MenuButton>,
    ];
  }
}

export const InventoryRowActionRuntime = new InventoryRowActionRuntimeImpl();
