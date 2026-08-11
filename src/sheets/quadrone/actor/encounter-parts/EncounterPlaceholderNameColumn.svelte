<script lang="ts">
  import type { EncounterPlaceholderQuadroneContext } from 'src/types/types';
  import type { PortraitShape } from 'src/theme/theme-quadrone.types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  type Props = {
    placeholder: EncounterPlaceholderQuadroneContext;
  };

  let { placeholder }: Props = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let placeholderPortraitShape: PortraitShape = $derived(
    context.portrait.shape,
  );

  const localize = FoundryAdapter.localize;

  // TODO: Support video portraits even when not dealing with an actor.
</script>

<div class="tidy-table-cell actor-image-container">
  <a
    role="button"
    data-keyboard-focus
    tabindex={0}
    class={['actor-image', placeholderPortraitShape]}
    style="position: relative;"
    data-action={context.unlocked
      ? 'editPlaceholderImage'
      : 'showPlaceholderArtwork'}
  >
    <img src={placeholder.img} alt={placeholder.name} />
  </a>
</div>
<div class="tidy-table-cell text-cell primary item-label flexcol">
  <div class="actor-name">
    {#if context.unlocked}
      <input
        class="placeholder-name"
        type="text"
        data-name="placeholder:name"
        value={placeholder.name}
        {@attach InputAttachments.selectOnFocus}
        placeholder={localize(
          'TIDY5E.Encounter.PlaceholderNameField.PlaceholderText',
        )}
      />
      <input
        class="placeholder-note"
        type="text"
        data-name="placeholder:note"
        value={placeholder.note}
        {@attach InputAttachments.selectOnFocus}
        placeholder={localize(
          'TIDY5E.Encounter.PlaceholderNotesField.PlaceholderText',
        )}
      />
    {:else}
      <h4 class="font-label-medium">
        {placeholder.name}
      </h4>
      <span class="placeholder-note">
        <span class="font-label-medium color-text-gold-emphasis">
          {placeholder.note}
        </span>
      </span>
    {/if}
  </div>
</div>
