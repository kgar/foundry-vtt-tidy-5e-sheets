<script lang="ts">
  import { settings } from 'src/settings/settings.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let totalsaves = 6;

  let context = $derived(getCharacterSheetQuadroneContext());

  let halfSaves = $derived(Math.floor(totalsaves / 2));
</script>

<!-- TODO: Need Death Save config button on unlocked -->

<div class="death-saves-overlay">
  <div class="failures flexcol">
    {#each Array(halfSaves) as _, i}
      <!-- Make these into actual buttons; onclick increments when unchecked and decrements when checked -->
      <label
        class="button button-borderless button-icon-only"
        class:checked={failureChecks[i]}
      >
        <input type="checkbox" bind:checked={failureChecks[i]} />
        <i class="fas fa-skull"></i>
      </label>
    {/each}
  </div>
  <button
    type="button"
    onclick={(event) =>
      context.actor.rollDeathSave(
        {
          event: event,
          legacy: false,
        },
        {
          options: {
            default: {
              rollMode: settings.value.defaultDeathSaveRoll,
            },
          },
        },
      )}
    class="death-save-roll-button button button-borderless button-icon-only"
  >
    <i class="fa-light fa-dice-d20"></i>
  </button>
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
