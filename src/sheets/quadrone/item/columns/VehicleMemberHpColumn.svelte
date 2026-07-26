<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';

  let {
    rowDocument,
  }: {
    rowDocument: Actor5e;
  } = $props();
</script>

<span class="hp-value font-default-medium color-text-default"
  >{FoundryAdapter.formatCr(rowDocument.system.attributes.hp.max)}</span
>
