<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { fade } from 'svelte/transition';

  const localize = FoundryAdapter.localize;
</script>

<div class="unidentified-notice" transition:fade={{ delay: 0, duration: 750 }}>
  <div>
    <strong>{localize('DND5E.Unidentified.Title')}</strong>
    <p>{localize('DND5E.Unidentified.Notice')}</p>
  </div>
</div>
