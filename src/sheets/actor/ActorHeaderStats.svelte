<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
  import AttributeBlock from '../AttributeBlock.svelte';
  import InitiativeBlock from '../InitiativeBlock.svelte';
  import AcShield from './AcShield.svelte';

  export let actor: Actor5e;
  export let ac: any;
  export let init: any;
  export let abilities: any[];
  
</script>

<section class="actor-stats">
  <!-- TODO: switch these back to unordered <li> -->
  <AcShield
    ac={ac.value}
    {actor}
  />
  <div class="vertical-line-separator" aria-hidden="true" role="presentation" />
  <div>
    <InitiativeBlock {actor} initiative={init} />
  </div>
  {#each abilities as [id, ability]}
    <div
      class="vertical-line-separator"
      aria-hidden="true"
      role="presentation"
    />
    <div>
      <AttributeBlock abbreviation={id} {ability} {actor} />
    </div>
  {/each}
</section>
