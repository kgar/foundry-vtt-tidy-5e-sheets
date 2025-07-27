<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorTraitPills from 'src/sheets/quadrone/actor/parts/ActorTraitPills.svelte';
  import type { ActorTraitContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    entries: ActorTraitContext[];
    onconfig: (
      ev: MouseEvent & {
        currentTarget: EventTarget & HTMLButtonElement;
      },
    ) => void;
    configurationTooltip?: string;
    icon?: ClassValue;
    label: string;
    pillClass?: ClassValue;
    alwaysShow?: boolean;
    isCustomTrait?: boolean;
    aggregateIcons?: {
      pillClass: string;
      iconClass: string;
    };
  }

  let {
    entries = [],
    onconfig,
    configurationTooltip,
    icon,
    label,
    pillClass,
    alwaysShow,
    isCustomTrait,
    aggregateIcons,
  }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let empty = $derived(entries.length === 0);

  const localize = FoundryAdapter.localize;

  let configurationLabel = $derived(
    localize('DND5E.ProficiencyConfigureTitle', { label }),
  );
</script>

{#if context.unlocked || entries.length || !!alwaysShow}
  <div class={['list-entry', { empty: empty && !isCustomTrait }]}>
    <div class={['list-label']}>
      <h4 class="font-weight-label">
        <i class={icon}></i>
        {label}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        {#if entries.length}
          <ActorTraitPills values={entries} {pillClass} {aggregateIcons} />
        {/if}
        {#if context.unlocked && empty && !isCustomTrait}
          <button
            type="button"
            class="button button-tertiary"
            data-tooltip={configurationTooltip}
            onclick={(ev) => onconfig(ev)}
          >
            {localize('CONTROLS.CommonEdit')}
          </button>
        {/if}
      </div>
      {#if context.unlocked}
        <div class="list-controls">
          <button
            aria-label={configurationLabel}
            type="button"
            class="button button-borderless button-icon-only button-config"
            data-tooltip={configurationTooltip ?? configurationLabel}
            onclick={(ev) => onconfig(ev)}
          >
            <i class="fa-solid fa-cog"></i>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
