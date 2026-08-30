<script lang="ts">
  import ItemDescriptions from '../../shared/ItemDescriptions.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import SoloItemDescription from '../../shared/SoloItemDescription.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getContainerSheetQuadroneContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;

  // If the item isn't identified and you're not GM editing, show unidentified notice.
  let conceal = $derived(
    context.system.identified === false
  );

  let editing = $state(false);
  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));
  let playerEditMode = $derived(context.sheet.isEditMode && !FoundryAdapter.userIsGm());
</script>

{#snippet unidentifiedNotice()}
  {#if conceal}
    {#if FoundryAdapter.userIsGm() && gmEditMode}
      <FormGroup
        label="DND5E.NameUnidentified"
        labelFor="{appId}-unidentified-name"
        document={context.document}
        field={context.fields.unidentified.fields.name}
        config={{
          id: `${appId}-unidentified-name`,
          value: context.source.unidentified.name,
        }}
      />
    {/if}
    <span class="color-text-lightest font-default-longform unidentified-notice">
      {localize('DND5E.Unidentified.Notice')}
    </span>
  {/if}
{/snippet}

{#if !editing && !playerEditMode}
  {@render unidentifiedNotice()}
{/if}

{#if context.itemDescriptions.length === 1}
  <SoloItemDescription
    document={context.document}
    itemDescription={context.itemDescriptions[0]}
    unlocked={context.unlocked}
  />
{:else}
  <ItemDescriptions
    document={context.document}
    itemDescriptions={context.itemDescriptions}
    bind:editing
  />
{/if}

{#if editing || playerEditMode}
  {@render unidentifiedNotice()}
{/if}