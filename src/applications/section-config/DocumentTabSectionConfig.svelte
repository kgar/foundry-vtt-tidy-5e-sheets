<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';
  import type { DocumentTabSectionConfigItem } from './section-config.types';

  export let sections: DocumentTabSectionConfigItem[];
  export let onSaveChanges: (
    sections: DocumentTabSectionConfigItem[],
  ) => void | Promise<void>;
  export let onApply: (
    sections: DocumentTabSectionConfigItem[],
  ) => void | Promise<void>;
  export let useDefault: () => void | Promise<void>;

  function addPersistedSection() {
    // TODO: Prompt for a name, such as adding a special listbox item which has an input and a ✅❌ interface. ✅ would be verified unique, else an error notification. ❌ would remove the selection. When in this mode, Save / Apply are disabled, or they simply ignore the pending one.
    sections.push({
      key: 'My Custom Persisted Section Example',
      label: 'My Custom Persisted Section Example',
      persisted: true,
      show: true,
      custom: true,
    });

    sections = sections;
  }

  const localize = FoundryAdapter.localize;

  function removeCustomSection(item: DocumentTabSectionConfigItem): any {
    sections = sections.filter((s) => s !== item);
  }
</script>

<section class="document-tab-section-config flex-column small-gap">
  <button
    type="button"
    class="inline-button"
    style="align-self: flex-end; width: auto;"
    on:click={addPersistedSection}
    ><i class="fas fa-plus"></i>
    {localize('TIDY5E.Section.ConfigDialog.AddSectionButtonText')}</button
  >
  <SortingListbox
    bind:items={sections}
    labelProp="label"
    valueProp="key"
    listboxCssClass="scroll-container"
    class="flex-1 overflow-y-hidden"
  >
    <svelte:fragment slot="itemTemplate" let:item>
      <span
        data-section-key={item['key']}
        data-testid="section-config-item-label"
        class="flex-1"
        class:marked-as-hidden={item.show === false}>{item.label}</span
      >
      {#if item.show !== false}
        <button
          type="button"
          class="inline-icon-button"
          title={localize('TIDY5E.Section.ConfigDialog.hideTooltip')}
          data-testid="section-config-hide"
          on:click={() => {
            item.show = false;
            sections = sections;
          }}
        >
          <i class="far fa-eye fa-fw"></i>
        </button>
      {:else}
        <button
          type="button"
          class="inline-icon-button"
          title={localize('TIDY5E.Section.ConfigDialog.showTooltip')}
          data-testid="section-config-show"
          on:click={() => {
            item.show = true;
            sections = sections;
          }}
        >
          <i class="far fa-eye-slash fa-fw"></i>
        </button>
      {/if}
      {#if item.custom}
        <button
          type="button"
          class="inline-icon-button"
          title={localize(
            'TIDY5E.Section.ConfigDialog.RemovePersistedSectionTooltip',
          )}
          on:click={() => removeCustomSection(item)}
        >
          <i class="fas fa-trash"></i>
        </button>
      {/if}
    </svelte:fragment>
  </SortingListbox>

  <div class="flex-row small-gap">
    <button
      type="button"
      class="use-default-btn"
      data-testid="section-config-use-default"
      on:click={(ev) => useDefault()}
    >
      <i class="fas fa-rotate-right" />
      {localize('TIDY5E.UseDefault')}
    </button>
    <button
      type="button"
      data-testid="section-config-save-changes"
      on:click={(ev) => onSaveChanges(sections)}
      class="save-changes-btn"
    >
      <i class="fas fa-save" />
      {localize('TIDY5E.SaveChanges')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      data-testid="section-config-apply-changes"
      on:click={() => onApply(sections)}
    >
      <i class="fas fa-check" />
      {localize('TIDY5E.ApplyChanges')}
    </button>
  </div>
</section>
