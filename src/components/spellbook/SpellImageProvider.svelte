<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item';
  import type { ActorSheetContext } from 'src/types/types';

  export let context: ActorSheetContext;
  export let spell: Item5e;

  function getSpellImageUrl(
    context: ActorSheetContext,
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
