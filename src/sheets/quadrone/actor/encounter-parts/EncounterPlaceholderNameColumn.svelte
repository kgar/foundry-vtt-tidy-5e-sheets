<script lang="ts">
  import type { EncounterPlaceholderQuadroneContext } from 'src/types/types';
  import type { PortraitShape } from 'src/theme/theme-quadrone.types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { Tidy5eEncounterSheetQuadrone } from '../../Tidy5eEncounterSheetQuadrone.svelte';
  import { TidyFlags } from 'src/api';

  type Props = {
    placeholder: EncounterPlaceholderQuadroneContext;
  };

  let { placeholder }: Props = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let placeholderPortraitShape: PortraitShape = $derived(
    context.portrait.shape,
  );

  async function onPortraitClicked() {
    if (context.unlocked) {
      const fp = new foundry.applications.apps.FilePicker.implementation({
        current: placeholder.img,
        type: 'image',
        redirectToRoot:
          Tidy5eEncounterSheetQuadrone.DEFAULT_ENCOUNTER_PLACEHOLDER_ICON
            ? [Tidy5eEncounterSheetQuadrone.DEFAULT_ENCOUNTER_PLACEHOLDER_ICON]
            : [],
        callback: (path: string) => {
          placeholder.img = path;
          TidyFlags.placeholders.insertOrUpdateEntry(
            context.actor,
            placeholder,
          );
        },
        position: {
          top: context.sheet.position.top + 40,
          left: context.sheet.position.left + 10,
        },
      });

      fp.browse();
      return;
    }

    new foundry.applications.apps.ImagePopout({
      src: placeholder.img,
      title: placeholder.name,
    }).render(true);
  }

  // TODO: Support video portraits even when not dealing with an actor.
</script>

<div class="tidy-table-cell actor-image-container">
  <div
    role="button"
    data-keyboard-focus
    tabindex={0}
    class={['actor-image', placeholderPortraitShape]}
    style="position: relative;"
    onclick={() => onPortraitClicked()}
    onkeydown={(e) =>
      e.key === 'Enter' || e.key === ' ' ? onPortraitClicked() : null}
  >
    <img src={placeholder.img} alt={placeholder.name} />
  </div>
</div>
<div class="tidy-table-cell text-cell primary item-label flexcol">
  <div class="actor-name">
    {#if context.unlocked}
      <input
        class="placeholder-name"
        type="text"
        onchange={(ev) =>
          context.sheet.updatePlaceholderField(
            placeholder,
            'name',
            ev.currentTarget.value,
          )}
        value={placeholder.name}
        {@attach InputAttachments.selectOnFocus}
      />
      <input
        class="placeholder-note"
        type="text"
        onchange={(ev) =>
          context.sheet.updatePlaceholderField(
            placeholder,
            'note',
            ev.currentTarget.value,
          )}
        value={placeholder.note}
        {@attach InputAttachments.selectOnFocus}
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
