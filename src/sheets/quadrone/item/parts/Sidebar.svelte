<script lang="ts">
  import { RarityColors } from 'src/features/rarity-colors/RarityColors';
  import { getContainerOrItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import ItemImageBorder from './ItemImageBorder.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import PillSwitch from 'src/components/toggles/PillSwitch.svelte';
  import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SpellUtils } from 'src/utils/SpellUtils';
  import { coalesce } from 'src/utils/formatting';
  import type { Snippet } from 'svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';

  let context = $derived(getContainerOrItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  interface Props {
    itemSpecificSnippet?: Snippet;
  }

  let { itemSpecificSnippet }: Props = $props();

  // Rarity
  let rarity = $derived(
    context.unlocked ? context.source.rarity : context.system.rarity,
  );

  let rarityColorVariable = $derived(
    'rarity' in context.system
      ? RarityColors.getRarityColorVariableName(rarity)
      : '',
  );

  let rarityText = $derived(RarityColors.getRarityText(rarity).titleCase());

  let itemRarities = $derived(
    Object.entries(context.config.itemRarity).map(([key, value]) => {
      return {
        key,
        label: value,
        rarityColorVariableName: RarityColors.getRarityColorVariableName(key),
      };
    }),
  );

  // Spell Preparation

  let spellPreparationText = $derived(
    'preparation' in context.system
      ? (CONFIG.DND5E.spellPreparationModes[context.system.preparation.mode]
          ?.label ?? context.system.preparation.mode)
      : '',
  );

  let spellPreparationColor = $derived(
    'preparation' in context.system
      ? SpellUtils.getSpellPreparationIconColorVariableName(
          context.system.preparation?.mode,
        )
      : '',
  );

  // Custom Sections

  let section = $derived(
    TidyFlags.section.get(context.item) ?? localize('Default'),
  );

  let actionSection = $derived(
    TidyFlags.actionSection.get(context.item) ?? localize('Default'),
  );

  let showCustomSections = $derived(
    SheetSections.itemSupportsCustomSections(context.item.type),
  );

  // Identification

  let identifiedText = $derived(
    context.system.identified
      ? localize('DND5E.Identified')
      : localize('DND5E.Unidentified.Title'),
  );

  // Combined

  let filigreeColorVariable = $derived(
    coalesce(rarityColorVariable, spellPreparationColor),
  );
  let imageLabelColorVariable = $derived(
    coalesce(rarityColorVariable, spellPreparationColor),
  );
</script>

<aside
  class="sidebar dark"
  style=" 
    --filigree-border-color: var({filigreeColorVariable}, var(--t5e-color-gold))"
>
  <div>
    <div class="item-image-container">
      <img class="item-image" src={context.item.img} alt={context.item.name} />
      <ItemImageBorder />
    </div>
    {#if 'rarity' in context.system}
      <div
        class="item-rarity-container"
        style="--t5e-item-rarity-color: var({imageLabelColorVariable}, var(--t5e-color-gold));"
      >
        {#if context.unlocked}
          <SelectQuadrone
            id="rarity-{context.item.sheet.id}"
            document={context.item}
            field="system.rarity"
            class="item-rarity-selector capitalize"
            value={context.source.rarity}
            disabled={!context.editable}
            blankValue=""
          >
            <option
              value=""
              style="--t5e-item-rarity-color: var(--t5e-color-gold);"
              >{localize('DND5E.None')}</option
            >
            {#each itemRarities as rarity (rarity.key)}
              <option
                value={rarity.key}
                style="--t5e-item-rarity-color: var({rarity.rarityColorVariableName}, var(--t5e-color-text-oninverse-default));"
              >
                {rarity.label}
              </option>
            {/each}
          </SelectQuadrone>
        {:else}
          <div class="item-rarity-text">{rarityText}</div>
        {/if}
      </div>
    {:else if 'preparation' in context.system}
      <div
        class="spell-preparation-text"
        style="--t5e-image-label-spell-preparation-text-color: var({imageLabelColorVariable}, var(--t5e-color-gold));"
      >
        {spellPreparationText}
      </div>
    {/if}
  </div>

  <!-- Item States -->

  <ul class="pills stacked">
    {#if 'equipped' in context.system}
      <li>
        <PillSwitch
          checked={context.system.equipped}
          checkedIconClass="fas fa-hand-fist equip-icon fa-fw"
          uncheckedIconClass="far fa-hand fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.equipped': ev.currentTarget?.checked,
            })}
          disabled={!context.editable}
        >
          {localize('DND5E.Equipped')}
        </PillSwitch>
      </li>
    {/if}
    {#if FoundryAdapter.isAttunementApplicable(context.item)}
      <li>
        <PillSwitch
          checked={context.system.attuned}
          checkedIconClass="fas fa-sun equip-icon fa-fw"
          uncheckedIconClass="fas fa-sun equip-icon fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.attuned': ev.currentTarget?.checked,
            })}
          disabled={!context.editable}
        >
          {localize('DND5E.Attuned')}
        </PillSwitch>
      </li>
    {/if}
    {#if 'identified' in context.system && context.unlocked}
      {#if context.system.identified}
        <li>
          <PillSwitch
            checked={context.system.identified}
            checkedIconClass="fas fa-search fa-fw"
            uncheckedIconClass="fas fa-search fa-fw"
            onchange={(ev) =>
              context.item.update({
                'system.identified': ev.currentTarget?.checked,
              })}
            disabled={!context.editable}
          >
            {localize('DND5E.Identified')}
          </PillSwitch>
        </li>
      {:else}
        <li class="pill">
          <i class="fas fa-search"></i>
          <span class="label">
            {identifiedText}
          </span>
        </li>
      {/if}
    {/if}
  </ul>

  <!-- Item Info: Longform -->
  <!-- TODO: Implement -->

  {#if itemSpecificSnippet}
    {@render itemSpecificSnippet()}
  {/if}

  <!-- Item Info: Pills -->
  <!-- TODO: Turn into array of pill objects in array of group header names; implement for each item type -->

  {#if !context.concealDetails}
    {#if context.labels.toHit || context.labels.damages.length}
      <div>
        <h4>
          {localize('DND5E.Attack')}/{localize('DND5E.Damage')}
        </h4>
        <ul class="pills stacked" inert={context.concealDetails}>
          {#if context.labels.save}
            <li class="pill">
              {context.labels.save}
            </li>
          {/if}
          {#if context.labels.toHit}
            <li class="pill">
              {context.labels.toHit}
              {localize('DND5E.ToHit')}
            </li>
          {/if}
          {#each context.labels.damages ?? [] as damage}
            {@const label = damage.label}
            <li class="pill">
              {label}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}

  <!-- Custom Sections -->

  {#if showCustomSections}
    <div>
      <h4>{localize('TIDY5E.Section.LabelPl')}</h4>
      <div class="pills stacked">
        <a
          title={localize('TIDY5E.Section.SectionSelectorChooseSectionTooltip')}
          class="pill interactive wrapped no-row-gap"
          class:disabled={!context.editable}
          onclick={() =>
            new SectionSelectorApplication(
              context.item,
              TidyFlags.section.prop,
              localize('TIDY5E.Section.Label'),
            ).render(true)}
        >
          <span class="lighter centered">
            {localize('DND5E.Inventory')}
          </span>
          <span class="hyphens-auto centered">
            {section}
          </span>
        </a>
        <a
          class="pill interactive wrapped no-row-gap"
          class:disabled={!context.editable}
          title={localize(
            'TIDY5E.Section.SectionSelectorChooseActionSectionTooltip',
          )}
          onclick={() =>
            new SectionSelectorApplication(
              context.item,
              TidyFlags.actionSection.prop,
              localize('TIDY5E.Section.ActionLabel'),
            ).render(true)}
        >
          <span class="lighter centered">
            {localize('TIDY5E.Actions.TabName')}
          </span>
          <span class="hyphens-auto centered">
            {actionSection}
          </span>
        </a>
      </div>
    </div>
  {/if}
</aside>
