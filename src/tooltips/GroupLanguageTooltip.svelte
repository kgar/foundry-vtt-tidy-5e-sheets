<script lang="ts">
  import type { GroupLanguage } from 'src/types/group.types';
  import type { Actor5e } from 'src/types/types';
  import { tick } from 'svelte';
  import { Tooltip } from './Tooltip';
  import { getThemeV2 } from 'src/theme/theme';

  interface Props {
    sheetDocument: any;
  }

  let { sheetDocument }: Props = $props();

  let language = $state('');
  let members: Actor5e[] = $state([]);

  let tooltip: HTMLElement;

  export async function tryShow(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    groupLanguage: GroupLanguage,
  ): Promise<any> {
    if (!groupLanguage.members.length) {
      return;
    }

    language = groupLanguage.label;
    members = groupLanguage.members;

    const target = event?.currentTarget;

    await tick();

    Tooltip.show(target, tooltip.outerHTML, getThemeV2(sheetDocument));
  }
</script>

<div class="hidden">
  <div bind:this={tooltip} class="document-list-summary-tooltip">
    <h3>{language}</h3>
    <hr />
    <ul>
      {#each members as member}
        <li class="image-and-name">
          <div
            class="item-image"
            style="background-image: url('{member.img}')"
          ></div>
          <div class="item-name truncate">{member.name}</div>
        </li>
      {/each}
    </ul>
  </div>
</div>
