<script lang="ts">
  import type { CustomItemSection } from 'src/types/item';

  export let section: CustomItemSection;
</script>

{#if section.sectionTitleHtml}
  <h3 class="form-header">{@html section.sectionTitleHtml}</h3>
{/if}

{@html section.contentHtml}
