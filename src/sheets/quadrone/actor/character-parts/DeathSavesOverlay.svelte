<script lang="ts">
  import { settings } from 'src/settings/settings.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  // TODO: Use the same hooks and sheet parts that supports the Hidden Death Saves module.

  let totalsaves = 6;

  let context = $derived(getCharacterSheetQuadroneContext());

  let halfSaves = $derived(Math.floor(totalsaves / 2));

  let successes = $derived(context.system.attributes.death.success);
  let failures = $derived(context.system.attributes.death.failure);

  async function incrementDeathSave(path: string, value: number) {
    const adjustment = Math.min(value + 1, 3);
    return await setDeathSave(path, adjustment);
  }

  async function decrementDeathSave(path: string, value: number) {
    const adjustment = Math.max(value - 1, 0);
    return await setDeathSave(path, adjustment);
  }

  async function setDeathSave(path: string, value: number) {
    return await context.actor.update({
      [path]: value,
    });
  }
</script>

<div class="death-saves-overlay">
  <div class="failures flexcol">
    {#each Array(halfSaves) as _, i}
      {@const filled = failures >= i + 1}
      {@const path = 'system.attributes.death.failure'}
      <button
        type="button"
        class={[
          'button button-borderless button-icon-only',
          { checked: filled },
        ]}
        onclick={() =>
          filled
            ? decrementDeathSave(path, failures)
            : incrementDeathSave(path, failures)}
      >
        <i class="fas fa-skull"></i>
      </button>
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
    data-tooltip="DND5E.DeathSave"
  >
    <i class="fas fa-dice-d20"></i>
  </button>
  <div class="successes flexcol">
    {#each Array(halfSaves) as _, i}
      {@const filled = successes >= i + 1}
      {@const path = 'system.attributes.death.success'}
      <button
        type="button"
        class={[
          'button button-borderless button-icon-only',
          { checked: filled },
        ]}
        onclick={(ev) =>
          filled
            ? decrementDeathSave(path, successes)
            : incrementDeathSave(path, successes)}
      >
        <i class="fas fa-heart"></i>
      </button>
    {/each}
  </div>
</div>
