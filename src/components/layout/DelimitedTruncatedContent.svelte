<script lang="ts">
  export let delimiter: string = '<span>&#8226;</span>';
  export let cssClass: string | null = null;

  let dynamicStyles: string = '';

  function test(node: HTMLElement) {
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
  use:test
  style={dynamicStyles}
>
  <slot />
</div>

<style lang="scss">
  .delimited-truncated-content {
    display: grid;
    gap: 0.25rem;
  }
</style>
