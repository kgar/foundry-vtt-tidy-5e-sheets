<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import GroupMember from '../group-parts/GroupMember.svelte';
  import GroupTabSidebar from '../group-parts/group-tab-sidebar/GroupTabSidebar.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  

  let context = $derived(getGroupSheetQuadroneContext());

  let characters = $derived(context.members.character.members);
  let npcs = $derived(context.members.npc.members);
  let vehicles = $derived(context.members.vehicle.members);

  const localize = FoundryAdapter.localize;

  interface Props {
    allowFavorites?: boolean;
    cssClass?: string | null;
    meterColumnWidth?: string;
    inspirationColumnWidth?: string;
    acColumnWidth?: string;
  }

  let {
    meterColumnWidth = '3.75rem',
    inspirationColumnWidth = '4.5rem',
    acColumnWidth = '3rem',
  }: Props = $props();
</script>

<GroupTabSidebar />

<section class="group-members-content flexcol">
  {#if characters.length}
  <section class="tidy-table">
    <TidyTable key="characters">
      {#snippet header()}
        {@const visibleItemCount = characters.length}
        <TidyTableHeaderRow>
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.character.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            columnWidth={inspirationColumnWidth}
            title={localize('DND5E.Inspiration')}
          >
            {localize('DND5E.Inspiration')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            columnWidth={meterColumnWidth}
            title={localize('DND5E.HP')}
          >
            {localize('DND5E.HP')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            columnWidth={meterColumnWidth}
            title={localize('DND5E.HitDie')}
          >
            {localize('DND5E.HitDie')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell 
            columnWidth={acColumnWidth} title={localize('DND5E.AC')}>
            {localize('DND5E.AC')}
          </TidyTableHeaderCell>
          {#if context.enableXp}
          <TidyTableHeaderCell
            title={localize('DND5E.XP')}
            columnWidth={meterColumnWidth}
          >
            {localize('DND5E.ExperiencePoints.Abbreviation')}
          </TidyTableHeaderCell>
          {/if}
          <TidyTableHeaderCell columnWidth="1.75rem" >
            <a class="tidy-table-button"
              title={localize('TYPES.Actor.character')}>
              <i class="fas fa-plus"></i>
            </a>
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        <menu class="members">
          {#each characters as member}
            <li
              class="member-container"
              data-tidy-draggable
              data-member-id={member.actor.id}
            >
              <GroupMember {member} />
            </li>
          {/each}
        </menu>
        <!-- {#each characters as member}
          <TidyTableRow item={member} />
        {/each} -->
      {/snippet}
    </TidyTable>
  </section>
  {/if}

  {#if npcs.length}
  <section class="tidy-table">
    <TidyTable key="npcs">
      {#snippet header()}
        {@const visibleItemCount = npcs.length}
        <TidyTableHeaderRow>
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.npc.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            columnWidth={meterColumnWidth}
            title={localize('DND5E.HP')}
          >
            {localize('DND5E.HP')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            columnWidth={meterColumnWidth}
            title={localize('DND5E.HitDie')}
          >
            {localize('DND5E.HitDie')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell 
            columnWidth={acColumnWidth} title={localize('DND5E.AC')}>
            {localize('DND5E.AC')}
          </TidyTableHeaderCell>
          {#if context.enableXp}
          <TidyTableHeaderCell
            title={localize('DND5E.XP')}
            columnWidth={meterColumnWidth}
          >
            {localize('DND5E.ExperiencePoints.Abbreviation')}
          </TidyTableHeaderCell>
          {/if}
          <TidyTableHeaderCell columnWidth="1.75rem" >
            <a class="tidy-table-button"
              title={localize('TYPES.Actor.npc')}>
              <i class="fas fa-plus"></i>
            </a>
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        <!-- {#each npcs as member}
          <TidyTableRow item={member} />
        {/each} -->
        <menu class="members">
          {#each npcs as member}
            <li
              class="member-container"
              data-tidy-draggable
              data-member-id={member.actor.id}
            >
              <GroupMember {member} />
            </li>
          {/each}
        </menu>
      {/snippet}
    </TidyTable>
  </section>
  {/if}

  {#if vehicles.length}
  <section class="tidy-table">
    <TidyTable key="vehicles">
      {#snippet header()}
        {@const visibleItemCount = vehicles.length}
        <TidyTableHeaderRow>
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.vehicle.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            columnWidth={meterColumnWidth}
            title={localize('DND5E.HP')}
          >
            {localize('DND5E.HP')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell 
            columnWidth={acColumnWidth} title={localize('DND5E.AC')}>
            {localize('DND5E.AC')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell 
            columnWidth={acColumnWidth} title={localize('DND5E.HITPOINTS.DT.Abbr')}>
            {localize('DND5E.HITPOINTS.DT.Abbr')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            columnWidth={meterColumnWidth}
            title={localize('DND5E.VehicleCrew')}
          >
            {localize('DND5E.VehicleCrew')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            columnWidth={meterColumnWidth}
            title={localize('DND5E.VehicleCargo')}
          >
            {localize('DND5E.VehicleCargo')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell columnWidth="1.75rem" >
            <a class="tidy-table-button"
              title={localize('TYPES.Actor.vehicle')}>
              <i class="fas fa-plus"></i>
            </a>
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        <!-- {#each vehicles as member}
          <TidyTableRow item={member} />
        {/each} -->
        <menu class="members">
          {#each vehicles as member}
            <li
              class="member-container"
              data-tidy-draggable
              data-member-id={member.actor.id}
            >
              <GroupMember {member} />
            </li>
          {/each}
        </menu>
      {/snippet}
    </TidyTable>
  </section>
  {/if}
</section>