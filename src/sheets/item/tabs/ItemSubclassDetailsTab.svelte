<script lang="ts">
  import { getContext } from 'svelte';
  import DetailsSpellcasting from '../parts/DetailsSpellcasting.svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.document.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<div class="form-group">
  <label for="{appId}-identifier">{localize('DND5E.Identifier')}</label>
  <div class="form-fields">
    <TextInput
      id="{appId}-identifier"
      document={$context.item}
      field="system.identifier"
      value={$context.source.identifier}
      placeholder={$context.item.identifier}
      disabled={!$context.editable}
    />
  </div>
  <p class="hint">{localize('DND5E.IdentifierError')}</p>
</div>

<div class="form-group">
  <label for="{appId}-classIdentifier"
    >{localize('DND5E.ClassIdentifier')}</label
  >
  <div class="form-fields">
    <TextInput
      id="{appId}-classIdentifier"
      document={$context.item}
      field="system.classIdentifier"
      value={$context.source.classIdentifier}
      disabled={!$context.editable}
    />
  </div>
  <p class="hint">
    {localize('DND5E.SubclassIdentifierHint')}
  </p>
</div>

<h3 class="form-header">{localize('DND5E.Spellcasting')}</h3>
<DetailsSpellcasting />
