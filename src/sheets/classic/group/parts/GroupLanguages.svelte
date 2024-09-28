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

  let groupLanguageTooltip: GroupLanguageTooltip;
  let hoveredLanguage = '';
  let hoveredMembers: Actor5e[] = [];

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
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <span
      data-tooltip-direction="UP"
      class="tag"
      on:mouseover={(ev) => showGroupLanguageTooltip(ev, groupLanguage)}
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
