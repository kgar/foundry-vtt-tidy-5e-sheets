<script lang="ts">
  import type { SvelteInputEvent } from 'src/types/types';
  import { type Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    disabledChecked?: HTMLInputElement['checked'];
    field: string;
    document: any;
    onDataPreparing?: SvelteInputEvent | null;
    children?: Snippet;
  } & HTMLInputAttributes;

  let {
    disabledChecked,
    field,
    document,
    onDataPreparing = null,
    children,
    ...rest
  }: Props = $props();

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    let data: any = onDataPreparing?.(event) ?? {
      [field]: event.currentTarget.checked,
    };

    await document.update(data);
  }

  let checked = $derived(
    rest.disabled ? (disabledChecked ?? rest.checked) : rest.checked,
  );
</script>

<input
  type="checkbox"
  onchange={saveChange}
  data-tidy-field={field}
  {...rest}
  {checked}
/>

<style lang="scss">
  label {
    --tidy-checkbox-width-internal: var(--tidy-checkbox-width, unset);
    width: var(--tidy-checkbox-width-internal);
  }
</style>
