<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { formatAsModifier } from 'src/utils/formatting';
  import BlockTitle from './RollableBlockTitle.svelte';
  import BlockScore from './BlockScore.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import D20Icon from '../shared/D20Icon.svelte';

  interface Props {
    initiative: { total: number; bonus: number };
  }

  let { initiative }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  let appId = $derived(context.actor.id);

  const localize = FoundryAdapter.localize;
</script>

<div class="initiative-container">
  <div class="d20-icon-container">
    <D20Icon />
  </div>
  <div class="block-score-wrapper">
    <BlockTitle
      title={localize('DND5E.Initiative')}
      text={localize('TIDY5E.AbbrInitiative')}
      onRoll={(event) => context.actor.rollInitiativeDialog({ event: event })}
    />
    <BlockScore>
      <span class="ini-score"
        >{formatAsModifier(initiative.total)}

        {#if context.editable && context.unlocked}
          <a
            class="config-button icon-button"
            title={localize('DND5E.InitiativeConfig')}
            onclick={() => FoundryAdapter.renderInitiativeConfig(context.actor)}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-cog"></i>
          </a>
        {/if}
      </span>
    </BlockScore>
  </div>
</div>

<style lang="scss">
  .initiative-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .d20-icon-container {
    --icon-d20-outline-fill: var(--t5e-light-color);
    --icon-d20-face-fill: transparent;
    --icon-size: 4.125rem;
  }

  .block-score-wrapper {
    position: absolute;
    inset: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-block-start: 0.125rem;

    .ini-score {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;

      .config-button {
        font-size: 0.625rem;
        color: var(--t5e-tertiary-color);
        min-height: 0.75rem;
      }
    }
  }
</style>
