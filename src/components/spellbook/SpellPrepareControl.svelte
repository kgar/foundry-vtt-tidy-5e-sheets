<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from '../item-list/controls/ItemControl.svelte';

  export let ctx: any;
  export let spell: any;

  function toggleSpellPreparation() {
    const value = FoundryAdapter.getProperty(
      spell,
      'system.preparation.prepared'
    );

    spell.update({
      'system.preparation.prepared': !value,
    });
  }
</script>

<ItemControl
  title={ctx?.toggleTitle}
  iconCssClass="fas fa-book"
  active={spell.system.preparation.prepared}
  on:click={toggleSpellPreparation}
/>
