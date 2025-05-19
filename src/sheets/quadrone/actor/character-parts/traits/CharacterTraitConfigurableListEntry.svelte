<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorTraitPills from 'src/sheets/quadrone/actor/parts/ActorTraitPills.svelte';
  import type { ActorTraitContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    entries: ActorTraitContext[];
    onconfig: () => void;
    icon?: ClassValue;
    label: string;
    pillClass?: ClassValue;
  }

  let { entries = [], onconfig, icon, label, pillClass }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let empty = $derived(entries.length === 0);

  const localize = FoundryAdapter.localize;
</script>

{#if context.unlocked || entries.length}
  <div class={['list-entry', { empty }]}>
    <div class={['list-label']}>
      <h4 class="font-weight-label">
        <i class={icon}></i>
        {label}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        {#if entries.length}
          <ActorTraitPills values={entries} {pillClass} />
        {/if}
        {#if context.unlocked && !entries.length}
          <button
            type="button"
            class="button button-tertiary"
            onclick={(ev) => onconfig()}
          >
            {localize('CONTROLS.CommonEdit')}
          </button>
        {/if}
      </div>
      {#if context.unlocked}
        <div class="list-controls">
          <button
            aria-label="Configure {label}"
            type="button"
            class="button button-borderless button-icon-only button-config"
            onclick={(ev) => onconfig()}
          >
            <i class="fa-solid fa-cog"></i>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
