<script lang="ts">
  let totalsaves = 6;
  
  // Calculate how many buttons to show in each section
  $: halfSaves = Math.floor(totalsaves / 2);

  // Arrays to track checked state of each checkbox
  let failureChecks = Array(halfSaves).fill(false);
  let successChecks = Array(halfSaves).fill(false);
  
  // Export the dead property to parent component
  export let dead = false;
  
  // Calculate dead status reactively based on failure checks
  $: {
    dead = failureChecks.every(check => check);
  }
</script>

<div class="death-saves-overlay">
  <div class="failures flexcol">
    {#each Array(halfSaves) as _, i}
      <label class="button button-borderless button-icon-only" class:checked={failureChecks[i]}>
        <input type="checkbox" bind:checked={failureChecks[i]} />
        <i class="fas fa-skull"></i>
      </label>
    {/each}
  </div>
  <div class="successes flexcol">
    {#each Array(halfSaves) as _, i}
      <label class="button button-borderless button-icon-only" class:checked={successChecks[i]}>
        <input type="checkbox" bind:checked={successChecks[i]} />
        <i class="fas fa-heart"></i>
      </label>
    {/each}
  </div>
</div>
