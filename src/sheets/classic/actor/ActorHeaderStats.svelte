<script lang="ts">
  import AttributeBlock from './AttributeBlock.svelte';
  import InitiativeBlock from './InitiativeBlock.svelte';
  import AcShield from './AcShield.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';

  interface Props {
    ac: { value: string | number };
    init: any;
    abilities: any[];
  }

  let { ac, init, abilities }: Props = $props();
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
        {id}
        {ability}
        useSavingThrowProficiency={true}
        useConfigurationOption={true}
      />
    </div>
  {/each}
</section>
