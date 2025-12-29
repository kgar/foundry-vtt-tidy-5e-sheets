<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import type { VehicleItemContext } from 'src/types/types';
  import type { Item5e } from 'src/types/item.types';
  import { EventHelper } from 'src/utils/events';

  type Props = {
    ctx: VehicleItemContext;
    item: Item5e;
  };

  let { ctx, item }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getVehicleSheetQuadroneContext());
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
              <li
                class="slot member-slot broken"
                data-member-uuid={slot.actor.uuid}
                data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER}
              >
                <a
                  onclick={(ev) =>
                    context.editable && EventHelper.triggerContextMenu(ev)}
                >
                  <i class="fa-solid fa-link-slash broken-link-icon"></i>
                </a>
              </li>
            {:else if slot.actor}
              <li
                class="slot member-slot"
                data-member-uuid={slot.actor.uuid}
                data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER}
              >
                <a
                  onclick={(ev) =>
                    context.editable && EventHelper.triggerContextMenu(ev)}
                >
                  <img src={slot.actor.img} alt={slot.actor.name} />
                </a>
              </li>
            {:else}
              <li
                class="slot member-slot empty"
                data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER}
              >
                <a
                  onclick={(ev) =>
                    context.editable && EventHelper.triggerContextMenu(ev)}
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
