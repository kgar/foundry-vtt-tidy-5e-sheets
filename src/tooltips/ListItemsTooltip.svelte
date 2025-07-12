<script lang="ts">
  import { getThemeV2 } from 'src/theme/theme';
  import { Tooltip } from './Tooltip';

  interface Props {
    sheetDocument: any;
    entries: string[];
  }

  let { sheetDocument, entries }: Props = $props();

  let tooltip: HTMLElement;

  export function tryShow(target: HTMLElement): any {
    if (!entries.length) {
      return;
    }

    Tooltip.show(target, tooltip.outerHTML, getThemeV2(sheetDocument));
  }
</script>

<div class="hidden">
  <div bind:this={tooltip} class="list-items-tooltip">
    <ul class="unlist">
      {#each entries as entry}
        <li>
          {@html entry}
        </li>
      {/each}
    </ul>
  </div>
</div>
