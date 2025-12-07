<script lang="ts">
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from 'src/components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import type { Actor5e, VehicleMemberSection } from 'src/types/types';

  const context = $derived(getVehicleSheetContext());

  const localize = FoundryAdapter.localize;

  const classicControlsEditableRowBaseWidth = '1.5rem';
</script>

<div class="scroll-container flex-column small-gap">
  <!-- Crew -->
  {@render MemberTable(context.crew, 'crew')}

  <!-- Passengers -->
  {@render MemberTable(context.passengers, 'passengers')}

  <!-- Draft -->
  {@render MemberTable(context.draft, 'draft')}
</div>

{#snippet MemberTable(section: VehicleMemberSection, area: string)}
  {@const mode = section.members.length ? 'section' : 'dropzone'}
  {#if mode === 'section'}
    <div style="display: contents;" class="member-list-container">
      <ItemTable key={section.key} data-area={area}>
        {#snippet header()}
          <ItemTableHeaderRow>
            <ItemTableColumn primary={true}>
              {localize(section.label)}
              <span class="item-table-count">{section.members.length}</span>
            </ItemTableColumn>
            <ItemTableColumn
              cssClass="items-header-quantity"
              baseWidth={'4.5rem'}
            >
              {localize('DND5E.Quantity')}
            </ItemTableColumn>
            {#if context.editable && context.unlocked}
              <ItemTableColumn
                baseWidth={classicControlsEditableRowBaseWidth}
              />
            {/if}
          </ItemTableHeaderRow>
        {/snippet}
        {#snippet body()}
          {#each section.members as member}
            <ItemTableRow getDragData={() => {
              const data = member.actor.toDragData();
              return data;
            }}>
              <!-- Image -->
              <ItemTableCell primary={true}>
                <a
                  class="item-use-button"
                  onclick={(event) =>
                    member.actor.sheet.render({ force: true })}
                >
                  <img
                    class="item-image always-visible"
                    alt={member.actor.name}
                    src={member.actor.img}
                    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                      .ACTOR_PORTRAIT_IMAGE}
                  />
                </a>
                <!-- Name -->
                <a
                  onclick={(event) =>
                    member.actor.sheet.render({ force: true })}
                  class="member-name truncate"
                >
                  <span class="truncate flex-1">{member.actor.name}</span>
                </a>
                <!-- TODO: Open actor on click -->
              </ItemTableCell>
              <ItemTableCell baseWidth={'4.5rem'}>
                <input
                  type="number"
                  value={member.quantity}
                  onchange={(ev) =>
                    context.actor.system.adjustCrew(
                      area,
                      member.actor.uuid,
                      ev.currentTarget.value,
                    )}
                  class="text-align-center"
                  disabled={!context.editable}
                />
              </ItemTableCell>
              {#if context.unlocked}
                <ItemTableCell baseWidth={classicControlsEditableRowBaseWidth}>
                  <ItemDeleteControl
                    item={member.actor}
                    deleteFn={(actor: Actor5e) =>
                      context.actor.system.adjustCrew(area, actor.uuid, 0)}
                  />
                </ItemTableCell>
              {/if}
            </ItemTableRow>
          {/each}
        {/snippet}
      </ItemTable>
    </div>
  {:else if mode === 'dropzone'}
    <a
      class="drop-zone highlight-on-hover"
      data-action="browseActors"
      data-area={area}
    >
      {localize(section.dropLabel)}
    </a>
  {/if}
{/snippet}

<style>
  .member-name {
    flex: 1 1 0.0625rem;
    min-width: 0;
    display: flex;
    align-items: center;
  }
</style>
