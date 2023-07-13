<script lang="ts">
  export let chatData: { description: { value: string }; properties: string[] };
  import { slide } from 'svelte/transition';
  import { quadInOut } from 'svelte/easing';
</script>

<div
  transition:slide={{ duration: 200, easing: quadInOut }}
  class="item-summary"
>
  {@html chatData.description.value}

  <div class="item-properties">
    {#each chatData.properties as prop}<span class="tag">{prop}</span>{/each}
  </div>
</div>

<style lang="scss">
  .item-summary {
    flex: 0 0 100%;
    padding: 0.5rem;
    border-top: 0.0625rem solid var(--t5e-faint-color);
    font-size: 0.75rem;
  }

  /*
  TODO: Account for this, but do it in a svelte-ier way...
  .tidy5e-kgar.sheet.actor .tidy5e-items-list .item .item-summary p:not(:first-child) {
      margin-top: .5em
  }
  */
</style>
