<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import FieldIdentifier from '../parts/FieldIdentifier.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<!-- Identifier -->
<FieldIdentifier />

<!-- Modifiers -->
{#if context.modifiers}
  {#each context.modifiers as modifier, i}
    {const data = $derived(modifier.data)}
    <!-- 
      ⚠️ Form field changes don't work quite right here.
    -->
    <FormGroup groupClasses="split-group">
      {#snippet formLabel()}
        <!-- no label -->
      {/snippet}
      <FormGroup
        label={modifier.fields.value.label}
        labelFor="{appId}-renown-value-{i}"
        field={modifier.fields.value}
        config={{
          id: `${appId}-renown-value-${i}`,
          value: data.value,
          placeholder: '0',
          name: `${modifier.prefix}value`,
        }}
        groupClasses="label-top"
        submissionMode="full"
      />
      {#if modifier.options.length}
        <FormGroup
          label={modifier.fields.faction.label}
          labelFor="{appId}-renown-faction-{i}"
          field={modifier.fields.faction}
          config={{
            id: `${appId}-renown-faction-${i}`,
            value: data.faction,
            name: `${modifier.prefix}faction`,
            blank: true,
          }}
          groupClasses="label-top"
          choices={modifier.options}
          blankLabel=""
          submissionMode="full"
        />
      {:else}
        <FormGroup
          label={modifier.fields.faction.label}
          labelFor="{appId}-renown-faction-{i}"
          field={modifier.fields.faction}
          config={{
            id: `${appId}-renown-faction-${i}`,
            value: data.faction,
            name: `${modifier.prefix}faction`,
          }}
          groupClasses="label-top"
          submissionMode="full"
        />
      {/if}
      <a data-action="deleteRenown" data-index={i} class="flexshrink">
        <i class="fa-solid fa-trash"></i>
      </a>
    </FormGroup>
  {:else}
    <div class="empty">
      {@html FoundryAdapter.localize('DND5E.RENOWN.Empty')}
    </div>
  {/each}
{/if}

<footer class="sheet-footer">
  <div class="footer-content-right flexrow flexshrink">
    <button
      type="button"
      data-tooltip="DND5E.ItemCreate"
      class="button button-icon-only button-primary item-create flexshrink"
      data-action="addRenown"
    >
      <i class="fas fa-plus"></i>
    </button>
  </div>
</footer>
