<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
  import AttributeBlock from '../AttributeBlock.svelte';
  import InitiativeBlock from '../InitiativeBlock.svelte';
  import AcShield from './AcShield.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';

  export let actor: Actor5e;
  export let ac: any;
  export let init: any;
  export let abilities: any[];
</script>

<section class="actor-stats">
  <AcShield ac={ac.value} {actor} />
  <VerticalLineSeparator />
  <div>
    <InitiativeBlock {actor} initiative={init} />
  </div>
  {#each abilities as [id, ability]}
    <VerticalLineSeparator />
    <div>
      <AttributeBlock
        abbreviation={id}
        {ability}
        {actor}
        useSavingThrowProficiency={true}
        useConfigurationOption={true}
      />
    </div>
  {/each}
</section>
