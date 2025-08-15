<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    doc: any;
  }

  let { doc }: Props = $props();

  let config = $derived(FoundryAdapter.getSpellMethodConfig(doc));
  let method = $derived(config.key);

  let iconClasses: ClassValue = $derived([
    'spell-row-icon',
    FoundryAdapter.getSpellIcon(doc),
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
