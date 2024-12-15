<script lang="ts">
  import { type Snippet } from 'svelte';

  interface Props {
    baseWidth?: string | undefined;
    primary?: boolean;
    cssClass?: string;
    title?: string | undefined;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    baseWidth = undefined,
    primary = false,
    cssClass = '',
    title = undefined,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  class="item-table-cell {cssClass}"
  class:primary
  style:flex-basis={baseWidth}
  {title}
  {...rest.attributes}
>
  {@render children?.()}
</div>
