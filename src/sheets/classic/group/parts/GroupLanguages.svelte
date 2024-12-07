<script lang="ts">
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import GroupLanguageTooltip from 'src/tooltips/GroupLanguageTooltip.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import type { GroupLanguage } from 'src/types/group.types';
  import type { Actor5e } from 'src/types/types';
  import { tick } from 'svelte';

  let context = getGroupSheetClassicContext();

  let groupLanguageTooltip: GroupLanguageTooltip;
  let hoveredLanguage = $state('');
  let hoveredMembers: Actor5e[] = $state([]);

  async function showGroupLanguageTooltip(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    groupLanguage: GroupLanguage,
  ): Promise<any> {
    if (!groupLanguage.members.length) {
      return;
    }

    hoveredLanguage = groupLanguage.label;
    hoveredMembers = groupLanguage.members;

    const target = event?.currentTarget;

    await tick();

    Tooltip.show(target, groupLanguageTooltip.getMarkup());
  }
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each context.groupLanguages as groupLanguage}
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
