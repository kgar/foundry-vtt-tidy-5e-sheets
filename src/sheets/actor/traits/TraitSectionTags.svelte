<script lang="ts">
  export let tags: [key: string, value: string][] = [];
</script>

<ul class="trait-list traits">
  {#each tags as [key, value]}
    <li class="trait-tag {key}">{value}</li>
  {/each}
</ul>
