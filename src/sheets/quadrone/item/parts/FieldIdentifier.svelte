<script lang="ts">
  import type { DataField } from 'foundry.data.fields';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  type Props = {
    document: any;
    field: DataField;
    id: string;
    /** The saved identifier, which is often blank. */
    value: string;
    /** The effective identifier, which falls back to a slug of the item name. */
    identifier: string;
    unlocked: boolean;
    hint?: string;
  };

  let {
    document,
    field,
    id,
    value,
    identifier,
    unlocked,
    hint = 'DND5E.IdentifierError',
  }: Props = $props();

  const copyLabel = FoundryAdapter.localize(
    'TIDY5E.COMMON.Action.CopyToClipboard',
  );
</script>

<FormGroup label={field.label} labelFor={id} {hint}>
  {#if unlocked}
    {@render input()}
  {:else}
    <!-- Disabled inputs swallow clicks, so this wrapper is the copy target. -->
    <div
      class="identifier-field copy-to-clipboard"
      role="button"
      tabindex="0"
      data-action="copyValue"
      data-value={identifier}
      data-tooltip={copyLabel}
      aria-label={copyLabel}
      {@attach InputAttachments.triggerClickOnKeydown}
    >
      {@render input()}
    </div>
  {/if}
</FormGroup>

{#snippet input()}
  <TidyFormInput
    {document}
    {field}
    config={{ id, value, placeholder: identifier }}
  />
{/snippet}
