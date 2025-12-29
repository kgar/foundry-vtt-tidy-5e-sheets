<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import { VehicleMemberColumnRuntime } from 'src/runtime/tables/VehicleCrewMemberColumnRuntime';
  import type {
    VehicleItemContext,
    VehicleItemCrewAssignment,
  } from 'src/types/types';
  import type { Item5e } from 'src/types/item.types';

  type Props = {
    ctx: VehicleItemContext;
    item: Item5e;
  };

  let { ctx, item }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getVehicleSheetQuadroneContext());

  function onSlotClick(
    ev: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
    item: Item5e,
  ): any {
    ui.notifications.info('TODO: Show options to assign someone.');
    // Show context options to select an available crewmate; include option Add from Compendium
  }

  function onMemberClick(
    ev: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
    slot: VehicleItemCrewAssignment,
    item: Item5e,
  ): any {
    if (!slot.actor) {
      return;
    }

    if (context.unlocked) {
      return context.sheet._unassignCrew(slot.actor, item);
    }

    return slot.actor.sheet.render({ force: true });
  }

  function onBrokenLinkClick(
    ev: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
    slot: VehicleItemCrewAssignment,
    item: Item5e,
  ): any {
    ui.notifications.info('TODO: Unassign this UUID');
    if (slot.actor?.uuid) {
      context.sheet._unassignCrew(slot.actor, item);
    }
  }
</script>

<TidyTable key="assigned" toggleable={false}>
  {#snippet header()}
    <TidyTableHeaderRow class="theme-dark">
      <TidyTableHeaderCell primary={true} class="header-label-cell">
        <h3>
          {localize('DND5E.VEHICLE.Crew.Label')}
        </h3>
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    <TidyTableRow>
      <TidyTableCell primary={true}>
        <ul class="slots assigned unlist">
          {#each ctx.crew as slot}
            {#if slot.brokenLink}
              <li class="slot member-slot broken">
                <a
                  onclick={(ev) =>
                    context.editable && onBrokenLinkClick(ev, slot, item)}
                >
                  <i class="fa-solid fa-link-slash broken-link-icon"></i>
                </a>
              </li>
            {:else if slot.actor}
              <li class="slot member-slot">
                <a
                  onclick={(ev) =>
                    context.editable && onMemberClick(ev, slot, item)}
                >
                  <img src={slot.actor.img} alt={slot.actor.name} />
                </a>
              </li>
            {:else}
              <li class="slot member-slot empty">
                <a
                  onclick={(ev) => context.editable && onSlotClick(ev, item)}
                  class="button button-tertiary button-icon-only"
                >
                  <i class="far fa-user"></i>
                </a>
              </li>
            {/if}
          {/each}
        </ul>
      </TidyTableCell>
    </TidyTableRow>
  {/snippet}
</TidyTable>
