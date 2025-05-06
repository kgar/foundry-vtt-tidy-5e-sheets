<script lang="ts">
  interface Props {
    showXp?: boolean;
  }

  let { showXp = false }: Props = $props();
  let size = 'Medium';
  let alignment = 'Lawful Neutral';
  let species = 'Quadrone';


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

<div class="character-details-subtitle-row">
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
    <div class="xp-label">
      <span class="label font-label-medium color-text-gold">XP</span>
      <span class="label font-label-medium color-text-default">12,345</span>
      <span class="separator">/</span>
      <span class="label font-body-medium color-text-lighter">17,500</span>
    </div>
    <div class="xp-bar xp meter progress"
      style="--bar-percentage: 50%;">
      <span class="xp-bar-current" style="width: 50%"></span>
    </div>
  </div>
  {/if}
</div>
