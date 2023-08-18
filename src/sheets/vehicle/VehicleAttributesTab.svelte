<script lang="ts">
  import Traits from '../actor/Traits.svelte';
  import VehicleAttributes from './parts/VehicleAttributes.svelte';
</script>

<div class="attributes-tab-contents">
  <div class="side-panel">
    <VehicleAttributes />
    <Traits
      toggleable={true}
      useSenses={false}
      enableSpecialTraitsConfiguration={false}
    />
  </div>
  <div class="main-panel">Center</div>
</div>

<style lang="scss">
  .attributes-tab-contents {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 13.75rem;
  }

  .main-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    padding: 0;
    height: auto;
    overflow-x: auto;
  }
</style>
