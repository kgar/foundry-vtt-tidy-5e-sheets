<script lang="ts">
  import type { CustomHtmlItemSection } from 'src/types/item';

  export let section: CustomHtmlItemSection;
</script>

{#if section.sectionTitleHtml}
  <h3 class="form-header">{@html section.sectionTitleHtml}</h3>
{/if}

{@html section.contentHtml}
