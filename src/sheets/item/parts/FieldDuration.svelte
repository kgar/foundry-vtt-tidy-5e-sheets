<script lang="ts">
    import { getContext } from 'svelte';
    import type { Readable } from 'svelte/store';
    import type { ItemSheetContext } from 'src/types/item.types';
    import Select from 'src/components/inputs/Select.svelte';
    import Checkbox from 'src/components/inputs/Checkbox.svelte';
    import ItemActivation from '../parts/ItemActivation.svelte';
    import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
    import TextInput from 'src/components/inputs/TextInput.svelte';
    import NumberInput from 'src/components/inputs/NumberInput.svelte';
    import { FoundryAdapter } from 'src/foundry/foundry-adapter';
    import ItemAction from '../parts/ItemAction.svelte';
    import ItemFormGroup from '../form/ItemFormGroup.svelte';
    import { CONSTANTS } from 'src/constants';
    import ItemProperties from '../parts/ItemProperties.svelte';
    import FieldUses from '../parts/FieldUses.svelte';
    import FieldTargets from '../parts/FieldTargets.svelte';
    import FieldActivation from '../parts/FieldActivation.svelte';
    import FieldRange from '../parts/FieldRange.svelte';
    import FieldDuration from '../parts/FieldDuration.svelte';
  
    let context = getContext<Readable<ItemSheetContext>>(
      CONSTANTS.SVELTE_CONTEXT.CONTEXT,
    );
  
    $: appId = $context.item.sheet.appId;
  
    const localize = FoundryAdapter.localize;
  </script>