<script lang="ts">
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import type { Actor5e } from 'src/types/types';

  type GroupTrait = {
    label: string;
    members: {
      actor: Actor5e;
      value?: string;
      units?: string;
    }[];
  };

  interface Props {
    sheetDocument: any;
  }

  let { sheetDocument }: Props = $props();

  let tooltip: HTMLElement;

  let trait: GroupTrait = $state({
    label: '',
    members: [],
  });

  export async function tryShow(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    hoveredTrait: GroupTrait,
  ): Promise<any> {
    if (!hoveredTrait.members.length) {
      return;
    }

    trait = hoveredTrait;

    const target = event?.currentTarget;

    await tick();

    Tooltip.show(target, tooltip.outerHTML, getThemeV2(sheetDocument));
  }
</script>

<div class="hidden">
  <div bind:this={tooltip} class="document-list-summary-tooltip">
    <h3 class="font-title-medium color-text-default">{trait.label}</h3>
    <hr />
    <ul>
      {#each trait.members as member}
        <li class="group-trait-grid">
          <!-- TODO add token shape to class list  -->
          <div
            class="item-image TOKEN-SHAPE"
            style="background-image: url('{member.actor.img}')"
          ></div>
          <div class="item-name truncate">{member.actor.name}</div>
          {#if member.value}
            <div class="text-align-right">
              <span class="font-label-medium color-text-default">{member.value}</span>
              {#if member.units}
                <span class="font-body-medium color-text-lighter">{member.units}</span>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>
