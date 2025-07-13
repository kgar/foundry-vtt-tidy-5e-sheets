<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import TidySwitch from 'src/components/toggles/TidySwitch.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { MouseEventHandler } from 'svelte/elements';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  interface Props {
    ondblclick?: MouseEventHandler<HTMLElement>;
    [key: string]: any;
  }

  let { ondblclick, ...rest }: Props = $props();

  let context =
    $derived(
      getSheetContext<{
        document: any;
        unlocked: boolean;
        editable: boolean;
      }>(),
    );

  async function toggleMode() {
    const newMode = context.unlocked
      ? CONSTANTS.SHEET_MODE_PLAY
      : CONSTANTS.SHEET_MODE_EDIT;

    unlocked = newMode === CONSTANTS.SHEET_MODE_EDIT;

    await context.document.sheet.changeSheetMode(newMode);
  }

  const localize = FoundryAdapter.localize;
  let unlocked = $derived(context.unlocked);
</script>

{#if context.editable}
  <div
    class="header-sheet-edit-mode-toggle {rest.class ?? ''}"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SHEET_LOCK_TOGGLE}
    ondblclickcapture={(event) => {
      event.stopPropagation();
      ondblclick?.(event);
    }}
  >
    <TidySwitch
      --tidy-switch-scale="1"
      --tidy-switch-thumb-transform-duration="0.15s"
      data-tooltip={unlocked ? 'DND5E.SheetModeEdit' : 'DND5E.SheetModePlay'}
      checked={unlocked}
      thumbIconClass="{unlocked ? 'fas fa-unlock' : 'fas fa-lock'} fa-fw"
      onChange={() => toggleMode()}
    ></TidySwitch>
  </div>
{/if}
