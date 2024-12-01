<script lang="ts">
  import Checkbox from './Checkbox.svelte';
  import NumberInput from '../inputs/NumberInput.svelte';
  import TextInput from '../inputs/TextInput.svelte';

  interface Props {
    document: any;
    field: string;
    value: any;
    dtype: string;
  }

  let { document, field, value, dtype }: Props = $props();
</script>

{#if dtype === 'Number'}
  <NumberInput {document} {field} {value} />
{:else if dtype === 'Boolean'}
  <Checkbox {document} {field} {value} />
{:else}
  <TextInput {document} {field} {value} />
{/if}
