<script lang="ts">
  import SkillsCard from '../parts/skills/SkillsCard.svelte';
  import ToolsCard from '../parts/ToolsCard.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

<SkillsCard showFiligree={false} tooltipDirection="RIGHT" />

<ToolsCard showFiligree={false} tooltipDirection="RIGHT" />
