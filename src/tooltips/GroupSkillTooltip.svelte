<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { formatAsModifier, getModifierData } from 'src/utils/formatting';
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import type { Actor5e } from 'src/types/types';
  import type { PortraitShape } from 'src/theme/theme-quadrone.types';

  const localize = FoundryAdapter.localize;

  interface Props {
    sheetDocument: any;
  }

  let { sheetDocument }: Props = $props();

  let tooltip: HTMLElement;

  type GroupSkill = {
    key: string;
    label: string;
    members: {
      actor: Actor5e;
      portrait?: { shape: PortraitShape };
      highlightColor?: string;
    }[];
  };

  let skill: GroupSkill = $state({
    key: '',
    label: '',
    members: [],
  });

  let highestScore = $derived(
    skill.members.reduce(
      (prev, curr) =>
        Math.max(prev, curr.actor.system.skills[skill.key]?.total),
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
    <h3 class="font-title-medium color-text-default">{skill.label}</h3>
    <hr />
    <ul>
      <li class="group-skill-grid group-tooltip-header">
        <div class=""></div>
        <div class=""></div>
        <div class="text-align-right font-label-small color-text-lightest">
          {localize('DND5E.AbilityModifierShort')}
        </div>
        <div class="text-align-right font-label-small color-text-lightest">
          {localize('DND5E.Passive')}
        </div>
        <div class="text-align-right font-label-small color-text-lightest">
          {localize('DND5E.Proficiency')}
        </div>
      </li>
      {#each skill.members as member}
        {@const score = member.actor.system.skills[skill.key]?.total}
        {@const modifier = getModifierData(score)}
        <li class="group-skill-grid">
          <!-- TODO add token shape to class list  -->
          <div
            class={['item-image', member.portrait?.shape ?? 'round']}
            style="background-image: url('{member.actor.img}')"
          ></div>
          <div class="item-name truncate">{member.actor.name}</div>
          <div class="text-align-right">
            {#if score === highestScore}
              <i
                class="fa-solid fa-award color-text-gold-emphasis highlighted"
                style:color={member.highlightColor}
              ></i>
            {/if}
            <span class="font-body-medium color-text-lighter"
              >{modifier.sign}</span
            >
            <span class="font-label-medium color-text-default"
              >{modifier.value}</span
            >
          </div>
          <div class="text-align-right">
            <span class="font-label-medium color-text-lighter"
              >{member.actor.system.skills[skill.key]?.passive}</span
            >
          </div>
          <div class="text-align-right">
            <i
              class="{FoundryAdapter.getProficiencyIconClass(
                member.actor.system.skills[skill.key]?.proficient,
              )} fa-fw"
            ></i>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
