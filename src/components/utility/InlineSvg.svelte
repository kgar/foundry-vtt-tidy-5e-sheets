<script lang="ts">
  import { error } from 'src/utils/logging';

  interface Props {
    svgUrl: string;
    removeInlineStyles?: boolean;
    [key: string]: any;
  }

  let { svgUrl, removeInlineStyles = true, ...rest }: Props = $props();

  let svgHtml: string = $state('');

  // kgar-migration-task - make sure this is working as desired. Async effects are not a thing, and the effect should be running and mutating whenever svgUrl changes
  $effect(() => {
    if (!svgUrl) {
      return;
    }

    (async () => {
      try {
        const response = await fetch(svgUrl);
        if (response.ok) {
          svgHtml = await response.text();
        }
      } catch (e) {
        error(
          'An error occurred while getting SVG images. See devtools console for more details.',
          true,
          e,
        );
        svgHtml = `<img src="${svgUrl}" alt="" />`;
      }
    })();
  });

  function preprocessSvg(node: HTMLElement) {
    removeInlineStyles && node.querySelector('svg')?.removeAttribute('style');
  }
</script>

{#key svgHtml}
  <div use:preprocessSvg class={rest.class ?? ''}>
    {@html svgHtml}
  </div>
{/key}
