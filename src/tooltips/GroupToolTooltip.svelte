<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { formatAsModifier } from 'src/utils/formatting';
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import type { Actor5e } from 'src/types/types';

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
    <h3>{tool.label}</h3>
    <hr />
    <ul>
      {#each tool.members as member}
        {@const score = member.system.tools[tool.key]?.total}
        <li class="group-tool-grid">
          <div
            class="item-image"
            style="background-image: url('{member.img}')"
          ></div>
          <div class="item-name truncate">{member.name}</div>
          <div class="text-align-center">
            {formatAsModifier(score)}
          </div>
          <div class="text-align-center">
            {#if score === highestScore}
              <i class="fa-solid fa-trophy"></i>
              <!-- TODO: Temp placeholder to demonstrate the highest score holder -->
            {/if}
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
