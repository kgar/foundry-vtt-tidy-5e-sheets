<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ActorSheetContextV1,
    ActorSheetClassicContextV2,
  } from 'src/types/types';

  let context = $derived(getSheetContext<ActorSheetContextV1 | ActorSheetClassicContextV2>());

  const localize = FoundryAdapter.localize;
</script>

<TextInput
  document={context.actor}
  editable={context.editable && !context.lockSensitiveFields}
  spellcheck={false}
  placeholder={localize('DND5E.Name')}
  value={context.actor.name}
  field="name"
/>
