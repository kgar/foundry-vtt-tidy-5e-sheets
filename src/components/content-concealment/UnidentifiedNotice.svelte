<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { fade } from 'svelte/transition';

  const localize = FoundryAdapter.localize;
</script>

<div class="unidentified-notice" transition:fade={{ delay: 0, duration: 750 }}>
  <div>
    <strong>{localize('DND5E.Unidentified.Title')}</strong>
    <p>{localize('DND5E.Unidentified.Notice')}</p>
  </div>
</div>

<style lang="scss">
  .unidentified-notice {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: start center;

    div {
      margin-block-start: 4em;
      margin-inline: auto;
      padding: 2em;
      border: 0.0625rem solid var(--t5e-separator-color);
      border-radius: 0.25rem;
      box-shadow: 0 0 0.75rem rgb(0 0 0 / 45%);
      background: var(--t5e-background);
      text-align: center;

      strong {
        font-size: 1.5rem;
      }
    }
  }
</style>
