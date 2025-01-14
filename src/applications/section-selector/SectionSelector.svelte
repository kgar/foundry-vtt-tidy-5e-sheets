<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    SectionSelectorApplication,
    SectionSelectorContext,
  } from './SectionSelectorApplication.svelte';
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';

  interface Props {
    sheet: SectionSelectorApplication;
    context: CoarseReactivityProvider<SectionSelectorContext | undefined>;
  }

  let { sheet, context }: Props = $props();

  async function onOptionSelected(name: string) {
    await sheet.selectSection(name);
    await sheet.close();
  }

  const localize = FoundryAdapter.localize;

  let sections = $derived(context.data?.sections ?? []);
</script>

<search>
  <input
    type="text"
    class="interface-only"
    placeholder={localize('TIDY5E.Search')}
  />
</search>

<ul class="unlist">
  {#each sections as section (section)}
    <li>
      <button
        type="button"
        onclick={() => onOptionSelected(section)}
        class="button">{localize(section)}</button
      >
    </li>
  {/each}
</ul>
