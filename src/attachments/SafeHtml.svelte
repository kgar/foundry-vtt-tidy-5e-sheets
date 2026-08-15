<script lang="ts">
  type Props = {
    html: string | undefined;
  };

  let { html = '' }: Props = $props();

  let anchorEl = $state<HTMLElement>();

  $effect(() => {
    if (!anchorEl) {
      return;
    }

    const element = window.document.createElement('div');
    element.innerHTML = html;

    anchorEl.replaceChildren(...element.children);
  });
</script>

<div style="display: content;" bind:this={anchorEl}></div>

