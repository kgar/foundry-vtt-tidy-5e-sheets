<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ListItemsTooltip from 'src/tooltips/ListItemsTooltip.svelte';
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

  let listItemsTooltip: ListItemsTooltip;

  let tooltipListItems = $state<string[]>([]);

  async function onHover(
    event: Event & { currentTarget: EventTarget & HTMLElement },
    pill: ActorTraitContext,
  ) {
    if (!aggregateIcons || !pill.icons?.length) {
      return;
    }

    const currentTarget = event.currentTarget;

    tooltipListItems = pill.icons?.map((i) => i.label) ?? [];

    await tick();

    listItemsTooltip.tryShow(currentTarget);
  }
</script>

<ListItemsTooltip
  bind:this={listItemsTooltip}
  entries={tooltipListItems}
  sheetDocument={context.document}
/>

<ul class="pills">
  {#each values as value}
    {@const onClick = value.onClick}
    <li
      class={[
        'pill pill-medium trait-pill',
        pillClass,
        value.cssClass,
        value.icons?.length && aggregateIcons?.pillClass
          ? aggregateIcons?.pillClass
          : undefined,
      ]}
      data-tooltip-direction="UP"
      onmouseover={(ev) => onHover(ev, value)}
      onfocus={(ev) => onHover(ev, value)}
    >
      {#if onClick}
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
          role="button"
          tabindex="0"
          aria-label={value.label}
          data-keyboard-focus
          class="button button-borderless"
          onclick={(event) =>
            onClick({
              app: context.sheet,
              context,
              element: context.sheet.element,
              event,
            })}
          onkeydown={(ev) =>
            ev.key === 'Enter' &&
            onClick({
              app: context.sheet,
              context,
              element: context.sheet.element,
              event: ev as unknown as MouseEvent,
            })}
        >
          {@render pillContents(value)}
        </a>
      {:else}
        {@render pillContents(value)}
      {/if}
    </li>
  {/each}
</ul>

{#snippet pillContents(value: ActorTraitContext)}
  {#if aggregateIcons && value.icons?.length}
    <i class={aggregateIcons.iconClass}></i>
  {:else if value.icons}
    {#each value.icons as icon}
      <i class={icon.icon} data-tooltip={icon.label}></i>
    {/each}
  {/if}
  {#if value.content}
    {@html value.content}
  {/if}
  <span class="label font-label-medium">
    {value.label}
  </span>
  {#if value.sign || value.value || value.units}
    <span>
      {#if value.sign}<span class="sign font-label-medium">{value.sign}</span
        >{/if}{#if value.value}<span class="value font-data-medium"
          >{value.value}</span
        >{/if}{#if value.units}<span
          class="units font-default-medium color-text-lighter"
          >{value.units}</span
        >{/if}
    </span>
  {/if}
  {#if value.parenthetical}
    <span class="label font-label-medium">
      ({value.parenthetical})
    </span>
  {/if}
{/snippet}
