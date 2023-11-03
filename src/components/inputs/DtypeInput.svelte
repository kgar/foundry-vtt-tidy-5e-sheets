<script lang="ts">
  import Checkbox from './Checkbox.svelte';
  import NumberInput from '../inputs/NumberInput.svelte';
  import TextInput from '../inputs/TextInput.svelte';

  export let document: any;
  export let field: string;
  export let value: any;
  export let dtype: string;
</script>

{#if dtype === 'Number'}
  <NumberInput {document} {field} {value} />
{:else if dtype === 'Boolean'}
  <Checkbox {document} {field} {value} />
{:else}
  <TextInput {document} {field} {value} />
{/if}
