<script lang="ts">
  import SkillsCard from '../parts/SkillsCard.svelte';
    import Legendaries from './Legendaries.svelte';
  import NpcTraits from './NpcTraits.svelte';
</script>

<NpcTraits />
<SkillsCard allowToggle={true} defaultExpansionState={false} />
<Legendaries />
