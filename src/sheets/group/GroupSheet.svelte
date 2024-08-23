<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { GroupSheetClassicContext } from '../Tidy5eGroupSheet';

  const context = getContext<Readable<GroupSheetClassicContext>>('context');
</script>

<h1>{$context.greetings}</h1>

{#if $context.showThumbsUp}
  <blockquote style="font-size: 2.5rem;">👍</blockquote>
{/if}
