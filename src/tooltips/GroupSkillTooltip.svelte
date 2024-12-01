<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { GroupSkill } from 'src/types/group.types';
  import { formatAsModifier } from 'src/utils/formatting';

  interface Props {
    skill: GroupSkill;
  }

  let { skill }: Props = $props();

  let tooltip: HTMLElement = $state();

  export function getMarkup() {
    return tooltip.outerHTML;
  }
</script>

<div bind:this={tooltip} class="document-list-summary-tooltip">
  <h3>{skill.label}</h3>
  <hr />
  <ul>
    {#each skill.members as member}
      <li class="group-skill-grid">
        <div
          class="item-image"
          style="background-image: url('{member.img}')"
        ></div>
        <div class="item-name truncate">{member.name}</div>
        <div class="text-align-center">
          {formatAsModifier(member.system.skills[skill.key]?.total)}
        </div>
        <div class="text-align-center">
          ({member.system.skills[skill.key]?.passive})
        </div>
        <div class="text-align-center">
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
