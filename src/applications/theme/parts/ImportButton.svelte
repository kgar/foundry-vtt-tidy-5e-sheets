<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    onfilechanged: (file: File | undefined) => any;
  }

  let { onfilechanged }: Props = $props();

  let fileImportInput: HTMLInputElement;

  function handleFileChanged(
    ev: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    const file = ev.currentTarget.files?.[0];

    ev.currentTarget.value = '';

    onfilechanged?.(file);
  }

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="button flexshrink"
  onclick={() => fileImportInput.click()}
>
  <i class="fa-solid fa-file-import"></i>
  {localize('TIDY5E.ThemeSettings.Sheet.import')}
</button>

<input
  class="theme-import-input hidden"
  type="file"
  accept={CONSTANTS.THEME_EXTENSION_WITH_DOT}
  onchange={handleFileChanged}
  bind:this={fileImportInput}
/>
