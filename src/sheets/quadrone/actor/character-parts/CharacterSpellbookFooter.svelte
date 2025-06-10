<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { CharacterSheetQuadroneContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';
  import SpellcastingClassSummaryCard from '../parts/SpellcastingClassSummaryCard.svelte';

  interface Props {
    class?: ClassValue;
    tabId: string;
  }

  let { class: classValue, tabId }: Props = $props();

  let context = $derived(getSheetContext<CharacterSheetQuadroneContext>());

  function onAddClicked() {
    context.actor.sheet._addDocument({
      tabId: CONSTANTS.TAB_ACTOR_SPELLBOOK,
    });
  }

  let multiclass = $derived(context.spellcasting.length > 1);
</script>

<div class={['sheet-footer', classValue]}>
  {#each context.spellcasting as info}
    <SpellcastingClassSummaryCard {info} {multiclass} {tabId} />
  {/each}

  <a
    data-tooltip="DND5E.ItemCreate"
    class="button button-icon-only button-primary item-create"
    class:disabled={!context.editable}
    onclick={onAddClicked}
  >
    <i class="fas fa-plus"></i>
  </a>
</div>
