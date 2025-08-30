<script lang="ts">
  import CharacterTraits from '../character-parts/traits/CharacterTraits.svelte';
  import SavingThrowsCard from '../character-parts/SavingThrowsCard.svelte';
  import SkillsCard from '../parts/skills/SkillsCard.svelte';
  import ToolsCard from '../parts/ToolsCard.svelte';
</script>

<div class="columns">
  <div class="attributes-column">
    <SkillsCard />
    <ToolsCard />
  </div>
  <div class="attributes-column">
    <SavingThrowsCard />
    <CharacterTraits />
  </div>
</div>
