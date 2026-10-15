<script lang="ts">
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  const context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);
</script>

<FormGroup
  labelFor="{appId}-identifier"
  document={context.document}
  field={context.fields.identifier}
  config={{
    value: context.source.identifier,
    placeholder: context.item.identifier,
    id: `${appId}-identifier`,
  }}
  hint="DND5E.IdentifierError"
/>
