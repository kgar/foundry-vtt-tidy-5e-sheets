<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';

  export let value: number;
  export let name: string;
  export let hint: string;
  export let id: string;
  export let min: number | null = null;
  export let max: number | null = null;
  export let step: number | null = null;

  const appId = getContext<string>('appId');

  const localize = FoundryAdapter.localize;
</script>

<article class="setting group">
  <div>
    <div class="description">
      <label for="{id}-{appId}">{localize(name)}</label>
      <p class="notes">{localize(hint)}</p>
    </div>
    <div class="settings-group">
      <article>
        <input type="number" id="{id}-{appId}" bind:value {min} {max} {step} />
      </article>
      <slot name="additional-inputs" />
    </div>
  </div>
</article>
