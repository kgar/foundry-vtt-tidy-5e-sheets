<script lang="ts">
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import GroupSkillTooltip from 'src/tooltips/GroupSkillTooltip.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import type { GroupSkill } from 'src/types/group.types';
  import { formatAsModifier } from 'src/utils/formatting';
  import { tick } from 'svelte';

  const context = $derived(getGroupSheetClassicContext());

  let groupSkillTooltip: GroupSkillTooltip;
  let hoveredSkill: GroupSkill = $state({
    key: '',
    label: '',
    members: [],
    total: Number.NEGATIVE_INFINITY,
  });

  async function showGroupLanguageTooltip(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    groupSkill: GroupSkill,
  ): Promise<any> {
    if (!groupSkill.members.length) {
      return;
    }

    hoveredSkill = groupSkill;

    const target = event?.currentTarget;

    await tick();

    Tooltip.show(target, groupSkillTooltip.getMarkup());
  }
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each context.groupSkills as groupSkill}
    <span
      class="tag"
      data-tooltip-direction="UP"
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
