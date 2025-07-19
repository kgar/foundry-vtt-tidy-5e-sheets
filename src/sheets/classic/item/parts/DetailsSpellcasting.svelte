<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import { MaxPreparedSpellsConfigFormApplication } from 'src/applications/max-prepared-spells-config/MaxPreparedSpellsConfigFormApplication.svelte';

  let context = $derived(getItemSheetContext());

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
    <Select
      id="{appId}-spellcasting-progression"
      document={context.item}
      field="system.spellcasting.progression"
      value={context.system.spellcasting.progression}
      disabled={!context.editable}
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
    </Select>
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
    <Select
      id="{appId}-spellcasting-ability"
      document={context.item}
      field="system.spellcasting.ability"
      value={context.system.spellcasting.ability}
      disabled={!context.editable}
      blankValue=""
    >
      <SelectOptions
        data={context.config.abilities}
        labelProp="label"
        blank=""
      />
    </Select>
  </div>
</div>

<div class="form-group">
  <label for="{appId}-spellcasting-preparation-formula"
    >{localize('DND5E.SpellPreparation.Formula')}</label
  >
  <div class="form-fields">
    <TextInput
      id="{appId}-spellcasting-preparation-formula"
      document={context.item}
      field="system.spellcasting.preparation.formula"
      value={context.system.spellcasting.preparation.formula}
      dataset={{ formulaEditor: true }}
      disabled={!context.editable}
      placeholder="—"
    />
    <a
      title={localize('TIDY5E.MaxPreparedSpellsConfig.ExamplesHeader')}
      class="spell-method-search inline-icon-button"
      onclick={() => {
        new MaxPreparedSpellsConfigFormApplication(
          context.item.name,
          context.item,
          {
            document: context.item,
          },
        ).render({ force: true });
      }}><i class="fa-solid fa-search fa-fw"></i></a
    >
  </div>
</div>
