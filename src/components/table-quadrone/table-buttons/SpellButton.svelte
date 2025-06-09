<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  const localize = FoundryAdapter.localize;

  let mode = $derived(doc.system.preparation?.mode ?? '');

  function getIconClasses() {
    switch (mode) {
      case CONSTANTS.SPELL_PREPARATION_MODE_PREPARED:
        let prepared = doc.system.preparation.prepared;
        return prepared
          ? 'fa-solid fa-book prepared'
          : 'fa-light fa-book unprepared';
      case CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS:
        return 'fa-solid fa-book';
      case CONSTANTS.SPELL_PREPARATION_MODE_ATWILL:
        return 'fa-solid fa-hand-sparkles';
      case CONSTANTS.SPELL_PREPARATION_MODE_INNATE:
        return 'fa-solid fa-hand-holding-magic';
      case CONSTANTS.SPELL_PREPARATION_MODE_PACT:
        return 'fa-solid fa-moon';
      case CONSTANTS.SPELL_PREPARATION_MODE_RITUAL:
        return 'fa-solid fa-candle-holder';
      default:
        return 'fa-solid fa-sparkles';
    }
  }

  let modeIconClasses: ClassValue = $derived([
    'spell-row-icon',
    getIconClasses(),
    `mode-${mode}`,
  ]);

  async function togglePreparation() {
    doc.update({
      'system.preparation.prepared': !doc.system.preparation?.prepared,
    });
  }

  let tooltip = $derived.by(() => {
    let mode = doc.system.preparation?.mode ?? '';

    if (mode === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED) {
      return doc.system.preparation.prepared
        ? 'DND5E.SpellPrepared'
        : 'DND5E.SpellUnprepared';
    }

    return CONFIG.DND5E.spellPreparationModes[mode]?.label ?? mode;
  });
</script>

{#if mode === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED}
  <a
    data-tooltip={tooltip}
    class="tidy-table-button"
    onclick={togglePreparation}
  >
    <i class={modeIconClasses}></i>
  </a>
{:else}
  {@const iconClasses = getIconClasses()}
  <i data-tooltip={tooltip} class={modeIconClasses}></i>
{/if}
