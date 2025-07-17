<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import { MaxPreparedSpellsConfigFormApplication } from 'src/applications/max-prepared-spells-config/MaxPreparedSpellsConfigFormApplication.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

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
      <SelectOptions data={context.config.spellProgression} />
    </Select>
  </div>
</div>

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
