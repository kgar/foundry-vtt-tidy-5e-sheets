<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import GroupMemberList from '../parts/GroupMemberList.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
    
  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

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
  {#each $context.memberSections as section (section.key)}
    <GroupMemberList {section} />
  {/each}
</section>
