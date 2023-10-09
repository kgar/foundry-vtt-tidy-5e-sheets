<script lang="ts">
  import AttributeBlock from '../AttributeBlock.svelte';
  import InitiativeBlock from '../InitiativeBlock.svelte';
  import AcShield from './AcShield.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';

  export let ac: any;
  export let init: any;
  export let abilities: any[];
</script>

<section class="actor-stats">
  <AcShield ac={ac.value} />
  <VerticalLineSeparator />
  <div>
    <InitiativeBlock initiative={init} />
  </div>
  {#each abilities as [id, ability]}
    <VerticalLineSeparator />
    <div>
      <AttributeBlock
        abbreviation={id}
        {ability}
        useSavingThrowProficiency={true}
        useConfigurationOption={true}
      />
    </div>
  {/each}
</section>
