<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  let { rowDocument }: { rowDocument: Actor5e } = $props();
</script>

<span
  class="font-data-large color-text-{rowDocument.system.attributes.hp.dt
    ? 'default'
    : 'lightest'}">{rowDocument.system.attributes.hp.dt ?? '—'}</span
>
