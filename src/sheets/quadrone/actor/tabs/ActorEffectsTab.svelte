<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ActorConditionsQuadrone from '../parts/ActorConditionsQuadrone.svelte';
  import EffectsTables from '../../shared/EffectsTables.svelte';
  import type {
    ActorSheetQuadroneContext,
    CharacterSheetQuadroneContext,
  } from 'src/types/types';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import { Theme } from 'src/theme/theme';

  let context =
    $derived(
      getSheetContext<
        ActorSheetQuadroneContext | CharacterSheetQuadroneContext
      >(),
    );

  let isBasicTheme = $derived(Theme.getSheetThemeSettings({ doc: context.document }).useBasicTheme ?? false);

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }
</script>

<div class="tab-content">
  <div {@attach observeResize(onResize)} class="tidy-table-container">
    <EffectsTables inlineWidth={sectionsInlineWidth} />

    {#if 'conditions' in context}
      <ActorConditionsQuadrone {isBasicTheme} conditions={context.conditions} />
    {/if}
  </div>
</div>
