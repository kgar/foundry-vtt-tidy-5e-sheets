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

  async function useDefault() {
    await sheet.useDefaultSection();
    await sheet.close();
  }

  const localize = FoundryAdapter.localize;

  let sections = $derived(context.data?.sections ?? []);
  let freeText = $state('');
  let searchCriteria = $state('');

  let filteredResults = $derived(
    searchCriteria.trim() === ''
      ? sections
      : sections.filter((s) =>
          s.toLocaleLowerCase().includes(searchCriteria.toLocaleLowerCase()),
        ),
  );
</script>

<fieldset class="card">
  <legend>{localize('TIDY5E.Section.SectionSelectorExistingSections')}</legend>

  <search>
    <input
      type="search"
      class="interface-only"
      placeholder={localize('TIDY5E.Search')}
      bind:value={searchCriteria}
    />
  </search>

  <section class="existing-sections">
    {#each filteredResults as section (section)}
      <div class="form-group">
        <button
          type="button"
          onclick={() => onOptionSelected(section)}
          class="button">{localize(section)}</button
        >
      </div>
    {/each}
  </section>
</fieldset>

<fieldset class="card">
  <legend>{localize('TIDY5E.Section.SectionSelectorNewSection')}</legend>
  <input type="text" bind:value={freeText} />
  <div class="button-bar flexrow">
    <button type="button" onclick={() => useDefault()}
      >{localize('TIDY5E.UseDefault')}</button
    >
    <button
      type="button"
      disabled={freeText.trim().length === 0}
      onclick={() => onOptionSelected(freeText)}
      >{localize('TIDY5E.SaveChanges')}</button
    >
  </div>
</fieldset>

<style>
  .existing-sections {
    flex: 1 1 auto;
    padding: 1px;
    overflow: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .new-section {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
</style>
