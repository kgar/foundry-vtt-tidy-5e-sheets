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

<!-- svelte-ignore a11y_missing_attribute -->
<a aria-label={title} role="button" tabindex="0" data-tooltip={title} onclick={toggleEquipped} class="tidy-table-button" onkeydown={(ev) => {
  if (ev.key === 'Enter' || ev.key === ' ') {
    toggleEquipped();
  }
}}>
  {#if equipped}
    <i class="fa-solid fa-hand-fist equip-icon color-text-default"></i>
  {:else}
    <i class="fa-regular fa-hand color-text-lightest"></i>
  {/if}
</a>
