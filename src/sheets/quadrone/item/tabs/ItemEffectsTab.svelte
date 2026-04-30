<script lang="ts">
  import { observeResize } from 'src/features/resize-observation/attachments';
  import EffectsTables from '../../shared/EffectsTables.svelte';

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }
</script>

<div {@attach observeResize(onResize)} class="tidy-table-container">
  <EffectsTables inlineWidth={sectionsInlineWidth} />
</div>
