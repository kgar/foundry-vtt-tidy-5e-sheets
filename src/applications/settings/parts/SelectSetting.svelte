<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';

  export let value: string;
  export let name: string;
  export let hint: string;
  export let id: string;
  export let options: Record<string, unknown>;

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
      <slot name="additional-inputs" />
    </div>
  </section>
</article>
