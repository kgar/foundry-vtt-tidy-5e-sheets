<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  let method = $derived(doc.system.preparation?.mode ?? '');
  let config = $derived(CONFIG.DND5E.spellcasting[method]);

  function getIconClasses() {
    if (config?.prepares) {
      return doc.system.prepared ===
        CONFIG.DND5E.spellPreparationStates.prepared.value
        ? 'fa-solid fa-book prepared'
        : doc.system.prepared ===
            CONFIG.DND5E.spellPreparationStates.always.value
          ? 'fa-solid fa-book always'
          : 'fa-regular fa-book unprepared';
    }

    switch (method) {
      case CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL:
        return 'fa-solid fa-hand-sparkles';
      case CONSTANTS.SPELL_PREPARATION_METHOD_INNATE:
        return 'fa-solid fa-hand-holding-magic';
      case CONSTANTS.SPELL_PREPARATION_METHOD_PACT:
        return 'fa-solid fa-moon';
      case CONSTANTS.SPELL_PREPARATION_METHOD_RITUAL:
        return 'fa-solid fa-candle-holder';
      default:
        return 'fa-solid fa-sparkles';
    }
  }

  let iconClasses: ClassValue = $derived([
    'spell-row-icon',
    getIconClasses(),
    {
      [`method-${method}`]: !isNil(method, ''),
    },
  ]);

  async function togglePreparation() {
    let newPreparationValue = ((doc.system.prepared ?? 0) + 1) % 2;

    doc.update({
      'system.prepared': newPreparationValue,
    });
  }

  let tooltip = $derived.by(() => {
    if (config.prepares) {
      return doc.system.prepared ===
        CONFIG.DND5E.spellPreparationStates.prepared.value
        ? 'DND5E.SpellPrepared'
        : doc.system.prepared ===
            CONFIG.DND5E.spellPreparationStates.always.value
          ? 'DND5E.SpellPrepAlways'
          : 'DND5E.SpellUnprepared';
    }

    return config?.label ?? method;
  });
</script>

{#if !doc.system.linkedActivity}
  {#if config.prepares}
    <a
      data-tooltip={tooltip}
      class="tidy-table-button"
      onclick={togglePreparation}
    >
      <i class={iconClasses}></i>
    </a>
  {:else}
    <i data-tooltip={tooltip} class={iconClasses}></i>
  {/if}
{/if}
