<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { GroupSkill } from 'src/types/group.types';
  import { formatAsModifier } from 'src/utils/formatting';
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';

  interface Props {
    sheetDocument: any;
  }

  let { sheetDocument }: Props = $props();

  let tooltip: HTMLElement;

  let skill: Omit<GroupSkill, 'total'> = $state({
    key: '',
    label: '',
    members: [],
  });

  let highestScore = $derived(
    skill.members.reduce(
      (prev, curr) => Math.max(prev, curr.system.skills[skill.key]?.total),
      0,
    ),
  );

  export async function tryShow(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    hoveredSkill: Omit<GroupSkill, 'total'>,
  ): Promise<any> {
    if (!hoveredSkill.members.length) {
      return;
    }

    skill = hoveredSkill;

    const target = event?.currentTarget;

    await tick();

    Tooltip.show(target, tooltip.outerHTML, getThemeV2(sheetDocument));
  }
</script>

<div class="hidden">
  <div bind:this={tooltip} class="document-list-summary-tooltip">
    <h3>{skill.label}</h3>
    <hr />
    <ul>
      {#each skill.members as member}
        {@const score = member.system.skills[skill.key]?.total}
        <li class="group-skill-grid">
          <div
            class="item-image"
            style="background-image: url('{member.img}')"
          ></div>
          <div class="item-name truncate">{member.name}</div>
          <div class="text-align-center">
            {formatAsModifier(score)}
          </div>
          <div class="text-align-center">
            ({member.system.skills[skill.key]?.passive})
          </div>
          <div class="text-align-center">
            {#if score === highestScore}
              <i class="fa-solid fa-trophy"></i>
            {/if}
            <i
              class="{FoundryAdapter.getProficiencyIconClass(
                member.system.skills[skill.key]?.proficient,
              )} fa-fw"
            ></i>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
