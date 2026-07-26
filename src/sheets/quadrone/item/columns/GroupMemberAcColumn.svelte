<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  let { rowDocument }: { rowDocument: Actor5e } = $props();
</script>

<span class="font-label-large color-text-default"
  >{rowDocument.system.attributes.ac.value}</span
>
