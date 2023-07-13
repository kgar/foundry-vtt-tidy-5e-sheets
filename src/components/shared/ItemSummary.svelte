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
