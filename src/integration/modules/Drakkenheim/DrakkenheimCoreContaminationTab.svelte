<script lang="ts">
  import Pips from 'src/components/pips/Pips.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetClassicContextV2,
    ActorSheetQuadroneContext,
  } from 'src/types/types';
  import { DRAKKENHEIM_CORE_CONSTANTS } from './DrakkenheimCoreConstants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  const context =
    $derived(
      getSheetContext<ActorSheetClassicContextV2 | ActorSheetQuadroneContext>(),
    );

  const localize = FoundryAdapter.localize;

  let contanimationLevel = $derived(
    FoundryAdapter.getProperty<number | undefined>(
      context.actor,
      DRAKKENHEIM_CORE_CONSTANTS.CONTAMINATION_LEVEL_FLAG_PROP,
    ) ?? 0,
  );

  let levels = Array.fromRange(6, 1);

  let version = FoundryAdapter.getGameSetting(
    DRAKKENHEIM_CORE_CONSTANTS.MODULE_ID,
    DRAKKENHEIM_CORE_CONSTANTS.SETTING_VERSION,
  );

  let enrichedPromises = levels.map((level) =>
    foundry.applications.ux.TextEditor.enrichHTML(
      localize(`DRAKKENHEIM.CONTAMINATION.LEVELS.${version}${level}`),
    ),
  );

  async function onContaminationLevelChanged(level: number): Promise<void> {
    await context.actor.update({
      [DRAKKENHEIM_CORE_CONSTANTS.CONTAMINATION_LEVEL_FLAG_PROP]: level,
    });
  }
</script>

<div class="scroll-container">
  <div class="description">
    {localize('DRAKKENHEIM.CONTAMINATION.TABLE.caption')}
  </div>
  <table class="contamination-table">
    <thead class="theme-dark">
      <tr>
        <th class="symptom">{localize('DRAKKENHEIM.CONTAMINATION.TABLE.symptoms')}</th>
      </tr>
    </thead>
    <tbody>
      {#each enrichedPromises as promise, i}
        {@const level = i + 1}
        <tr class:active={level <= contanimationLevel}>
          <td class="symptom">
            {#await promise then text}
              {@html text}
            {/await}
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
