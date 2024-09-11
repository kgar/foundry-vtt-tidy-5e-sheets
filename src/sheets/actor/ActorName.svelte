<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetContextV1,
    ActorSheetContextV2,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContextV1 | ActorSheetContextV2>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<TextInput
  document={$context.actor}
  editable={$context.editable && !$context.lockSensitiveFields}
  spellcheck={false}
  placeholder={localize('DND5E.Name')}
  value={$context.actor.name}
  field="name"
/>
