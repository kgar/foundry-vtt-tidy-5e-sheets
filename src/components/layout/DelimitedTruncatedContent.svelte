<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    delimiter?: string;
    cssClass?: string | null;
    children?: Snippet;
  }

  let {
    delimiter = '<span>&#8226;</span>',
    cssClass = null,
    children,
  }: Props = $props();

  let dynamicStyles: string = $state('');

  function contentWithGridStyles(node: HTMLElement) {
    const childrenEntries = Array.from(node.children).entries();

    for (let [index, el] of childrenEntries) {
      var div = document.createElement('div');
      div.innerHTML = delimiter;

      if (index > 0 && div.firstChild) {
        node.insertBefore(div.firstChild, el);
      }
    }

    const nodesLength = node.children.length;
    if (nodesLength) {
      let columns: string[] = [];
      for (let i = 0; i < nodesLength; i++) {
        const target = node.children[i];
        const isContentNode = i % 2 === 0;

        if (isContentNode) {
          target.classList.add('truncate');
        }

        const column = isContentNode
          ? 'minmax(auto, min-content)'
          : 'min-content';
        columns.push(column);
      }

      dynamicStyles = 'grid-template-columns: ' + columns.join(' ');
    }
  }
</script>

<div
  class="delimited-truncated-content {cssClass}"
  use:contentWithGridStyles
  style={dynamicStyles}
>
  {@render children?.()}
</div>

<style lang="less">
  .delimited-truncated-content {
    display: grid;
    gap: 0.25rem;
  }
</style>
