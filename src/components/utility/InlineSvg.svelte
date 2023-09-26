<script lang="ts">
  import { error } from 'src/utils/logging';

  export let svgUrl: string;
  export let removeInlineStyles: boolean = true;

  let svgHtml: string = '';
  $: {
    (async () => {
      if (!svgUrl) {
        return;
      }

      try {
        const response = await fetch(svgUrl);
        if (response.ok) {
          svgHtml = await response.text();
        }
      } catch (e) {
        error(
          'An error occurred while getting SVG images. See devtools console for more details.',
          true,
          e
        );
        svgHtml = `<img src="${svgUrl}" alt="" />`;
      }
    })();
  }

  function preprocessSvg(node: HTMLElement) {
    removeInlineStyles && node.querySelector('svg')?.removeAttribute('style');
  }
</script>

{#key svgHtml}
  <div use:preprocessSvg>
    {@html svgHtml}
  </div>
{/key}
