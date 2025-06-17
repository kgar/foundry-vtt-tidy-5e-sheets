<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ClassValue, HTMLAnchorAttributes } from 'svelte/elements';

  interface Props extends HTMLAnchorAttributes {
    title: string;
    iconClass: ClassValue;
    controlContext?: any;
    onControlClick?: (ev: MouseEvent, controlContext: any) => void;
  }

  let { onControlClick, title, iconClass, controlContext }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<a
  class="tidy-table-button"
  data-tooltip={title}
  aria-label={localize(title)}
  onclick={(ev) => onControlClick?.(ev, controlContext)}
>
  <i class={iconClass}></i>
</a>
