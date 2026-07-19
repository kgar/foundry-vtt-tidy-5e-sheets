import type { EffectRowAction } from 'src/types/types';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import EffectToggleButton from 'src/components/table-quadrone/table-buttons/EffectToggleButton.svelte';
import { CONSTANTS } from 'src/constants';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EffectRowActionRuntimeImpl extends RowActionRuntimeBase<EffectRowAction> {
  settingKey: string = 'effect';

  override _getDefaultRowActions() {
    return [
      {
        component: EffectToggleButton,
        props: (args) => ({
          effect: args.effect,
        }),
        condition: (args) =>
          args.sheetDocument.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR ||
          args.rowDocument.type !== CONSTANTS.EFFECT_TYPE_ENCHANTMENT,
      } satisfies EffectRowAction<typeof EffectToggleButton>,
      {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.effect }),
      } satisfies EffectRowAction<typeof EditButton>,

      {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.effect,
        }),
      } satisfies EffectRowAction<typeof DeleteButton>,
      {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies EffectRowAction<typeof MenuButton>,
    ];
  }
}

export const EffectRowActionRuntime = new EffectRowActionRuntimeImpl();
