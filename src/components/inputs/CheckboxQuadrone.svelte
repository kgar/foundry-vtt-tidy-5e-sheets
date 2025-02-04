<script lang="ts">
  import type { SvelteInputEvent } from 'src/types/types';
  import { type Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    field: string;
    document: any;
    onDataPreparing?: SvelteInputEvent | null;
    children?: Snippet;
  } & HTMLInputAttributes;

  let {
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
</script>

<input
  type="checkbox"
  onchange={saveChange}
  data-tidy-field={field}
  {...rest}
/>

<style lang="scss">
  label {
    --tidy-checkbox-width-internal: var(--tidy-checkbox-width, unset);
    width: var(--tidy-checkbox-width-internal);
  }
</style>
