<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getModifierData } from 'src/utils/formatting';
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import type { Actor5e } from 'src/types/types';

  const localize = FoundryAdapter.localize;

  type GroupTool = {
    key: string;
    label: string;
    members: Actor5e[];
  };

  interface Props {
    sheetDocument: any;
  }

  let { sheetDocument }: Props = $props();

  let tooltip: HTMLElement;

  let tool: GroupTool = $state({
    key: '',
    label: '',
    members: [],
  });

  let highestScore = $derived(
    tool.members.reduce(
      (prev, curr) => Math.max(prev, curr.system.tools[tool.key]?.total),
      0,
    ),
  );

  export async function tryShow(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    hoveredTool: GroupTool,
  ): Promise<any> {
    if (!hoveredTool.members.length) {
      return;
    }

    tool = hoveredTool;

    const target = event?.currentTarget;

    await tick();

    Tooltip.show(target, tooltip.outerHTML, getThemeV2(sheetDocument));
  }
</script>

<div class="hidden">
  <div bind:this={tooltip} class="document-list-summary-tooltip">
    <h3 class="font-title-medium color-text-default">{tool.label}</h3>
    <hr />
    <ul>
      <li class="group-tool-grid group-tooltip-header">
        <div class=""></div>
        <div class=""></div>
        <div class="text-align-right font-label-small color-text-lightest">{localize('DND5E.Passive')}</div> 
        <div class="text-align-right font-label-small color-text-lightest">{localize('DND5E.Proficiency')}</div>
      </li>
      {#each tool.members as member}
        {@const score = member.system.tools[tool.key]?.total}
        {@const modifier = getModifierData(score)}
        <li class="group-tool-grid">
          <!-- TODO add token shape to class list  -->
          <div
            class="item-image TOKEN-SHAPE"
            style="background-image: url('{member.img}')"
          ></div>
          <div class="item-name truncate">{member.name}</div>
          <div class="text-align-right">
            {#if score === highestScore}
              <i class="fa-solid fa-award highlighted"></i>
              <!-- TODO: Temp placeholder to demonstrate the highest score holder -->
            {/if}
            <span class="font-body-medium color-text-lighter">{modifier.sign}</span>
            <span class="font-label-medium color-text-default">{modifier.value}</span>
          </div>
          <div class="text-align-right">
            <i
              class="{FoundryAdapter.getProficiencyIconClass(
                member.system.tools[tool.key]?.value,
              )} fa-fw"
            ></i>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
