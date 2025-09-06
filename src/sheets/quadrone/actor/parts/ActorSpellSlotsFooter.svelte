<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    class?: ClassValue;
  }

  let { class: classValue }: Props = $props();

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let slotSections: SpellbookSection[] = $derived(
    (context.spellbook ?? []).filter((s) => s.usesSlots),
  );

  const localize = FoundryAdapter.localize;

  function toRoman(level: number): string {
    const romans = ['—', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return romans[level] || level.toString();
  }

  function labelFor(section: SpellbookSection): string {
    const lvl: unknown = section?.dataset?.['system.level'];
    if (typeof lvl === 'number' && Number.isFinite(lvl)) {
      return toRoman(lvl);
    }
    if (section.slot === 'pact') {
      return localize('DND5E.SpellProgPact');
    }
    return section.label || '?';
  }

  function onConfigureSpellSlots() {
    // Open the spell slots configuration dialog
    FoundryAdapter.openSpellSlotsConfig(context.actor);
  }
</script>

{#if slotSections.length > 0}
  <div class={['sheet-footer spell-slots-footer flexrow', classValue]}>
    <div class="sheet-footer-left spell-slots-card flexrow">
      <div class="spell-slots-card-content flexrow">
        <div class="header flexshrink">
          <span class="name font-title-small">Spell Slots</span>
        </div>
        <div class="info pills flex1">
          {#each slotSections as section, i (section.key)}
            <span class="slot-entry">
              <span class="level color-text-gold">{labelFor(section)}</span>
              <span class="sep">:</span>
              <span class="value color-text-default">{section.uses ?? 0}</span>
              <span class="sep">/</span>
              <span class="max color-text-lighter">{section.slots ?? 0}</span>
            </span>
            {#if i < slotSections.length - 1}
              <span class="dot color-text-lighter">•</span>
            {/if}
          {/each}
          {#if context.unlocked}
            <button
              type="button"
              class="spell-slot-config"
              title={localize('DND5E.SpellSlotsConfig')}
              aria-label={localize('DND5E.SpellSlotsConfig')}
              onclick={onConfigureSpellSlots}
            >
              <i class="fas fa-cog"></i>
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
