import type { Item5e } from 'src/types/item.types';
import type {
  ActivityRowAction,
  Actor5e,
  ActorSheetQuadroneContext,
  ActorRowAction,
  AdvancementRowAction,
  CharacterSheetQuadroneContext,
  DocumentSheetQuadroneContext,
  EffectRowAction,
  EncounterCombatantMemberRowAction,
  ItemRowAction,
  NpcSheetQuadroneContext,
  VehicleSheetQuadroneContext,
  TableRowAction,
  ItemRowActionV2,
} from 'src/types/types';
import SpellButton from 'src/components/table-quadrone/table-buttons/SpellButton.svelte';
import EquipButton from 'src/components/table-quadrone/table-buttons/EquipButton.svelte';
import CharacterSheetTabToggleButton from 'src/components/table-quadrone/table-buttons/CharacterSheetTabToggleButton.svelte';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import type { ContainerContentsRowActionsContext } from '../types';
import OpenActivityButton from 'src/components/table-quadrone/table-buttons/OpenActivityButton.svelte';
import EffectToggleButton from 'src/components/table-quadrone/table-buttons/EffectToggleButton.svelte';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import EncounterCombatInclusionToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatInclusionToggle.svelte';
import EncounterAddAsCombatPlaceholder from 'src/components/table-quadrone/table-buttons/EncounterAddAsCombatPlaceholder.svelte';
import EncounterCombatVisibilityToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatVisibilityToggle.svelte';
import DeleteEncounterEntityButton from 'src/components/table-quadrone/table-buttons/DeleteEncounterEntityButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import type { CrewArea5e } from 'src/foundry/foundry.types';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';
import AttuneButton from 'src/components/table-quadrone/table-buttons/AttuneButton.svelte';
import { foundryCoreSettings } from 'src/settings/settings.svelte';
import type { Component } from 'svelte';
import { checkCondition } from 'src/utils/iteration';
import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ActivityRowActionRuntimeImpl extends RowActionRuntimeBase<ActivityRowAction> {
  settingKey: string = 'effect';

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
