<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext, type Snippet } from 'svelte';

  interface Props {
    value: string;
    name: string;
    hint: string;
    id: string;
    additionalInputs?: Snippet;
  }

  let {
    value = $bindable(),
    name,
    hint,
    id,
    additionalInputs,
  }: Props = $props();

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  let calculatedId = $derived(`${id}-${appId}`);

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
      {@render additionalInputs?.()}
    </div>
  </div>
</article>
