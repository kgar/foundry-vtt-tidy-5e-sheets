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
  import { coalesce } from 'src/utils/formatting';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { settings } from 'src/settings/settings.svelte';

  let context = $derived(getContainerOrItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  interface Props {
    belowStateSwitches?: Snippet;
    aboveCustomSections?: Snippet;
    /** Include the item properties list above the custom sections controls. Default: true */
    includeSidebarProperties?: boolean;
    sectionLabel?: string;
  }

  let {
    belowStateSwitches,
    aboveCustomSections,
    includeSidebarProperties = true,
    sectionLabel = 'TIDY5E.Section.Label',
  }: Props = $props();

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

  // Facility Disrepair

  let facilityIsDisabled = $derived(context.system.disabled === true);

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
    FoundryAdapter.renderImagePopout({
      src: item.img,
      window: {
        title: FoundryAdapter.localize('TIDY5E.ItemImageTitle', {
          subject: item.name,
        }),
      },
      uuid: item.uuid,
    });
  }

  // TODO: Consider a reusable function and also feeding it through item context for item sheets.
  let itemColorClasses = $derived<ClassValue>([
    context.system.identified === false ? 'disabled' : undefined,
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

    if (!isNil(context.labels.damages[0]?.label, '')) {
      result.push(damagePills);
    }

    return result;
  });

  let sidebarActivations = $derived(
    Object.values(context.item.labels.activations?.[0] ?? []).filter((x) => x),
  );

  let proficiencyPill = $derived(
    'proficient' in context.item.system
      ? CONFIG.DND5E.proficiencyLevels[
          context.item.system.prof?.multiplier || 0
        ]
      : null,
  );

  // Advancement Pills

  type ScaleValuePill = {
    title: string;
    value?: string;
    toCopy: string;
  };

  let scaleValues = $derived.by<ScaleValuePill[]>(() => {
    let actorRollData = context.item.actor?.getRollData();
    let scaleValues = context.item.advancement?.byType?.ScaleValue;

    if (scaleValues?.length) {
      return context.item.advancement.byType.ScaleValue.map((x: any) => {
        let formula = `@scale.${context.item.identifier}.${x.identifier}`;
        let value = actorRollData
          ? Roll.defaultImplementation.replaceFormulaData(
              formula,
              actorRollData,
            )
          : undefined;

        if (value === formula) {
          value = undefined;
        }

        return {
          title: x.title,
          value,
          toCopy: formula,
        } satisfies ScaleValuePill;
      });
    }

    return [];
  });

  // General Properties

  let sidebarProperties = $derived.by<string[]>(() => {
    if (!includeSidebarProperties) {
      return [];
    }

    let result: string[] = [];

    if (!isNil(proficiencyPill)) {
      result.push(proficiencyPill);
    }

    let props =
      context.labels.properties
        ?.map((p: { label: string }) => p.label)
        .toSorted() ?? [];

    result.push(...props);

    return result;
  });
</script>

