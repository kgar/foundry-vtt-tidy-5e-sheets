<script lang="ts">
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = $derived(getVehicleSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<!-- TODO: Implement Quadrone-styled vehicle traits:
  - Damage immunities
  - Damage resistances
  - Damage vulnerabilities
  - Condition immunities
  - Proper Quadrone card/section styling
-->
<div class="list traits">
  <div class="list-entry trait-size">
    <div class="list-label">
      <label for="{context.document.id}-vehicle-traits" class="h4 font-weight-label">
        <i class="fas fa-ruler-combined"></i>
        {localize('DND5E.Size')}
      </label>
    </div>
  </div>
</div>

