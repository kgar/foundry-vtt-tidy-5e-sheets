<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { ItemStub } from 'src/types/types';

  export let context: CharacterSheetContext;
  export let spell: ItemStub;

  function getSpellImageUrl(
    context: CharacterSheetContext,
    spell: any
  ): string | undefined {
    if (!SettingsProvider.settings.spellClassFilterIconReplace.get()) {
      return spell.img;
    }

    const parentClass = FoundryAdapter.tryGetFlag<string>(spell, 'parentClass');

    const classImage = parentClass
      ? context.actorClassesToImages[parentClass]
      : undefined;

    return classImage ?? spell.img;
  }

  const spellImg = getSpellImageUrl(context, spell);
</script>

<slot {spellImg} />