<aside class={['sidebar', 'theme-dark']}>
  <div>
    <div
      class={[
        'item-image-container',
        itemColorClasses,
        { disabled: facilityIsDisabled },
      ]}
    >
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
    {:else if facilityIsDisabled}
      <div class="image-subtitle disabled">
        {localize('DND5E.FACILITY.FIELDS.disabled.label')}
      </div>
    {/if}
  </div>

  <!-- Item States -->
  <!-- TODO: Possibly extract component, make into snippets, stack into array, and don't render if there are no state pills. -->
  <ul class="pills stacked">
    {#if /* hightouch, please make this nice, lol */ settings.value.truesight && !isNil(context.system.hp?.max, 0)}
      {@const effectiveHpValue = context.system.hp.value ?? 0}
      {@const effectiveHpMax = context.system.hp.max ?? 0}
      {@const pct =
        effectiveHpMax > 0 ? (effectiveHpValue / effectiveHpMax) * 100 : 0}
      <li>
        <span
          class={[
            'pill meter progress hit-points theme-dark',
            { empty: effectiveHpValue === 0 },
          ]}
          role="meter"
          aria-label={localize('DND5E.HitPoints')}
          aria-valuemin="0"
          aria-valuenow={pct}
          aria-valuetext={effectiveHpValue.toString()}
          aria-valuemax={effectiveHpMax}
          style="--bar-percentage: {pct.toFixed(0)}%;"
        >
          <span class="label">
            <TextInputQuadrone
              document={context.item}
              field="system.hp.value"
              value={effectiveHpValue}
              class="value font-weight-label uninput"
              selectOnFocus={true}
              enableDeltaChanges={true}
            />
            <!-- <span class="value font-weight-label">{effectiveHpValue ?? 0}</span> -->
            <span class="separator">/</span>
            <TextInputQuadrone
              document={context.item}
              field="system.hp.max"
              value={effectiveHpMax}
              class="max color-text-default uninput"
              selectOnFocus={true}
              enableDeltaChanges={true}
            />
            <!-- <span class="max color-text-default">{effectiveHpMax ?? 0}</span> -->
          </span>
        </span>
      </li>
    {/if}
    {#if 'equipped' in context.system && context.editable}
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
    {#if 'identified' in context.system && context.unlocked}
      <li>
        <PillSwitch
          checked={context.system.identified}
          checkedIconClass="fas fa-search fa-fw"
          uncheckedIconClass="fas fa-search fa-fw"
          onchange={(ev) =>
            context.item.update({
              'system.identified': ev.currentTarget?.checked,
            })}
        >
          {localize('DND5E.Identified')}
        </PillSwitch>
      </li>
    {/if}
    {#if context.item.actor && context.system.preparation?.mode === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED}
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

  {#if belowStateSwitches}
    {@render belowStateSwitches()}
  {/if}

  {#if !context.concealDetails}
    <!-- Activations -->
    {#if sidebarActivations.length}
      <div>
        <h4>{localize('DND5E.Action')}</h4>
        <ul class="pills stacked">
          {#each sidebarActivations as activation}
            <li class="pill">
              {activation}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <!-- Attack / Damage / Saves (Offense Pills) -->
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

    <!-- Scale Values -->
    {#if scaleValues.length}
      <div>
        <h4>
          {localize('DND5E.ADVANCEMENT.ScaleValue.Title')}
        </h4>

        <ul class="pills stacked">
          {#each scaleValues as scaleValue}
            <li>
              <a
                class="pill interactive centered wrapped copy-to-clipboard"
                onclick={() => {
                  game.clipboard.copyPlainText(scaleValue.toCopy);
                  ui.notifications.info(
                    game.i18n.format('DND5E.Copied', {
                      value: scaleValue.toCopy,
                    }),
                    { console: false },
                  );
                }}
              >
                {#if !context.item.actor}
                  {scaleValue.title}
                {:else}
                  <span class="centered text-normal">
                    {scaleValue.title}
                  </span>
                  {#if scaleValue.value !== undefined}
                    <span class="centered">
                      {scaleValue.value}
                    </span>
                  {:else}
                    <span class="centered text-normal color-text-disabled">
                      &mdash;
                    </span>
                  {/if}
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <!-- General Properties -->
    {#if sidebarProperties.length}
      <div>
        <h4>
          {localize('DND5E.Properties')}
        </h4>
        <ul class="pills stacked">
          {#each sidebarProperties as prop}
            <li class="pill centered">
              {prop}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}

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
          class="pill interactive wrapped no-row-gap centered"
          class:disabled={!context.editable}
          onclick={() =>
            new SectionSelectorApplication(
              TidyFlags.section.prop,
              localize('TIDY5E.Section.Label'),
              { document: context.item },
            ).render(true)}
        >
          <span class="text-normal">
            {localize(sectionLabel)}
          </span>
          <span class="hyphens-auto">
            {section}
          </span>
        </a>
        <a
          class="pill interactive wrapped no-row-gap centered"
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
          <span class="text-normal">
            {localize('TIDY5E.Actions.TabName')}
          </span>
          <span class="hyphens-auto">
            {actionSection}
          </span>
        </a>
      </div>
    </div>
  {/if}
</aside>

{#snippet savePill()}
  <li class="pill centered">
    <span>
      {localize('DND5E.AbbreviationDC')}
    </span>
    <span class="hyphen-auto">
      {saveContext?.dc.value}
      {#if !saveContext?.multipleAbilities && saveContext?.ability}
        <span class="text-normal">
          {saveContext.abilityTitle ?? saveContext.ability}
        </span>
      {/if}
    </span>
  </li>
{/snippet}

{#snippet toHitPill()}
  <li class="pill centered">
    <span>{context.labels.toHit}</span>
    <span class="text-normal">
      {localize('DND5E.ToHit')}
    </span>
  </li>
{/snippet}

{#snippet damagePills()}
  {#each context.labels.damages ?? [] as damage}
    {#if !isNil(damage.label, '')}
      <li class="pill centered">
        {damage.label}
      </li>
    {/if}
  {/each}
{/snippet}
