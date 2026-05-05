<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorTraitPills from 'src/sheets/quadrone/actor/parts/ActorTraitPills.svelte';
  import type { ActorTraitContext } from 'src/types/types';
  import type {
    ClassValue,
    HTMLAttributes,
    HTMLButtonAttributes,
  } from 'svelte/elements';

  type OnConfigFn = (
    ev: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    },
  ) => void;

  interface Props {
    entries: ActorTraitContext[];
    onconfig?: OnConfigFn;
    configAttributes?: HTMLAttributes<HTMLButtonElement>;
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
    contentHtml?: string;
  }

  let {
    entries = [],
    onconfig,
    configAttributes,
    configurationTooltip,
    icon,
    label,
    traitClass,
    pillClass,
    alwaysShow,
    isCustomTrait,
    aggregateIcons,
    configButtonLocation,
    contentHtml,
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
      {#if context.unlocked && configButtonLocation == 'label'}
        {@render configButton(onconfig, configAttributes)}
      {/if}
    </div>
    <div class="list-content">
      <div class="list-values">
        {#if entries.length}
          <ActorTraitPills values={entries} {pillClass} {aggregateIcons} />
        {/if}
      </div>
      {#if context.unlocked && configButtonLocation == 'end'}
        {@render configButton(onconfig, configAttributes)}
      {/if}
    </div>
  </div>
  {@html contentHtml}
{/if}

{#snippet configButton(
  configFn?: OnConfigFn,
  attributes?: HTMLButtonAttributes,
)}
  {@const onclick = configFn
    ? (ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) =>
        configFn(ev)
    : undefined}
    
  {#if onclick || attributes}
    <button
      aria-label={configurationLabel}
      type="button"
      class="button button-borderless button-icon-only button-config flexshrink"
      data-tooltip={configurationTooltip ?? configurationLabel}
      {onclick}
      {...attributes}
    >
      <i class="fa-solid fa-cog"></i>
    </button>
  {/if}
{/snippet}
