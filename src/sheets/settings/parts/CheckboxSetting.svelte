<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let value: boolean;
  export let name: string;
  export let hint: string;
  export let id: string;

  const localize = FoundryAdapter.localize;
</script>

<article class="setting">
  <input type="checkbox" data-dtype="boolean" {id} bind:checked={value} />
  <div class="description">
    <label for={id}>{localize(name)}</label>
    <p class="notes">{localize(hint)}</p>
  </div>
</article>
