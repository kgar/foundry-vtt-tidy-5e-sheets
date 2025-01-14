<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { SectionSelectorApplication } from './SectionSelectorApplication.svelte';

  interface Props {
    sheet: SectionSelectorApplication;
  }

  let { sheet }: Props = $props();

  async function onOptionSelected(name: string) {
    await sheet.selectSection(name);
    await sheet.close();
  }

  const localize = FoundryAdapter.localize;
</script>

<search>
  <input
    type="text"
    class="interface-only"
    placeholder={localize('TIDY5E.Search')}
  />
</search>

<ul class="unlist">
  <li>
    <button
      type="button"
      onclick={() => onOptionSelected('Test 1')}
      class="button">Test 1</button
    >
  </li>
  <li>
    <button
      type="button"
      onclick={() => onOptionSelected('Test 2')}
      class="button">Test 2</button
    >
  </li>
  <li>
    <button
      type="button"
      onclick={() => onOptionSelected('Test 3')}
      class="button">Test 3</button
    >
  </li>
</ul>
