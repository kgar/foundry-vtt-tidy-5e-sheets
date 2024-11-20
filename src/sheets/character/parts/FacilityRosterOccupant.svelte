<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e, CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let occupant: Actor5e;
  export let type: string;
  export let index: number;
  export let prop: string;

  function onRosterMemberClicked(): any {
    occupant.sheet.render(true);
  }
</script>

<!-- When svelte 5, inline with snippet -->
<li
  class={type}
  data-actor-uuid={occupant.uuid}
  data-tooltip={occupant.name}
  data-facility-id={occupant.facility}
  data-prop={prop}
  data-index={index}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a on:click={() => onRosterMemberClicked()}>
    <img src={occupant.img} alt={occupant.name} />
    {#if $context.unlocked}
      <!-- TODO: Options overlay on unlocked -->
    {/if}
  </a>
</li>
