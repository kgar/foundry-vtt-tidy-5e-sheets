<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { CharacterSheetQuadroneContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';
  import SpellcastingClassSummaryCard from '../parts/SpellcastingClassSummaryCard.svelte';
  import { getContext } from 'svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { visibilityObserver } from 'src/attachments/visibility-observer.svelte';

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
  let mode: 'expanded' | 'compact' = $state('expanded');
  let tabRef = getContext<Ref<HTMLElement | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.TAB_CONTENT_ELEMENT_REF,
  );
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
  <div class="sheet-footer-left spellcasting-cards flexcol">
    {#each context.spellcasting as info}
      <SpellcastingClassSummaryCard {info} {multiclass} {tabId} {mode} />
    {/each}
  </div>

  <div class="sheet-footer-right flexshrink">
    <a
      data-tooltip="DND5E.ItemCreate"
      class="button button-icon-only button-primary item-create"
      class:disabled={!context.editable}
      onclick={onAddClicked}
    >
      <i class="fas fa-plus"></i>
    </a>
  </div>
</div>
