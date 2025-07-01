<script lang="ts">
  import type { ConditionalComponentWithProps } from 'src/utils/component';

  interface Props {
    doc: any;
    buttons: ConditionalComponentWithProps<any>[];
  }

  let { doc, buttons }: Props = $props();

  let button = $derived(buttons.find((c) => c.condition(doc)));
</script>

{#if button}
  <button.component {...button.props} />
{/if}
