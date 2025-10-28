<script lang="ts">
  import { type Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  type Props = {
    value: unknown;
    disabledValue?: unknown;
    field: string;
    document: any;
    blankValue?: any;
    children?: Snippet;
  } & HTMLSelectAttributes;

  let {
    value,
    disabledValue,
    field,
    document,
    blankValue = null,
    children,
    ...rest
  }: Props = $props();

  let draftValue = $state('');

  $effect(() => {
    draftValue = rest.disabled
      ? (disabledValue ?? value?.toString() ?? '')
      : (value?.toString() ?? '');
  });

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    },
  ) {
    if (rest.name) {
      return;
    }

    const targetValue = event.currentTarget.value;

    await document.update({
      [field]: targetValue !== '' ? targetValue : blankValue,
    });
  }
</script>

<select
  bind:value={draftValue}
  onchange={document && saveChange}
  {...rest}
  data-tidy-field={field}
>
  {@render children?.()}
</select>
