<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { MaxPreparedSpellsConfigFormApplication } from 'src/applications/max-prepared-spells-config/MaxPreparedSpellsConfigFormApplication.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

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

<FormGroup
  labelFor="{appId}-spellcasting-progression"
  document={context.document}
  field={context.fields.spellcasting.fields.progression}
  config={{
    id: `${appId}-spellcasting-progression`,
    disabled: !context.unlocked,
    value: context.source.spellcasting.progression,
  }}
  choices={context.spellProgression}
/>

<FormGroup
  labelFor="{appId}-spellcasting-ability"
  document={context.document}
  field={context.fields.spellcasting.fields.ability}
  config={{
    id: `${appId}-spellcasting-ability`,
    disabled: !context.unlocked,
    value: context.source.spellcasting.ability,
  }}
  choices={context.config.abilities}
/>

<FormGroup
  labelFor="{appId}-spellcasting-preparation-formula"
  document={context.document}
  field={context.fields.spellcasting.fields.preparation.fields.formula}
  config={{
    id: `${appId}-spellcasting-preparation-formula`,
    disabled: !context.unlocked,
    value: context.source.spellcasting.preparation.formula,
    placeholder: '—',
  }}
>
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
</FormGroup>
