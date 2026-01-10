<script lang="ts">
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import SkillsCard from '../parts/skills/SkillsCard.svelte';
  import ToolsCard from '../parts/ToolsCard.svelte';
  import Legendaries from './Legendaries.svelte';
  import LoyaltyTracker from './LoyaltyTracker.svelte';
  import NpcTraits from './NpcTraits.svelte';

  let context = $derived(getNpcSheetQuadroneContext());
</script>

<NpcTraits />
<SkillsCard
  defaultExpansionState={false}
  showFiligree={false}
  showProficiency={context.unlocked}
/>
<Legendaries showFiligree={false} />
<LoyaltyTracker />

{#if context.tools.length || context.unlocked}
  <ToolsCard showFiligree={false} showProficiency={context.unlocked} />
{/if}
