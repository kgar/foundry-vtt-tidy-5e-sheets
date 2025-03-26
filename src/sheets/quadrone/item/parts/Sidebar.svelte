<script lang="ts">
  import { RarityColors } from 'src/features/rarity-colors/RarityColors';
  import { getContainerOrItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import ItemImageBorder from './ItemImageBorder.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import PillSwitch from 'src/components/toggles/PillSwitch.svelte';
  import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { Snippet } from 'svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import type { Item5e } from 'src/types/item.types';
  import { CONSTANTS } from 'src/constants';
  import { isNil } from 'src/utils/data';
  import type { ClassValue } from 'svelte/elements';
  import { ItemContext } from 'src/features/item/ItemContext';

  let context = $derived(getContainerOrItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  interface Props {
    belowStateSwitches?: Snippet;
    aboveCustomSections?: Snippet;
  }

  let { belowStateSwitches, aboveCustomSections }: Props = $props();

  // Rarity
  let rarity = $derived(
    context.unlocked ? context.source.rarity : context.system.rarity,
  );

  let rarityText = $derived(
    context.system.identified === false
      ? localize('DND5E.Unidentified.Title')
      : RarityColors.getRarityText(rarity).titleCase(),
  );

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
    'preparation' in context.system &&
      context.system.preparation.mode !==
        CONSTANTS.SPELL_PREPARATION_MODE_PREPARED
      ? (CONFIG.DND5E.spellPreparationModes[context.system.preparation.mode]
          ?.label ?? context.system.preparation.mode)
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

  // Combined

  function openItemImagePicker(target: HTMLElement, item: Item5e) {
    const rect = target.getBoundingClientRect();
    const current = item.img;
    return FoundryAdapter.browseFilePicker({
      type: 'image',
      current,
      callback: (path: string) => {
        item.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
  }

  function showItemArt(item: Item5e) {
    FoundryAdapter.renderImagePopout(item.img, {
      title: FoundryAdapter.localize('TIDY5E.ItemImageTitle', {
        subject: item.name,
      }),
      shareable: true,
      uuid: item.uuid,
    });
  }

  // TODO: Consider a reusable function and also feeding it through item context for item sheets.
  let itemColorClasses = $derived<ClassValue>([
    context.system.identified === false ? 'unidentified' : undefined,
    !isNil(rarity, '') ? 'rarity' : undefined,
    coalesce(rarity?.slugify(), 'none'),
    !isNil(context.system.preparation?.mode) ? 'spell-preparation' : undefined,
    context.system.preparation?.mode?.slugify(),
  ]);

  let saveContext = $derived(ItemContext.getItemSaveContext(context.item));

  let offensePills: Snippet[] = $derived.by(() => {
    let result: Snippet[] = [];

    if (context.labels.toHit) {
      result.push(toHitPill);
    }

    if (saveContext?.dc) {
      result.push(savePill);
    }

    if (context.labels.damages.length) {
      result.push(damagePills);
    }

    return result;
  });
</script>

<aside class={['sidebar', 'theme-dark']}>
  <div>
    <div class={['item-image-container', itemColorClasses]}>
      <a
        onclick={(ev) =>
          context.unlocked
            ? openItemImagePicker(ev.currentTarget, context.item)
            : showItemArt(context.item)}
      >
        <img
          class="item-image"
          src={context.item.img}
          alt={context.item.name}
        />
      </a>
      <ItemImageBorder />
    </div>
    {#if 'rarity' in context.system}
      <div class="item-rarity-container">
        {#if context.unlocked}
          <SelectQuadrone
            id="rarity-{context.item.sheet.id}"
            document={context.item}
            field="system.rarity"
            class={['item-rarity-selector', 'capitalize', itemColorClasses]}
            value={context.source.rarity}
            disabled={!context.editable}
            blankValue=""
          >
            <option class="none" value="">{localize('DND5E.None')}</option>
            {#each itemRarities as rarity (rarity.key)}
              <option
                value={rarity.key}
                class={['rarity', rarity.key.slugify()]}
              >
                {rarity.label}
              </option>
            {/each}
          </SelectQuadrone>
        {:else}
          <div class={['item-rarity-text', itemColorClasses]}>{rarityText}</div>
        {/if}
      </div>
    {:else if 'preparation' in context.system}
      <div class={['spell-preparation-text', itemColorClasses]}>
        {spellPreparationText}
      </div>
    {/if}
  </div>

  <!-- Item States -->
  <!-- TODO: Possibly extract component, make into snippets, stack into array, and don't render if there are no state pills. -->
  <ul class="pills stacked">
    {#if 'equipped' in context.system}
      {@const checkedIconClass = 'fas fa-hand-fist equip-icon fa-fw'}
      {@const uncheckedIconClass = 'far fa-hand fa-fw'}
      {@const equipped = context.system.equipped}
      <li>
        <PillSwitch
          checked={equipped}
          {checkedIconClass}
          {uncheckedIconClass}
          onchange={(ev) =>
            context.item.update({
              'system.equipped': ev.currentTarget?.checked,
            })}
          disabled={!context.editable}
        >
          {#if !context.editable && !equipped}
            {localize('DND5E.Unequipped')}
          {:else}
            {localize('DND5E.Equipped')}
          {/if}
        </PillSwitch>
      </li>
    {/if}
    {#if FoundryAdapter.isAttunementApplicable(context.item)}
      {@const attuned = context.system.attuned}
      <li>
        <PillSwitch
          checked={attuned}
          checkedIconClass="fas fa-sun equip-icon fa-fw"
          uncheckedIconClass="fas fa-sun equip-icon fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.attuned': ev.currentTarget?.checked,
            })}
          disabled={!context.editable}
        >
          {#if !attuned && !context.editable}
            {CONFIG.DND5E.attunementTypes[context.system.attunement] ??
              context.system.attunement}
          {:else}
            {localize('DND5E.Attuned')}
          {/if}
        </PillSwitch>
      </li>
    {/if}
    {#if 'identified' in context.system}
      {@const unidentified = context.system.identified === false}

      <li>
        <PillSwitch
          checked={context.system.identified}
          checkedIconClass="fas fa-search fa-fw"
          uncheckedIconClass="fas fa-search fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.identified': ev.currentTarget?.checked,
            })}
          disabled={!context.unlocked}
        >
          {#if !context.editable && unidentified}
            {localize('DND5E.Unidentified.Title')}
          {:else}
            {localize('DND5E.Identified')}
          {/if}
        </PillSwitch>
      </li>
    {/if}
    {#if context.system.preparation?.mode === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED}
      {@const prepared = context.system.preparation.prepared}
      <li>
        <PillSwitch
          checked={prepared}
          checkedIconClass="fas fa-book fa-fw"
          uncheckedIconClass="fas fa-book fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.preparation.prepared': ev.currentTarget?.checked,
            })}
          disabled={!context.editable}
        >
          {#if !context.editable && !prepared}
            {localize('DND5E.SpellUnprepared')}
          {:else}
            {localize('DND5E.Prepared')}
          {/if}
        </PillSwitch>
      </li>
    {/if}
  </ul>

  <!-- Item Info: Longform -->
  <!-- TODO: Implement -->

  {#if belowStateSwitches}
    {@render belowStateSwitches()}
  {/if}

  {#if !context.concealDetails}
    {#if offensePills.length}
      <div>
        <h4>
          {localize('DND5E.Attack')}/{localize('DND5E.Damage')}
        </h4>
        <ul class="pills stacked">
          {#each offensePills as pill}
            {@render pill()}
          {/each}
        </ul>
      </div>
    {/if}
  {/if}

  <!-- Item Info active property pills -->
  <!-- {#if activeProperties}
    <div>
      <h4>
        {localize('DND5E.Properties')}
      </h4>
      <ul class="pills stacked">
        {#each activeProperties as prop}
          <li class="pill">
            {prop}
          </li>
        {/each}
      </ul>
    </div>
  {/if} -->

  {#if aboveCustomSections}
    {@render aboveCustomSections()}
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
              TidyFlags.section.prop,
              localize('TIDY5E.Section.Label'),
              { document: context.item },
            ).render(true)}
        >
          <span class="centered text-normal">
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
              TidyFlags.actionSection.prop,
              localize('TIDY5E.Section.ActionLabel'),
              { document: context.item },
            ).render(true)}
        >
          <span class="centered text-normal">
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

{#snippet savePill()}
  <li class="pill">
    <span class="centered">
      {localize('DND5E.AbbreviationDC')}
    </span>
    <span class="centered hyphen-auto">
      {saveContext?.dc.value}
      {#if saveContext?.ability}
        <span class="text-normal">
          {saveContext.abilityTitle ?? saveContext.ability}
        </span>
      {/if}
    </span>
  </li>
{/snippet}

{#snippet toHitPill()}
  <li class="pill">
    {context.labels.toHit}
    <span class="text-normal">
      {localize('DND5E.ToHit')}
    </span>
  </li>
{/snippet}

{#snippet damagePills()}
  {#each context.labels.damages ?? [] as damage}
    <li class="pill">
      {damage.label}
    </li>
  {/each}
{/snippet}

