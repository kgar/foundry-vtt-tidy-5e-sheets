<script lang="ts">
    import ItemNameHeaderOrchestrator from "./parts/ItemNameHeaderOrchestrator.svelte";
    import Sidebar from "./parts/Sidebar.svelte";

  let itemNameEl: HTMLElement | undefined = $state();
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar />

TODO: Add Item Sheet Header