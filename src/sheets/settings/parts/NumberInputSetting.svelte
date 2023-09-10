<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let value: number;
  export let name: string;
  export let hint: string;
  export let id: string;
  export let min: number | null = null;
  export let max: number | null = null;
  export let step: number | null = null;

  const localize = FoundryAdapter.localize;
</script>

<article class="setting group">
  <div>
    <div class="description">
      <label for={id}>{localize(name)}</label>
      <p class="notes">{localize(hint)}</p>
    </div>
    <div class="settings-group">
      <article>
        <input type="number" {id} bind:value {min} {max} {step} />
      </article>
    </div>
  </div>
</article>
