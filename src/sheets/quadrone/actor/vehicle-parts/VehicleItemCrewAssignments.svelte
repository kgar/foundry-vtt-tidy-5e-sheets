<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import type { Actor5e, VehicleItemQuadroneContext } from 'src/types/types';
  import type { Item5e } from 'src/types/item.types';
  import { EventHelper } from 'src/utils/events';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

  type Props = {
    ctx: VehicleItemQuadroneContext;
    item: Item5e;
  };

  let { ctx, item }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getVehicleSheetQuadroneContext());
  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  function onEmptySlotClicked(
    ev: (MouseEvent | KeyboardEvent) & {
      currentTarget: EventTarget & HTMLAnchorElement;
    },
  ) {
    if (context.unlocked) {
      EventHelper.triggerContextMenu(ev);
      return;
    }

    context.sheet.browseAssignActor(item);
  }
</script>

<TidyTable key="assigned" toggleable={false} class="crew-and-passengers-table">
  {#snippet header()}
  <TidyTableHeaderRow class="no-background">
      <TidyTableHeaderCell primary={true} class="header-label-cell">
        <h3>
          {localize('DND5E.VEHICLE.Crew.Label')}
        </h3>
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    <TidyTableRow>
      <TidyTableCell primary={true} class="occupants-list">
        <ul class="slots assigned unlist">
          {#each ctx.crew as slot}
            {#if slot.brokenLink}
              <li
                class="slot member-slot broken"
                data-uuid={slot.actor.uuid}
                data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER}
              >
                <!-- svelte-ignore a11y_missing_attribute -->
                <a
                  role="button"
                  tabindex="0"
                  data-action="showContextMenu"
                  data-target-selector="[data-context-menu]"
                  data-tooltip=""
                  aria-label={localize('TIDY5E.COMMON.BrokenLink')}
                >
                  <i class="fa-solid fa-link-slash broken-link-icon"></i>
                </a>
              </li>
            {:else if slot.actor}
              {const memberAttributes = $derived(
                context.editable && !context.unlocked
                  ? {
                      'data-action': 'showDocument',
                      'data-uuid': slot.actor.uuid,
                    }
                  : context.editable && context.unlocked
                    ? {
                        'data-action': 'showContextMenu',
                        'data-target-selector': '[data-context-menu]',
                      }
                    : {},
              )}
              <li
                class="slot member-slot"
                data-uuid={slot.actor.uuid}
                data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER}
              >
                <a
                  {...memberAttributes}
                  data-tooltip=""
                  aria-label={slot.actor.name}
                >
                  <img src={slot.actor.img} alt={slot.actor.name} />
                </a>
              </li>
            {:else}
              <li
                class="slot member-slot empty"
                data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER}
              >
                  <!-- svelte-ignore a11y_missing_attribute -->
                <a
                  role="button"
                  data-keyboard-focus
                  tabindex="0"
                  aria-label={localize('TIDY5E.COMMON.Action.AddNamed', localize('DND5E.VEHICLE.Crew.Label'))}
                  data-tooltip={localize('TIDY5E.COMMON.Action.AddNamed', localize('DND5E.VEHICLE.Crew.Label'))}
                  onclick={(ev) => context.editable && onEmptySlotClicked(ev)}
                  onkeydown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      context.editable && onEmptySlotClicked(ev);
                    }
                  }}
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
