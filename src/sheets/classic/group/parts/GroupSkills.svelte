<script lang="ts">
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import GroupSkillTooltip from 'src/tooltips/GroupSkillTooltip.svelte';
  import { formatAsModifier } from 'src/utils/formatting';

  const context = $derived(getGroupSheetClassicContext());

  let groupSkillTooltip: GroupSkillTooltip;
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each context.groupSkills as groupSkill}
    <span
      class="tag"
      data-tooltip-direction="UP"
      onmouseover={(ev) =>
        groupSkillTooltip.tryShow(ev, {
          key: groupSkill.key,
          label: groupSkill.label,
          members: groupSkill.members.map((m) => ({ actor: m })),
        })}
    >
      {groupSkill.label}
      {formatAsModifier(groupSkill.total)}
    </span>
  {/each}
</div>

<GroupSkillTooltip
  bind:this={groupSkillTooltip}
  sheetDocument={context.document}
/>
