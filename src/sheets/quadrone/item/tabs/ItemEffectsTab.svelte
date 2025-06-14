<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import EffectsTables from '../../shared/EffectsTables.svelte';

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());
</script>

<EffectsTables />
