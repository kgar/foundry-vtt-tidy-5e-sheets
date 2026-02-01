<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import type { Actor5e } from 'src/types/types';

  const localize = FoundryAdapter.localize;

  interface Props {
    sheetDocument: any;
  }

  let { sheetDocument }: Props = $props();

  let tooltip: HTMLElement;

  let member: Actor5e | null = $state(null);

  let hp = $derived(member?.system.attributes.hp);

  export async function tryShow(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    actor: Actor5e,
  ): Promise<any> {
    member = actor;

    const target = event?.currentTarget;

    await tick();

    Tooltip.show(target, tooltip.outerHTML, getThemeV2(sheetDocument));
  }
</script>

<div class="hidden">
  <div bind:this={tooltip} class="hp-tooltip document-list-summary-tooltip">
    {#if hp}
      <ul class="hp-tooltip-list">
        <li class="flexrow hp-current">
          <span class="font-label-medium color-text-lightest label"
            >{localize('DND5E.HitPointsCurrent')}</span
          >
          <span class="font-data-medium color-text-default value">{hp.value}</span>
        </li>
        {#if hp.temp > 0}
          <li class="flexrow hp-temp">
            <span class="font-label-medium color-text-lightest label"
              >{localize('DND5E.HitPointsTemp')}</span
            >
            <span class="font-default-medium color-text-lighter">+{hp.temp}</span>
          </li>
        {/if}
        <li class="flexrow hp-max">
          <span class="font-label-medium color-text-lightest label"
            >{localize('DND5E.HitPointsMax')}</span
          >
          <span class="font-data-medium color-text-default value">{hp.max}</span>
        </li>
        {#if hp.tempmax !== null}
          <li class="flexrow {hp.tempmax >= 0 ? 'hp-tempmax-positive' : 'hp-tempmax-negative'}">
            <span class="font-label-medium color-text-lightest label"
              >{localize('DND5E.HitPointsTempMax')}</span
            >
            <span class="font-default-medium color-text-lighter">{hp.tempmax >= 0 ? '+' : '-'}{hp.tempmax}</span>
          </li>
        {/if}
      </ul>
    {/if}
  </div>
</div>