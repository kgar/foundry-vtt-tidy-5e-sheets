<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    moveAllToTheLeftDisabled: boolean;
    moveUpDisabled: boolean;
    moveDownDisabled: boolean;
    moveLeftDisabled: boolean;
    moveRightDisabled: boolean;
    moveAllToTheRightDisabled: boolean;
    onMoveAllToTheLeft?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onMoveLeft?: () => void;
    onMoveRight?: () => void;
    onMoveAllToTheRight?: () => void;
    [key: string]: any;
  }

  let {
    onMoveAllToTheLeft,
    onMoveUp,
    onMoveDown,
    onMoveLeft,
    onMoveRight,
    onMoveAllToTheRight,
    ...props
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div class="selection-listbox-toolbar {props.class ?? ''}">
  <button
    title={localize('TIDY5E.Listbox.MoveUp')}
    type="button"
    class="button button-secondary button-icon-only"
    disabled={props.moveUpDisabled}
    onclick={() => onMoveUp?.()}
  >
    <i class="fas fa-angle-up"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveDown')}
    type="button"
    class="button button-secondary button-icon-only"
    disabled={props.moveDownDisabled}
    onclick={() => onMoveDown?.()}
  >
    <i class="fas fa-angle-down"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveLeft')}
    type="button"
    class="button button-secondary button-icon-only"
    disabled={props.moveLeftDisabled}
    onclick={() => onMoveLeft?.()}
  >
    <i class="fas fa-angle-left"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveRight')}
    type="button"
    class="button button-secondary button-icon-only"
    disabled={props.moveRightDisabled}
    onclick={() => onMoveRight?.()}
  >
    <i class="fas fa-angle-right"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveAllLeft')}
    type="button"
    class="button button-secondary button-icon-only"
    disabled={props.moveAllToTheLeftDisabled}
    onclick={() => onMoveAllToTheLeft?.()}
  >
    <i class="fas fa-angles-left"></i>
  </button>
  <button
    title={localize('TIDY5E.Listbox.MoveAllRight')}
    type="button"
    class="button button-secondary button-icon-only"
    disabled={props.moveAllToTheRightDisabled}
    onclick={() => onMoveAllToTheRight?.()}
  >
    <i class="fas fa-angles-right"></i>
  </button>
</div>
