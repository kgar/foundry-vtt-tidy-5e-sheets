<script lang="ts">
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import { getThemeV2 } from 'src/theme/theme';
  import GroupLanguageTooltip from 'src/tooltips/GroupLanguageTooltip.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import type { GroupLanguage } from 'src/types/group.types';
  import type { Actor5e } from 'src/types/types';
  import { tick } from 'svelte';

  let context = $derived(getGroupSheetClassicContext());

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

    Tooltip.show(
      target,
      groupLanguageTooltip.getMarkup(),
      getThemeV2(context.actor),
    );
  }
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each context.groupLanguages as groupLanguage}
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
