<script lang="ts">
    import type { NpcSheetContext } from "src/types/types";
    import { getContext } from "svelte";
    import type { Readable } from "svelte/store";

  let store = getContext<Readable<NpcSheetContext>>('store');
</script>

<p>If No Spells, then Banner "This character has no spellcaster levels, but you..."</p>
<p>If Spells, then Spells here</p>
<p>If unlocked, then Add Spell button</p>
<p>Spellcasting footer (DC, Spellcaster Level, Spellcasting ability)</p>