import type { ItemRowActionV2 } from 'src/types/types';
import SpellButton from 'src/components/table-quadrone/table-buttons/SpellButton.svelte';
import CharacterSheetTabToggleButton from 'src/components/table-quadrone/table-buttons/CharacterSheetTabToggleButton.svelte';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import OpenActivityButton from 'src/components/table-quadrone/table-buttons/OpenActivityButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class SpellRowActionRuntimeImpl extends RowActionRuntimeBase<ItemRowActionV2> {
  settingKey: string = 'spell';

  override _getDefaultRowActions() {
    return [
      {
        component: SpellButton,
        condition: (args) =>
          args.data.owner &&
          !args.rowDocument.system.linkedActivity &&
          // TODO: remove doc type logic after partitioning
          (args.sheetDocument.system.isCharacter ||
            args.sheetDocument.system.isNPC),
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowActionV2<typeof SpellButton>,

      {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowActionV2<typeof EditButton>,

      {
        component: DeleteButton,
        props: (args) => ({
          doc: args.item,
        }),
        condition: (args) =>
          args.data.unlocked && !args.rowDocument.system.linkedActivity,
      } satisfies ItemRowActionV2<typeof DeleteButton>,
      {
        component: OpenActivityButton,
        props: (args) => ({
          doc: args.item,
        }),
        condition: (args) =>
          args.data.unlocked && !!args.rowDocument.system.linkedActivity,
      } satisfies ItemRowActionV2<typeof OpenActivityButton>,
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

export const SpellRowActionRuntime = new SpellRowActionRuntimeImpl();
