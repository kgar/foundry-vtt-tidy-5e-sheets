<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext, type Snippet } from 'svelte';

  interface Props {
    value: string;
    name: string;
    hint: string;
    id: string;
    options: Record<string, unknown>;
    additionalInputs?: Snippet;
  }

  let {
    value = $bindable(),
    name,
    hint,
    id,
    options,
    additionalInputs,
  }: Props = $props();

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  const localize = FoundryAdapter.localize;
</script>

<article class="setting group">
  <section>
    <div class="description">
      <label for="{id}-{appId}">{localize(name)}</label>
      <p class="tidy5e-notes">{localize(hint)}</p>
    </div>
    <div class="settings-group">
      <select id="{id}-{appId}" bind:value>
        <SelectOptions data={options} />
      </select>
      {@render additionalInputs?.()}
    </div>
  </section>
</article>
