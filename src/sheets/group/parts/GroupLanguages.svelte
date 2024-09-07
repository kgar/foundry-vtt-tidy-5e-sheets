<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import { type Readable } from 'svelte/store';

  let context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each $context.groupLanguages as groupLanguage}
    <span title="TODO: List members in fancy tooltip" class="tag">
      {groupLanguage.label}
      {#if groupLanguage.members.length > 1}
        ({groupLanguage.members.length})
      {/if}
    </span>
  {/each}
</div>

