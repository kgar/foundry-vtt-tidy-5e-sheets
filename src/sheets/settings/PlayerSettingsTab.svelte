<script lang="ts">
  import type { Tidy5eSettingKeys } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  let store = getContext<Writable<Record<Tidy5eSettingKeys, any>>>('store');
</script>

<div>
  <input type="number" bind:value={$store.playerSheetWidth} />
</div>
<div>
  {$store.allowCantripToBePreparedOnContext}
</div>
