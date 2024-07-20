<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';

  export let value: boolean;
  export let name: string;
  export let hint: string;
  export let id: string;

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  const localize = FoundryAdapter.localize;
</script>

<article class="setting">
  <input type="checkbox" id="{id}-{appId}" bind:checked={value} />
  <div class="description">
    <label for="{id}-{appId}">{localize(name)}</label>
    <p class="tidy5e-notes">{localize(hint)}</p>
  </div>
</article>
