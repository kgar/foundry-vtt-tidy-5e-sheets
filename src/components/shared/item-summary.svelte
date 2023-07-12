<script lang="ts">
  export let chatData: { description: { value: string }; properties: string[] };
</script>

{#if chatData}
  <div class="item-summary">
    {@html chatData.description.value}

    <div class="item-properties">
      {#each chatData.properties as prop}<span class="tag">{prop}</span>{/each}
    </div>
  </div>
{/if}
