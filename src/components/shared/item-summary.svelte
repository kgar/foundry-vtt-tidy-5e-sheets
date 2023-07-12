<script lang="ts">
  export let chatData: { description: { value: string }; properties: string[] };
  import { slide } from 'svelte/transition';
</script>

<div transition:slide={{ duration: 200 }} class="item-summary">
  {@html chatData.description.value}

  <div class="item-properties">
    {#each chatData.properties as prop}<span class="tag">{prop}</span>{/each}
  </div>
</div>
