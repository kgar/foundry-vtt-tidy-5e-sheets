<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    disabled?: boolean;
    doc: any;
    tooltip?: string;
    attributes?: Record<string, any>;
  }

  let {
    doc,
    disabled,
    tooltip = FoundryAdapter.localize('DND5E.ItemDelete'),
    attributes: attributesOverride,
  }: Props = $props();

  const attributes = $derived(
    !disabled && !!doc
      ? (attributesOverride ?? {
          'data-action': 'deleteDocument',
          'data-uuid': doc.uuid,
        })
      : {},
  );
</script>

<a
  class="tidy-table-button"
  aria-label={tooltip}
  data-tooltip=""
  {...attributes}
>
  <i class="fa-solid fa-trash fa-fw"></i>
</a>
