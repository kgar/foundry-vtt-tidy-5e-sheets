<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import GroupMemberList from '../parts/GroupMemberList.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  $: utilityBarCommands =
    $context.utilities[tabId]?.utilityToolbarCommands ?? [];
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  <!-- Filters? Pinned Filters? Perhaps filters related to senses, immunities, etc. -->
  {#each utilityBarCommands as command (command.title)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      on:execute={(ev) => command.execute?.(ev.detail)}
    />
  {/each}
</UtilityToolbar>

<section
  class="scroll-container flex-column small-gap"
  data-tidy-track-scroll-y
>
  {#if $context.isGM}
    <div class="flex-row justify-content-center small-gap">
      <button
        type="button"
        class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
        on:click={() => $context.actor.sheet.award()}
      >
        <i class="fa-solid fa-trophy"></i>
        {localize('DND5E.Award.Action')}
      </button>
      <button
        type="button"
        class="group-action-button flex-row small-gap flex-grow-0 flex-basis-max-content"
        on:click={() => $context.actor.system.placeMembers()}
      >
        <i class="fa-solid fa-location-dot"></i>
        {localize('DND5E.Group.PlaceMembers')}
      </button>
      <button
        type="button"
        class="group-action-button flex-row small-gap rest-button flex-grow-0 flex-basis-max-content"
        on:click={() => $context.actor.shortRest({ advanceTime: true })}
      >
        <i class="fa-solid fa-utensils"></i>
        {localize('DND5E.ShortRest')}
      </button>
      <button
        type="button"
        class="group-action-button flex-row small-gap rest-button flex-grow-0 flex-basis-max-content"
        on:click={() => $context.actor.longRest({ advanceTime: true })}
      >
        <i class="fa-solid fa-campground"></i>
        {localize('DND5E.LongRest')}
      </button>
    </div>
  {/if}

  {#each $context.memberSections as section (section.key)}
    <GroupMemberList {section} />
  {/each}
</section>
