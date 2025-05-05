<script lang="ts">
  let size = 'Medium';
  let alignment = 'Lawful Neutral';
  let species = 'Quadrone';
  let showXp = false; // TODO: Add this

  let speeds = $state([
    {
      name: 'Walk',
      value: 30,
      unit: 'ft',
    },
    {
      name: 'Fly',
      value: 30,
      unit: 'ft',
    },
  ]);

  let classes = $state([
    {
      name: 'Warlock',
      value: 3,
      dc: 15,
      ability: 'CHA',
    },
  ]);
  
</script>

<div class="flexrow">
  <div class="character-subtitle">
  {#each speeds as speed}
  <span class="speed">
    <span class="color-text-gold font-label-medium">{speed.name}</span>
    <span class="color-text-default font-data-medium">{speed.value}</span>
    <span class="color-text-lighter font-label-medium">{speed.unit}</span>
  </span>
  {/each}
  <span class="species">
    <span class="color-text-gold">{species}</span>
  </span>
  <span class="size">
    <span class="color-text-gold">{size}</span>
  </span>
  <span class="alignment">
    <span class="color-text-gold">{alignment}</span>
  </span>
  {#each classes as classDisplay}
  <span class="class">
    <span class="color-text-gold font-label-medium">{classDisplay.name}</span>
    <span class="color-text-default font-data-medium">{classDisplay.value}</span>
    <!-- TODO: Add button to roll a save request to chat here (enricher?) -->
    <span class="color-text-lighter font-label-medium dc">{classDisplay.ability} DC</span>
    <span class="color-text-default font-data-medium">{classDisplay.dc}</span>
  </span>
  {/each}
  </div>
  {#if showXp}
  <div class="xp-container">
    Literally have never used this.
  </div>
  {/if}
</div>
