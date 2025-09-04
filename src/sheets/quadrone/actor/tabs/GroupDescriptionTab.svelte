<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
  let field = null;
  let value = null;
  let enriched = null;
</script>

<div class="groups-tab-content group-description-content flexcol">
  <article class="summary-editor-container">
    <div class="summary-editor-title">
      <h3 class="font-title-small flexrow">
        <i class="fa-solid fa-note-sticky flexshrink"></i>
        <span class="flex1">{localize('DND5E.Summary')}</span>
        {#if context.editable}
          <a
            class={['button button-borderless button-icon-only flexshrink']}
            onclick={() => edit(value, enriched, field)}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        {/if}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </div>
    {#key enriched}
      <div class="editor" use:manageSecrets={{ document }}>
        <div data-field={field} class="user-select-text">
          {@html enriched}
        </div>
      </div>
    {/key}
  </article>
  <article class="description-editor-container">
    <div class="description-editor-title">
      <h3 class="font-title-small flexrow">
        <i class="fa-solid fa-notebook flexshrink"></i>
        <span class="flex1">{localize('DND5E.Description')}</span>
        {#if context.editable}
          <a
            class={['button button-borderless button-icon-only flexshrink']}
            onclick={() => edit(value, enriched, field)}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        {/if}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </div>
    {#key enriched}
      <div class="editor" use:manageSecrets={{ document }}>
        <div data-field={field} class="user-select-text">
          {@html enriched}
        </div>
      </div>
    {/key}
  </article>
</div>