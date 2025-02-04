<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import { MaxPreparedSpellsConfigFormApplication } from 'src/applications/max-prepared-spells-config/MaxPreparedSpellsConfigFormApplication.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

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
      value={context.system.spellcasting.progression}
      disabled={!context.editable}
    >
      <SelectOptions data={context.config.spellProgression} />
    </SelectQuadrone>
  </div>
</div>

<div class="form-group">
  <label for="{appId}-spellcasting-ability"
    >{localize('DND5E.SpellAbility')}</label
  >
  <div class="form-fields">
    <SelectQuadrone
      id="{appId}-spellcasting-ability"
      document={context.item}
      field="system.spellcasting.ability"
      value={context.system.spellcasting.ability}
      disabled={!context.editable}
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
      value={context.system.spellcasting.preparation.formula}
      data-formula-editor="true"
      disabled={!context.editable}
    />
    <a
      title={localize('TIDY5E.MaxPreparedSpellsConfig.ExamplesHeader')}
      class="spell-preparation-search inline-icon-button"
      onclick={() => {
        new MaxPreparedSpellsConfigFormApplication(
          context.item.name,
          context.item,
        ).render(true);
      }}><i class="fa-solid fa-search fa-fw"></i></a
    >
  </div>
</div>
