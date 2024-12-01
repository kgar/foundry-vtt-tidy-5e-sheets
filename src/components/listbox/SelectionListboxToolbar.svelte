<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { createEventDispatcher } from 'svelte';

  interface Props {
    moveAllToTheLeftDisabled: boolean;
    moveUpDisabled: boolean;
    moveDownDisabled: boolean;
    moveLeftDisabled: boolean;
    moveRightDisabled: boolean;
    moveAllToTheRightDisabled: boolean;
    [key: string]: any;
  }

  let { ...props }: Props = $props();

  const dispatcher = createEventDispatcher<{
    moveAllToTheLeft: void;
    moveUp: void;
    moveDown: void;
    moveLeft: void;
    moveRight: void;
    moveAllToTheRight: void;
  }>();

  const localize = FoundryAdapter.localize;
</script>

<div class="selection-listbox-toolbar {props.class ?? ''}">
  <button
    title={localize('TIDY5E.Listbox.MoveUp')}
    type="button"
    disabled={props.moveUpDisabled}
    onclick={() => dispatcher('moveUp')}
  >
    <i class="fas fa-angle-up"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveDown')}
    type="button"
    disabled={props.moveDownDisabled}
    onclick={() => dispatcher('moveDown')}
  >
    <i class="fas fa-angle-down"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveLeft')}
    type="button"
    disabled={props.moveLeftDisabled}
    onclick={() => dispatcher('moveLeft')}
  >
    <i class="fas fa-angle-left"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveRight')}
    type="button"
    disabled={props.moveRightDisabled}
    onclick={() => dispatcher('moveRight')}
  >
    <i class="fas fa-angle-right"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveAllLeft')}
    type="button"
    disabled={props.moveAllToTheLeftDisabled}
    onclick={() => dispatcher('moveAllToTheLeft')}
  >
    <i class="fas fa-angles-left"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveAllRight')}
    type="button"
    disabled={props.moveAllToTheRightDisabled}
    onclick={() => dispatcher('moveAllToTheRight')}
  >
    <i class="fas fa-angles-right"></i>
  </button>
</div>
