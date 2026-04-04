<script lang="ts">
  interface Props {
    disabled?: boolean;
    doc: any;
  }

  let { doc, disabled }: Props = $props();

  function onClick() {
    if (disabled) {
      return;
    }

    const parent = doc.parent ?? doc.container;
    parent.sheet._renderChild(doc.sheet);
  }
</script>

<a
  class={['tidy-table-button', { disabled }]}
  data-tooltip={'DND5E.ItemEdit'}
  onclick={onClick}
>
  <i class="fas fa-edit fa-fw"></i>
</a>
