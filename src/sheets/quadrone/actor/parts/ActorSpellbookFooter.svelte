<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';
  import SpellcastingClassSummaryCard from './SpellcastingClassSummaryCard.svelte';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { visibilityObserver } from 'src/attachments/visibility-observer.svelte';
  import SpellcastingNpcSummaryCard from './SpellcastingNpcSummaryCard.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    class?: ClassValue;
    tabId: string;
  }

  let { class: classValue, tabId }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  function onAddClicked() {
    context.actor.sheet._addDocument({
      tabId: CONSTANTS.TAB_ACTOR_SPELLBOOK,
    });
  }

  let multiclass = $derived(context.spellcasting.length > 1);
  let mode: 'expanded' | 'compact' = $state('expanded');
  let collapsed = $state(false);
  let tabRef = getContext<Ref<HTMLElement | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.TAB_CONTENT_ELEMENT_REF,
  );

  function toggleCollapsed() {
    collapsed = !collapsed;
  }
</script>

<div
  role="presentation"
  style="margin-bottom: -1rem"
  {@attach visibilityObserver({
    callback: (entry) => {
      mode = entry.isIntersecting ? 'expanded' : 'compact';
    },
    root: tabRef.value,
    rootMargin: '-30px',
  })}
></div>

<div class={['sheet-footer spellbook-footer flexrow', classValue]}>
  <div class={['sheet-footer-left spellcasting-cards flexcol', { 'collapse-spellcasting-cards': collapsed }]}>
    {#each context.spellcasting as info}
      {#if info.type === 'class'}
        <SpellcastingClassSummaryCard {info} {multiclass} {tabId} {mode} onNameClick={toggleCollapsed} />
      {:else if info.type === 'npc'}
        <SpellcastingNpcSummaryCard {info} {mode} onNameClick={toggleCollapsed} />
      {/if}
    {/each}
  </div>

  {#if context.editable}
    <div class="sheet-footer-right flexshrink">
      {#if context.isConcentrating && context.saves.concentration}
        {@const save = context.saves.concentration}
        <button
          type="button"
          aria-label={localize('EFFECT.DND5E.StatusConcentrating')}
          data-tooltip=""
          onclick={(event) =>
            context.actor.rollConcentration({
              event,
              legacy: false,
            })}
          onmouseover={(event) => {
            event.target.querySelector('.active-concentration-icon').style.display = 'none';
            event.target.querySelector('.fas.fa-head-side-brain').style.display = 'block';
          }}
          onmouseout={(event) => {
            event.target.querySelector('.active-concentration-icon').style.display = 'block';
            event.target.querySelector('.fas.fa-head-side-brain').style.display = 'none';
          }}
          class="button button-secondary button-icon-only"
          data-has-roll-modes
        >
          <i
            class="active-concentration-icon fas fa-arrow-rotate-left fa-spin fa-spin-reverse"
            aria-label={localize('DND5E.Concentration')}
          ></i>
          <i
            class="fas fa-head-side-brain color-text-gold"
            style="display: none;"
            aria-label={localize('DND5E.Concentration')}
          ></i>
        </button>
        <!-- {#if context.unlocked}
          {@const tooltip = localize('DND5E.AbilityConfigure', {
            ability: context.saves.concentration.label,
          })}
          <div class="config-container">
            <button
              aria-label={tooltip}
              data-tooltip
              type="button"
              class="button button-borderless button-icon-only button-config"
              onclick={() =>
                FoundryAdapter.openConcentrationConfig(context.actor)}
            >
              <i class="fas fa-cog"></i>
            </button>
          </div>
        {/if} -->
      {/if}
      <a
        data-tooltip="DND5E.ItemCreate"
        class="button button-icon-only button-primary item-create"
        class:disabled={!context.editable}
        onclick={onAddClicked}
      >
        <i class="fas fa-plus"></i>
      </a>
    </div>
  {/if}
</div>
