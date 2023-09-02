<script lang="ts">
  export let svgUrl: string;
  export let removeWidthAndHeightStyles: boolean = true;

  let svgHtml: string = '';
  $: {
    (async () => {
      if (!svgUrl) {
        return;
      }

      const response = await fetch(svgUrl);
      if (response.ok) {
        svgHtml = await response.text();
      }
    })();
  }

  function preprocessSvg(node: HTMLElement) {
    if (removeWidthAndHeightStyles) {
      const svg = node.querySelector('svg');
      if (svg?.style.width) {
        svg.style.width = '';
      }
      if (svg?.style.height) {
        svg.style.height = '';
      }
      console.log(svg);
    }
  }
</script>

{#key svgHtml}
  <div use:preprocessSvg>
    {@html svgHtml}
  </div>
{/key}
