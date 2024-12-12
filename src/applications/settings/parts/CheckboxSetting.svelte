<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';

  interface Props {
    value: boolean;
    name: string;
    hint: string;
    id: string;
  }

  let { value = $bindable(), name, hint, id }: Props = $props();

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
