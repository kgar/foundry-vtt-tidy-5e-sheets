<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  const localize = FoundryAdapter.localize;

  let equipped = $derived(doc.system.equipped);

  let title = $derived(
    localize(
      equipped
        ? 'DND5E.ContextMenuActionUnequip'
        : 'DND5E.ContextMenuActionEquip',
    ),
  );

  function toggleEquipped() {
    doc.update({
      'system.equipped': !equipped,
    });
  }
</script>

<a {title} onclick={toggleEquipped} class="tidy-table-button">
  {#if equipped}
    <i class="fa-solid fa-hand-fist equip-icon"></i>
  {:else}
    <i class="fa-light fa-hand"></i>
  {/if}
</a>
