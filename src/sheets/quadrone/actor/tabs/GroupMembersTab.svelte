<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import GroupMember from '../group-parts/GroupMember.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  let characters = $derived(context.members.character.members);
  let npcs = $derived(context.members.npc.members);
  let vehicles = $derived(context.members.vehicle.members);

  const localize = FoundryAdapter.localize;
</script>

<aside class="sidebar">sidebar</aside>
<section class="group-members-content">
  {#if characters.length}
    <section class="tidy-table character-traits">
      <div class="tidy-table-header-row theme-dark">
        <h3>{localize(context.members.character.label)}</h3>
      </div>
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
    </section>
  {/if}
  {#if npcs.length}
    <section class="tidy-table character-traits">
      <div class="tidy-table-header-row theme-dark">
        <h3>{localize(context.members.npc.label)}</h3>
      </div>
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
    </section>
  {/if}
  {#if vehicles.length}
    <section class="tidy-table character-traits">
      <div class="tidy-table-header-row theme-dark">
        <h3>{localize(context.members.vehicle.label)}</h3>
      </div>
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
    </section>
  {/if}
</section>
