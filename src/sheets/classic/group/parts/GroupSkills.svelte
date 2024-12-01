<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import GroupSkillTooltip from 'src/tooltips/GroupSkillTooltip.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import type {
    GroupSheetClassicContext,
    GroupSkill,
  } from 'src/types/group.types';
  import { formatAsModifier } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import { type Readable } from 'svelte/store';

  let context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let groupSkillTooltip: GroupSkillTooltip;
  let hoveredSkill: GroupSkill = $state({
    key: '',
    label: '',
    members: [],
    total: Number.NEGATIVE_INFINITY,
  });

  // kgar-migration-task - does it work as advertized?
  function showGroupLanguageTooltip(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    groupSkill: GroupSkill,
  ): any {
    if (!groupSkill.members.length) {
      return;
    }

    hoveredSkill = groupSkill;

    const target = event?.currentTarget;

    setTimeout(() => {
      Tooltip.show(target, groupSkillTooltip.getMarkup());
    });
  }
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each $context.groupSkills as groupSkill}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
    <span
      class="tag"
      onmouseover={(ev) => showGroupLanguageTooltip(ev, groupSkill)}
    >
      {groupSkill.label}
      {formatAsModifier(groupSkill.total)}
    </span>
  {/each}
</div>
<div class="hidden">
  <GroupSkillTooltip bind:this={groupSkillTooltip} skill={hoveredSkill} />
</div>
