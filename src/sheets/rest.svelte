<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { SheetFunctions } from 'src/types/types';

  export let sheetFunctions: SheetFunctions;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div>
  <span data-tooltip={localize('T5EK.RestHint')}>
    <i class="fas fa-bed" />
  </span>
  <span
    data-tooltip={localize('T5EK.RestS')}
    on:click={(event) => sheetFunctions.onShortRest(event)}
  >
    <i class="fas fa-hourglass-half" />
  </span>
  <span
    data-tooltip={localize('T5EK.RestL')}
    on:click={(event) => sheetFunctions.onLongRest(event)}
  >
    <i class="fas fa-hourglass-end" />
  </span>
</div>
