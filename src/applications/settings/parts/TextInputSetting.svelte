<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';

  export let value: string;
  export let name: string;
  export let hint: string;
  export let id: string;

  const appId = getContext<string>('appId');

  $: calculatedId = `${id}-${appId}`;

  const localize = FoundryAdapter.localize;
</script>

<article class="setting group">
  <div>
    <div class="description">
      <label for={calculatedId}>{localize(name)}</label>
      <p class="tidy5e-notes">{localize(hint)}</p>
    </div>
    <div class="settings-group">
      <article>
        <input type="text" id={calculatedId} bind:value />
      </article>
      <slot name="additional-inputs" />
    </div>
  </div>
</article>
