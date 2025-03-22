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

  // Identification

  let identifiedText = $derived(
    context.system.identified
      ? localize('DND5E.Identified')
      : localize('DND5E.Unidentified.Title'),
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
    rarity?.slugify(),
    !isNil(context.system.preparation?.mode) ? 'spell-preparation' : undefined,
    context.system.preparation?.mode?.slugify(),
  ]);
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
    {#if 'identified' in context.system}
      {#if context.unlocked}
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
    {#if context.system.preparation?.mode === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED}
      <li>
        <PillSwitch
          checked={context.system.preparation.prepared}
          checkedIconClass="fas fa-book fa-fw"
          uncheckedIconClass="fas fa-book fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.preparation.prepared': ev.currentTarget?.checked,
            })}
          disabled={!context.editable}
        >
          {localize('DND5E.Prepared')}
        </PillSwitch>
      </li>
    {/if}
  </ul>

  <!-- Item Info: Longform -->
  <!-- TODO: Implement -->

  {#if itemSpecificSnippet}
    {@render itemSpecificSnippet()}
  {/if}

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
