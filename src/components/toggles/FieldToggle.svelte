<script lang="ts">
  import type {
    ChangeEventHandler,
    HTMLInputAttributes,
  } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    checked?: boolean;
    disabled?: boolean | undefined;
    onchange?: ChangeEventHandler<HTMLInputElement>;
  }

  let {
    checked = false,
    onchange = undefined,
    disabled = false,
    ...rest
  }: Props = $props();
</script>

<label class="field-toggle" class:disabled>
  <!-- fa-check -->
  <svg
    class="checked-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    ><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
      d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
    /></svg
  >
  <!-- fa-xmark -->
  <svg
    class="unchecked-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    ><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
    /></svg
  >
  <!-- fa-circle -->
  <svg class="thumb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
    ><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
    /></svg
  >
  <input
    type="checkbox"
    {onchange}
    {checked}
    {disabled}
    class="toggle hidden"
    {...rest}
  />
</label>
