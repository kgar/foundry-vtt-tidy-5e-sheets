import type { Item5e } from 'src/types/item.types';
import type {
  ActorSheetQuadroneContext,
  ActorRowAction,
  AdvancementRowAction,
  EncounterCombatantMemberRowAction,
  ItemRowAction,
  VehicleSheetQuadroneContext,
} from 'src/types/types';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import EncounterCombatInclusionToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatInclusionToggle.svelte';
import EncounterAddAsCombatPlaceholder from 'src/components/table-quadrone/table-buttons/EncounterAddAsCombatPlaceholder.svelte';
import EncounterCombatVisibilityToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatVisibilityToggle.svelte';
import DeleteEncounterEntityButton from 'src/components/table-quadrone/table-buttons/DeleteEncounterEntityButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import type { CrewArea5e } from 'src/foundry/foundry.types';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';
import { foundryCoreSettings } from 'src/settings/settings.svelte';

class TableRowActionsRuntime {
  getItemAdvancementRowActions(unlocked: boolean, item: Item5e) {
    let result: AdvancementRowAction[] = [];

    if (unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({
          doc: item.system.advancement?.get(args.id),
        }),
      } satisfies AdvancementRowAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: item.system.advancement?.get(args.id),
          deleteFn: () =>
            item.system.advancement
              ?.get(args.id)
              ?.deleteDialog({ sheet: item }),
        }),
      } satisfies AdvancementRowAction<typeof DeleteButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '.advancement-item',
      }),
    } satisfies ItemRowAction<typeof MenuButton>);

    return result;
  }

  // TODO: Determine how to make managing row action styles less hardcoded and more configured.
  calculateRowActionWidthRems(rowActionCount: number) {
    let paddingX = 0.1875;
    let buttonWidth = 1.5;
    return buttonWidth * rowActionCount + paddingX;
  }

  getRowActionWidthInfo<TEntry>(
    entries: TEntry[],
    rowActionFn: (entry: TEntry) => any[] | undefined,
  ) {
    let maxRowActionsCount = 1;

    for (const entry of entries) {
      maxRowActionsCount = Math.max(
        maxRowActionsCount,
        (rowActionFn(entry) ?? []).length,
      );
    }

    const widthRems = this.calculateRowActionWidthRems(maxRowActionsCount);
    const widthPx = widthRems * foundryCoreSettings.value.fontSizePx;

    return {
      maxRowActionsCount,
      widthRems,
      widthPx,
    };
  }
}

const singleton = new TableRowActionsRuntime();

export default singleton;
