<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { formatAsModifier } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import { type Readable } from 'svelte/store';

  let context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each $context.groupSkills as groupSkill}
    <span title="TODO: List members, scores, mods, passives, and proficiencies in fancy tooltip" class="tag tag-outline">
      {groupSkill.label}
      {formatAsModifier(groupSkill.mod)}
    </span>
  {/each}
</div>
