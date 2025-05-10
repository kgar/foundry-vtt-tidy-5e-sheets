<script lang="ts">
  import CharacterTraits from '../character-parts/CharacterTraits.svelte';
  import SavingThrowsCard from '../character-parts/SavingThrowsCard.svelte';
  import SkillsCard from '../parts/SkillsCard.svelte';
  import ToolsCard from '../parts/ToolsCard.svelte';
</script>

<div class="left">
  <SkillsCard />
  <ToolsCard />
</div>
<div class="right">
  <SavingThrowsCard />
  <CharacterTraits />
</div>
