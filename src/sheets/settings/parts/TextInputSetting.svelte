<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let value: string;
  export let name: string;
  export let hint: string;
  export let id: string;

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
        <input type="text" {id} bind:value />
      </article>
    </div>
  </div>
</article>
