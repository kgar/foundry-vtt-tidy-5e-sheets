<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  let equipped = $derived(doc.system.equipped);

  let title = $derived(
    equipped
      ? 'DND5E.ContextMenuActionUnequip'
      : 'DND5E.ContextMenuActionEquip',
  );

  function toggleEquipped() {
    doc.update({
      'system.equipped': !equipped,
    });
  }
</script>

<a data-tooltip={title} onclick={toggleEquipped} class="tidy-table-button">
  {#if equipped}
    <i class="fa-solid fa-hand-fist equip-icon color-text-default"></i>
  {:else}
    <i class="fa-regular fa-hand color-text-lighter"></i>
  {/if}
</a>
