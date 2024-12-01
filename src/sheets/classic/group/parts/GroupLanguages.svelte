<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import GroupLanguageTooltip from 'src/tooltips/GroupLanguageTooltip.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import type {
    GroupLanguage,
    GroupSheetClassicContext,
  } from 'src/types/group.types';
  import type { Actor5e } from 'src/types/types';
  import { getContext } from 'svelte';
  import { type Readable } from 'svelte/store';

  let context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let groupLanguageTooltip: GroupLanguageTooltip = $state();
  let hoveredLanguage = $state('');
  let hoveredMembers: Actor5e[] = $state([]);

  function showGroupLanguageTooltip(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    groupLanguage: GroupLanguage,
  ): any {
    if (!groupLanguage.members.length) {
      return;
    }

    hoveredLanguage = groupLanguage.label;
    hoveredMembers = groupLanguage.members;

    const target = event?.currentTarget;
    setTimeout(() => {
      Tooltip.show(target, groupLanguageTooltip.getMarkup());
    });
  }
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each $context.groupLanguages as groupLanguage}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
    <span
      data-tooltip-direction="UP"
      class="tag"
      onmouseover={(ev) => showGroupLanguageTooltip(ev, groupLanguage)}
    >
      {groupLanguage.label}
      {#if groupLanguage.members.length > 1}
        ({groupLanguage.members.length})
      {/if}
    </span>
  {/each}
</div>
<div class="hidden">
  <GroupLanguageTooltip
    bind:this={groupLanguageTooltip}
    language={hoveredLanguage}
    members={hoveredMembers}
  />
</div>
