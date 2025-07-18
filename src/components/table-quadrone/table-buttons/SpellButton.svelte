<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  let method = $derived(doc.system.method ?? '');
  let config = $derived(CONFIG.DND5E.spellcasting[method]);

  function getIconClasses(): ClassValue {
    let classes: ClassValue = [];

    if (config?.prepares) {
      classes.push(
        doc.system.prepared ===
          CONFIG.DND5E.spellPreparationStates.prepared.value
          ? 'fa-solid prepared'
          : doc.system.prepared ===
              CONFIG.DND5E.spellPreparationStates.always.value
            ? 'fa-solid always'
            : 'fa-regular unprepared',
      );
    }

    switch (method) {
      case CONSTANTS.SPELL_PREPARATION_METHOD_SPELL:
        classes.push('fa-book');
        break;
      case CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL:
        classes.push('fa-hand-sparkles');
        break;
      case CONSTANTS.SPELL_PREPARATION_METHOD_INNATE:
        classes.push('fa-hand-holding-magic');
        break;
      case CONSTANTS.SPELL_PREPARATION_METHOD_PACT:
        classes.push('fa-moon');
        break;
      case CONSTANTS.SPELL_PREPARATION_METHOD_RITUAL:
        classes.push('fa-candle-holder');
        break;
      default:
        classes.push('fa-sparkles');
        break;
    }

    return classes;
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
  {#if FoundryAdapter.canPrepareSpell(doc)}
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
