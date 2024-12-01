<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from '../item-list/controls/ItemControl.svelte';

  interface Props {
    ctx: any;
    spell: any;
  }

  let { ctx, spell }: Props = $props();

  function toggleSpellPreparation() {
    const value = FoundryAdapter.getProperty(
      spell,
      'system.preparation.prepared',
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
  onclick={toggleSpellPreparation}
/>
