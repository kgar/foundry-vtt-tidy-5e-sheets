<script lang="ts">
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import AttunementSummaryTooltip from 'src/tooltips/AttunementSummaryTooltip.svelte';
  import type { Item5e } from 'src/types/item.types';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';

  interface Props {
    class?: ClassValue;
  }

  let { class: classValue }: Props = $props();

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );
</script>

<div class={['sheet-footer', classValue]}>Spellbook Footer 🧙‍♂️🧙‍♀️</div>
