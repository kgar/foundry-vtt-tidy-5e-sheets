<script lang="ts">
  interface Props {
    tags?: [key: string, value: string][];
    tagCssClass?: string;
    children?: import('svelte').Snippet<[any]>;
  }

  let { tags = [], tagCssClass = '', children }: Props = $props();
</script>

<ul class="trait-list traits">
  {#each tags as [key, value]}
    <li class="trait-tag {key} {tagCssClass}">
      {#if children}{@render children({ key, value })}{:else}{value}{/if}
    </li>
  {/each}
</ul>
