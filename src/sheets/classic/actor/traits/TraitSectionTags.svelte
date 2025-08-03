<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    tags?: [key: string, value: string][];
    tagCssClass?: string;
    children?: Snippet<[any]>;
  }

  let { tags = [], tagCssClass = '', children }: Props = $props();

  let ordered = $derived(
    tags.toSorted((a, b) => a[1].localeCompare(b[1], game.i18n.lang)),
  );
</script>

<ul class="trait-list">
  {#each ordered as [key, value]}
    <li class={['trait-tag', key, tagCssClass]}>
      {#if children}{@render children({ key, value })}{:else}{value}{/if}
    </li>
  {/each}
</ul>
