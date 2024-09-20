<script lang="ts">
  export let tags: [key: string, value: string][] = [];
  export let tagCssClass: string = '';
</script>

<ul class="trait-list traits">
  {#each tags as [key, value]}
    <li class="trait-tag {key} {tagCssClass}">
      <slot {key} {value}>{value}</slot>
    </li>
  {/each}
</ul>
