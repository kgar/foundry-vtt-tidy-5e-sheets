<script lang="ts">
  import SkillsCard from '../parts/skills/SkillsCard.svelte';
  import Legendaries from './Legendaries.svelte';
  import LoyaltyTracker from './LoyaltyTracker.svelte';
  import NpcTraits from './NpcTraits.svelte';
</script>

<NpcTraits />
<SkillsCard defaultExpansionState={false} showFiligree={false} />
<LoyaltyTracker />
<Legendaries showFiligree={false}/>
