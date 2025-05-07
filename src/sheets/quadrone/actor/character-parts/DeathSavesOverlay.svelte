<script lang="ts">
  let totalsaves = 6;

  let halfSaves = $derived(Math.floor(totalsaves / 2));

  let failureChecks = $derived(Array(halfSaves).fill(false));
  let successChecks = $derived(Array(halfSaves).fill(false));
</script>

<!-- TODO: Need Death Save roll button -->
<!-- TODO: Need Death Save config button on unlocked -->

<div class="death-saves-overlay">
  <div class="failures flexcol">
    {#each Array(halfSaves) as _, i}
      <label
        class="button button-borderless button-icon-only"
        class:checked={failureChecks[i]}
      >
        <input type="checkbox" bind:checked={failureChecks[i]} />
        <i class="fas fa-skull"></i>
      </label>
    {/each}
  </div>
  <div class="successes flexcol">
    {#each Array(halfSaves) as _, i}
      <label
        class="button button-borderless button-icon-only"
        class:checked={successChecks[i]}
      >
        <input type="checkbox" bind:checked={successChecks[i]} />
        <i class="fas fa-heart"></i>
      </label>
    {/each}
  </div>
</div>
