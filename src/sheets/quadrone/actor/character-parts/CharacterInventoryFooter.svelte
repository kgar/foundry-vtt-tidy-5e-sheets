<script lang="ts">
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import AttunementSummaryTooltip from 'src/tooltips/AttunementSummaryTooltip.svelte';
  import type { Item5e } from 'src/types/item.types';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
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

  const localize = FoundryAdapter.localize;

  function onAddClicked() {
    context.actor.sheet._addDocument({
      tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
    });
  }

  let attunedItems = $derived(
    context.actor.items
      .filter((i: Item5e) => i.system.attuned)
      .sort((a: Item5e, b: Item5e) =>
        a.name.localeCompare(b.name, game.i18n.lang),
      ),
  );

  let attunementSummaryTooltip: AttunementSummaryTooltip;

  function showAttunementSummaryTooltip(
    event: Event & { currentTarget: EventTarget & HTMLElement },
  ): any {
    if (!attunedItems.length) {
      return;
    }

    Tooltip.show(
      event?.currentTarget,
      attunementSummaryTooltip.getMarkup(),
      getThemeV2(context.actor),
    );
  }

  let overattuned = $derived(
    context.actor.system.attributes.attunement.value >
      context.actor.system.attributes.attunement.max,
  );

  let attuned = $derived(context.system.attributes.attunement.value > 0);
</script>

<div class="hidden">
  <AttunementSummaryTooltip
    bind:this={attunementSummaryTooltip}
    {attunedItems}
  />
</div>

<!-- should we use `<footer>`? We'd need to ensure an appropriate ancestor `<section>` -->
<div class={['sheet-footer', 'fixed', 'flexrow', 'inventory-footer', classValue]}>

  <div class="footer-content-left flexrow flexshrink">
    <div
      class={['pill pill-medium interactive attunement-tracker flexshrink', 
              { 'overattuned': overattuned }, { 'attuned': attuned }
      ]}
      data-tooltip-direction="UP"
      role="region"
      onmouseover={(ev) => showAttunementSummaryTooltip(ev)}
      onfocus={(ev) => showAttunementSummaryTooltip(ev)}
    >
      <i class={`fa-sun ${attuned ? 'fas color-text-gold-emphasis' : 'far color-text-lighter'}`}></i>
      <span class="value font-data-medium">{context.system.attributes.attunement.value}</span>
      <span class="separator">/</span>
      {#if context.unlocked}
        <NumberInputQuadrone
          document={context.actor}
          field="system.attributes.attunement.max"
          value={context.system.attributes.attunement.max}
          class="max"
          step="1"
          min="0"
        />
      {:else}
        <span class="max font-label-medium">
          {context.system.attributes.attunement.max}
        </span>
      {/if}
      <span class="font-label-medium color-text-lighter">
        {localize('DND5E.Attuned')}
      </span>
    </div>
  </div>

  <div class="currency-container flexrow flex1">
    {#each context.currencies as currency (currency.key)}
      <label class="input-group">
        <i class="currency {currency.key}" aria-label={currency.key}></i>
        <TextInputQuadrone
          document={context.document}
          field="system.currency.{currency.key}"
          id="{context.document.id}-system.currency.{currency.key}"
          value={currency.value}
          enableDeltaChanges={true}
          selectOnFocus={true}
          disabled={!context.editable}
          class="currency-item currency-{currency.key}"
          placeholder="0"
        />
        <span class="denomination {currency.key}" data-denom={currency.key}>
          {currency.abbr}
        </span>
      </label>
    {/each}
  </div>

  <div class="footer-content-right flexrow flexshrink">
    {#if context.editable}
      <a
        class="button button-icon-only currency-conversion flexshrink"
        class:disabled={!context.editable}
        onclick={() =>
          context.owner &&
          new dnd5e.applications.CurrencyManager({
            document: context.document,
          }).render(true)}
        data-tooltip="DND5E.CurrencyManager.Title"
      >
        <i class="fas fa-database"></i>
      </a>
    {/if}

    <a
      data-tooltip="DND5E.ItemCreate"
      class="button button-icon-only button-primary item-create flexshrink"
      class:disabled={!context.editable}
      onclick={onAddClicked}
    >
      <i class="fas fa-plus"></i>
    </a>
  </div>
</div>
