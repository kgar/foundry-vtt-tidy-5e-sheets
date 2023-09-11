<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';

  export let value: boolean;
  export let name: string;
  export let hint: string;
  export let id: string;

  const appId = getContext<string>('appId');

  $: calculatedId = `${id}-${appId}`;

  const localize = FoundryAdapter.localize;
</script>

<article class="setting">
  <input
    type="checkbox"
    data-dtype="boolean"
    id={calculatedId}
    bind:checked={value}
  />
  <div class="description">
    <label for={calculatedId}>{localize(name)}</label>
    <p class="notes">{localize(hint)}</p>
  </div>
</article>
