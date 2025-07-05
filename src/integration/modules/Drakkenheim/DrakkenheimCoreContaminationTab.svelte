<script lang="ts">
  import Pips from 'src/components/pips/Pips.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetContextV1,
    ActorSheetClassicContextV2,
    ActorSheetQuadroneContext,
  } from 'src/types/types';
  import { DRAKKENHEIM_CORE_CONSTANTS } from './DrakkenheimCoreConstants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  const context =
    $derived(
      getSheetContext<ActorSheetClassicContextV2 | ActorSheetQuadroneContext>(),
    );

  let contanimationLevel = $derived(
    FoundryAdapter.getProperty<number | undefined>(
      context.actor,
      DRAKKENHEIM_CORE_CONSTANTS.CONTAMINATION_LEVEL_FLAG_PROP,
    ) ?? 0,
  );

  let levels = $derived(Array.fromRange(6, 1));

  async function onContaminationLevelChanged(level: number): Promise<void> {
    await context.actor.update({
      [DRAKKENHEIM_CORE_CONSTANTS.CONTAMINATION_LEVEL_FLAG_PROP]: level,
    });
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="scroll-container">
  <div class="description">
    {localize('DRAKKENHEIM.ContaminationTable')}
  </div>
  <table class="contamination-table">
    <thead>
      <tr>
        <th class="symptom">{localize('DRAKKENHEIM.ContaminationSymptoms')}</th>
      </tr>
    </thead>
    <tbody>
      {#each levels as level}
        <tr class:active={level <= contanimationLevel}>
          <td class="symptom">
            {localize(`DRAKKENHEIM.ContaminationEffect${level}`)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <Pips
    total={levels.length}
    selected={contanimationLevel}
    onChange={(ev) => onContaminationLevelChanged(ev)}
  />
</div>
