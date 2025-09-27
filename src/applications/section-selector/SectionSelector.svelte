<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    SectionSelectorApplication,
    SectionSelectorContext,
  } from './SectionSelectorApplication.svelte';
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
  import { isNil } from 'src/utils/data';
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { untrack } from 'svelte';

  interface Props {
    sheet: SectionSelectorApplication;
    context: CoarseReactivityProvider<SectionSelectorContext | undefined>;
  }

  let { sheet, context }: Props = $props();

  async function onOptionSelected(name: string) {
    if (name.trim() !== '') {
      await sheet.selectSection(name);
    }
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

  $effect(() => {
    untrack(() => {
      freeText = context.data?.currentSection ?? '';
    });
  });

  let filteredResults = $derived(
    searchCriteria.trim() === ''
      ? sections
      : sections.filter((s) =>
          s.toLocaleLowerCase().includes(searchCriteria.toLocaleLowerCase()),
        ),
  );

  let isDefault = $derived(isNil(context.data?.currentSection?.trim(), ''));
</script>

<div class="dialog-content-container flexcol">
  <h2>{localize('TIDY5E.Section.LabelPl')}</h2>
  <form
    onsubmit={(ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      onOptionSelected(freeText);
    }}
  >
    <fieldset>
      <legend>
        {localize('TIDY5E.Section.SectionSelectorCreateNewSection')}
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <div class="flexrow button-bar">
        <input
          type="text"
          bind:value={freeText}
          placeholder={localize('TIDY5E.Section.SectionSelectorNewSectionName')}
          class="flex2"
          autofocus
          {@attach InputAttachments.selectOnFocus}
        />
        <button type="submit" class="button flex1"
          >{localize('TIDY5E.Section.SectionSelectorSaveNewSection')}</button
        >
      </div>
    </fieldset>
  </form>
  
  <fieldset>
    <legend>
      {localize('TIDY5E.Section.SectionSelectorExistingSections')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>
  
    <Search bind:searchCriteria />
  
    <section class="existing-sections">
      {#each filteredResults as section (section)}
        {@const isSelected = context.data?.currentSection === section}
        <button
          type="button"
          onclick={() => onOptionSelected(section)}
          class="button button-toggle"
          class:active={isSelected}
        >
          {#if isSelected}
            <i class="fa-solid fa-check"></i>
          {/if}
          {localize(section)}
        </button>
      {/each}
      <button
        type="button"
        class="button button-toggle {isDefault ? 'button-primary' : ''}"
        onclick={() => useDefault()}
      >
        {#if isDefault}
          <i class="fa-solid fa-check"></i>
        {/if}
        {localize('TIDY5E.UseDefault')}
      </button>
    </section>
  </fieldset>
</div>
