<script lang="ts">
  import CharacterTraits from '../character-parts/traits/CharacterTraits.svelte';
  import SavingThrowsCard from '../character-parts/SavingThrowsCard.svelte';
  import SkillsCard from '../parts/SkillsCard.svelte';
  import ToolsCard from '../parts/ToolsCard.svelte';
</script>

<div class="columns">
  <div class="left flexcol">
    <SkillsCard />
    <ToolsCard />
  </div>
  <div class="right flexcol">
    <SavingThrowsCard />
    <CharacterTraits />
  </div>
</div>
