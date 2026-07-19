import type { ItemRowActionV2 } from 'src/types/types';
import CharacterSheetTabToggleButton from 'src/components/table-quadrone/table-buttons/CharacterSheetTabToggleButton.svelte';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class FeatureRowActionRuntimeImpl extends RowActionRuntimeBase<ItemRowActionV2> {
  settingKey: string = 'inventory';

  override _getDefaultRowActions() {
    return [
      {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowActionV2<typeof EditButton>,
      {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item,
        }),
      } satisfies ItemRowActionV2<typeof DeleteButton>,
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
      } satisfies ItemRowActionV2<typeof CharacterSheetTabToggleButton>,
      {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemRowActionV2<typeof MenuButton>,
    ];
  }
}

export const FeatureRowActionRuntime = new FeatureRowActionRuntimeImpl();
