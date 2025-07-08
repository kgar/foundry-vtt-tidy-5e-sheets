<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import BulletedListTooltip from 'src/tooltips/BulletedListTooltip.svelte';
  import {
    type ActorSheetQuadroneContext,
    type ActorTraitContext,
  } from 'src/types/types';
  import { tick } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    values: ActorTraitContext[];
    pillClass?: ClassValue;
    aggregateIcons?: {
      pillClass: string;
      iconClass: string;
    };
  }

  let { values, pillClass, aggregateIcons }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let bulletedListTooltip: BulletedListTooltip;

  let entries = $state<string[]>([]);

  async function onHover(
    event: Event & { currentTarget: EventTarget & HTMLElement },
    pill: ActorTraitContext,
  ) {
    if (!aggregateIcons || !pill.icons?.length) {
      return;
    }

    const currentTarget = event.currentTarget;

    console.warn(currentTarget.nodeName);

    entries = pill.icons?.map((i) => i.label) ?? [];

    await tick();

    bulletedListTooltip.tryShow(currentTarget);
  }
</script>

<BulletedListTooltip
  bind:this={bulletedListTooltip}
  {entries}
  sheetDocument={context.document}
/>

<ul class="pills">
  {#each values as value}
    <li
      class={[
        'pill pill-medium',
        pillClass,
        value.cssClass,
        value.icons?.length && aggregateIcons?.pillClass
          ? aggregateIcons?.pillClass
          : undefined,
      ]}
      data-tooltip-direction="UP"
      onmouseover={(ev) => onHover(ev, value)}
    >
      {#if aggregateIcons && value.icons?.length}
        <i class={aggregateIcons.iconClass}></i>
      {:else if value.icons}
        {#each value.icons as icon}
          <i class={icon.icon} data-tooltip={icon.label}></i>
        {/each}
      {/if}
      <span class="label font-label-medium">
        {value.label}
      </span>
      {#if value.sign || value.value || value.units}
        <span>
          {#if value.sign}<span class="sign font-label-medium"
              >{value.sign}</span
            >{/if}{#if value.value}<span class="value font-data-medium"
              >{value.value}</span
            >{/if}{#if value.units}<span
              class="units font-default-medium color-text-lighter"
              >{value.units}</span
            >{/if}
        </span>
      {/if}
    </li>
  {/each}
</ul>
