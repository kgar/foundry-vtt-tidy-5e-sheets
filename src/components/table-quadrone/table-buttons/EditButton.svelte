<script lang="ts">
  interface Props {
    disabled?: boolean;
    doc: any;
  }

  let { doc, disabled }: Props = $props();

  const attributes = $derived(
    !disabled
      ? {
          ['data-action']: 'editDocument',
          ['data-uuid']: doc.uuid,
        }
      : {},
  );
</script>

<a
  class={['tidy-table-button', { disabled }]}
  data-tooltip={'DND5E.ItemEdit'}
  {...attributes}
>
  <i class="fas fa-edit fa-fw"></i>
</a>
