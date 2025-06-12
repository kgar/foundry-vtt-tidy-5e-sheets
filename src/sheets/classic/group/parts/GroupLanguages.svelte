<script lang="ts">
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import GroupLanguageTooltip from 'src/tooltips/GroupLanguageTooltip.svelte';

  let context = $derived(getGroupSheetClassicContext());

  let groupLanguageTooltip: GroupLanguageTooltip;
</script>

<div class="flex-row extra-small-gap flex-wrap">
  {#each context.groupLanguages as groupLanguage}
    <span
      data-tooltip-direction="UP"
      class="tag"
      onmouseover={(ev) => groupLanguageTooltip.tryShow(ev, groupLanguage)}
    >
      {groupLanguage.label}
      {#if groupLanguage.members.length > 1}
        ({groupLanguage.members.length})
      {/if}
    </span>
  {/each}
</div>

<GroupLanguageTooltip
  bind:this={groupLanguageTooltip}
  sheetDocument={context.document}
/>
