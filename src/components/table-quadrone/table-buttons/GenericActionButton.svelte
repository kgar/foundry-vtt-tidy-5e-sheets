<script lang="ts">
  import type { ClassValue, HTMLAnchorAttributes } from 'svelte/elements';

  type Props = {
    callback?: Function;
    iconClasses?: ClassValue;
    tooltip?: string;
  } & HTMLAnchorAttributes;

  let {
    callback,
    class: cssClass,
    iconClasses,
    tooltip,
    ...attributes
  }: Props = $props();
</script>

<a
  {...attributes}
  class={['tidy-table-button', cssClass]}
  aria-label={tooltip}
  onclick={() => callback?.()}
  data-tooltip=""
>
  <i class={['fa-fw', iconClasses]}></i>
</a>
