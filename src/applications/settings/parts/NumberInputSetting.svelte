<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext, type Snippet } from 'svelte';

  interface Props {
    value: number;
    name: string;
    hint: string;
    id: string;
    min?: number | null;
    max?: number | null;
    step?: number | null;
    additionalInputs?: Snippet;
  }

  let {
    value = $bindable(),
    name,
    hint,
    id,
    min = null,
    max = null,
    step = null,
    additionalInputs,
  }: Props = $props();

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  const localize = FoundryAdapter.localize;
</script>

<article class="setting group">
  <div>
    <div class="description">
      <label for="{id}-{appId}">{localize(name)}</label>
      <p class="tidy5e-notes">{localize(hint)}</p>
    </div>
    <div class="settings-group">
      <article>
        <input type="number" id="{id}-{appId}" bind:value {min} {max} {step} />
      </article>
      {@render additionalInputs?.()}
    </div>
  </div>
</article>
