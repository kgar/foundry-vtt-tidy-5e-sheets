import type { EncounterCombatantMemberRowAction } from 'src/types/types';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import EncounterCombatInclusionToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatInclusionToggle.svelte';
import EncounterAddAsCombatPlaceholder from 'src/components/table-quadrone/table-buttons/EncounterAddAsCombatPlaceholder.svelte';
import EncounterCombatVisibilityToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatVisibilityToggle.svelte';
import DeleteEncounterEntityButton from 'src/components/table-quadrone/table-buttons/DeleteEncounterEntityButton.svelte';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EncounterCombatMemberRowActionRuntimeImpl extends RowActionRuntimeBase<EncounterCombatantMemberRowAction> {
  settingKey: string = 'encounterCombatMember';

  override _getDefaultRowActions() {
    return [
      {
        component: EncounterAddAsCombatPlaceholder,
        condition: (args) => args.data.owner,
        props: () => ({}),
      } satisfies EncounterCombatantMemberRowAction<
        typeof EncounterAddAsCombatPlaceholder
      >,
      {
        component: EncounterCombatVisibilityToggle,
        condition: (args) => args.data.owner,
        props: (args) => ({
          rowContext: args,
        }),
      } satisfies EncounterCombatantMemberRowAction<
        typeof EncounterCombatVisibilityToggle
      >,
      {
        component: EncounterCombatInclusionToggle,
        condition: (args) => args.data.owner,
        props: (args) => ({
          rowContext: args,
        }),
      } satisfies EncounterCombatantMemberRowAction<
        typeof EncounterCombatInclusionToggle
      >,
      {
        component: DeleteEncounterEntityButton,

        condition: (args) => args.data.unlocked,
        props: (args) => ({
          rowContext: args,
        }),
      } satisfies EncounterCombatantMemberRowAction<
        typeof DeleteEncounterEntityButton
      >,
      {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies EncounterCombatantMemberRowAction<typeof MenuButton>,
    ];
  }
}

export const EncounterCombatMemberRowActionRuntime =
  new EncounterCombatMemberRowActionRuntimeImpl();
