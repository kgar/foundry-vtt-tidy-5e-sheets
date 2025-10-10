<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorTraitPills from 'src/sheets/quadrone/actor/parts/ActorTraitPills.svelte';
  import type { ActorTraitContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    entries: ActorTraitContext[];
    onconfig?: (
      ev: MouseEvent & {
        currentTarget: EventTarget & HTMLButtonElement;
      },
    ) => void;
    configurationTooltip?: string;
    icon?: ClassValue;
    label: string;
    traitClass?: string;
    pillClass?: ClassValue;
    alwaysShow?: boolean;
    isCustomTrait?: boolean;
    aggregateIcons?: {
      pillClass: string;
      iconClass: string;
    };
    configButtonLocation: 'label' | 'end';
  }

  let {
    entries = [],
    onconfig,
    configurationTooltip,
    icon,
    label,
    traitClass,
    pillClass,
    alwaysShow,
    isCustomTrait,
    aggregateIcons,
    configButtonLocation,
  }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let empty = $derived(entries.length === 0);

  const localize = FoundryAdapter.localize;

  let configurationLabel = $derived(
    localize('DND5E.ProficiencyConfigureTitle', { label }),
  );
</script>

{#if context.unlocked || entries.length || !!alwaysShow}
  <div class={['list-entry', { empty: empty && !isCustomTrait }, traitClass]}>
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class={icon}></i>
        {label}
      </h4>
      {#if context.unlocked && configButtonLocation == 'label' && onconfig}
        <button
          aria-label={configurationLabel}
          type="button"
          class="button button-borderless button-icon-only button-config flexshrink"
          data-tooltip={configurationTooltip ?? configurationLabel}
          onclick={(ev) => onconfig(ev)}
        >
          <i class="fa-solid fa-cog"></i>
        </button>
      {/if}
    </div>
    {#if entries.length}
      <div class="list-content">
        <div class="list-values">
          {#if entries.length}
            <ActorTraitPills values={entries} {pillClass} {aggregateIcons} />
          {/if}
        </div>
        {#if context.unlocked && configButtonLocation == 'end' && onconfig}
          <button
            aria-label={configurationLabel}
            type="button"
            class="button button-borderless button-icon-only button-config flexshrink"
            data-tooltip={configurationTooltip ?? configurationLabel}
            onclick={(ev) => onconfig(ev)}
          >
            <i class="fa-solid fa-cog"></i>
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}
