<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { MaxPreparedSpellsConfigFormApplication } from 'src/applications/max-prepared-spells-config/MaxPreparedSpellsConfigFormApplication.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  let optionGroups = $derived.by(() => {
    let groups: Record<string, { label: string; value: string }[]> = {};

    for (let prog of context.spellProgression) {
      let group = (groups[prog.group ?? ''] ??= []);

      group.push(prog);
    }

    return Object.entries(groups);
  });

  const localize = FoundryAdapter.localize;
</script>

<div class="form-group">
  <label for="{appId}-spellcasting-progression"
    >{localize('DND5E.SpellProgression')}</label
  >
  <div class="form-fields">
    <SelectQuadrone
      id="{appId}-spellcasting-progression"
      document={context.item}
      field="system.spellcasting.progression"
      value={context.source.spellcasting.progression}
      disabled={!context.unlocked}
    >
      {#each optionGroups as group}
        {#if group[0] !== ''}
          <optgroup label={group[0]}>
            {@render options(group[1])}
          </optgroup>
        {:else}
          {@render options(group[1])}
        {/if}
      {/each}
    </SelectQuadrone>
  </div>
</div>

{#snippet options(options: { label: string; value: string }[])}
  {#each options as option}
    <option value={option.value}>
      {option.label}
    </option>
  {/each}
{/snippet}

<div class="form-group">
  <label for="{appId}-spellcasting-ability"
    >{localize('DND5E.SpellAbility')}</label
  >
  <div class="form-fields">
    <SelectQuadrone
      id="{appId}-spellcasting-ability"
      document={context.item}
      field="system.spellcasting.ability"
      value={context.source.spellcasting.ability}
      disabled={!context.unlocked}
      blankValue=""
    >
      <SelectOptions
        data={context.config.abilities}
        labelProp="label"
        blank=""
      />
    </SelectQuadrone>
  </div>
</div>

<div class="form-group">
  <label for="{appId}-spellcasting-preparation-formula"
    >{localize('DND5E.SpellPreparation.Formula')}</label
  >
  <div class="form-fields">
    <TextInputQuadrone
      id="{appId}-spellcasting-preparation-formula"
      document={context.item}
      field="system.spellcasting.preparation.formula"
      value={context.source.spellcasting.preparation.formula}
      data-formula-editor="true"
      disabled={!context.unlocked}
    />
    {#if context.unlocked}
      <button
        type="button"
        title={localize('TIDY5E.MaxPreparedSpellsConfig.ExamplesHeader')}
        class="spell-method-search button button-icon-only"
        onclick={() => {
          new MaxPreparedSpellsConfigFormApplication(
            context.item.name,
            context.item,
            {
              document: context.item,
            },
          ).render({ force: true });
        }}
        ><i class="fa-solid fa-search fa-fw"></i>
      </button>
    {/if}
  </div>
</div>
