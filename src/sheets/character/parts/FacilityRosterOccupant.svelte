<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import FacilityOccupant from 'src/sheets/character/parts/FacilityOccupant.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let occupant: Actor5e;
  export let type: string;
  export let index: number;
  export let prop: string;
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
  <img src={occupant.img} alt={occupant.name} />
  {#if $context.unlocked}
    <!-- TODO: Options overlay on unlocked -->
  {/if}
</li>
