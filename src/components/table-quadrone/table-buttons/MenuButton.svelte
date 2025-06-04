<script lang="ts">
  import { EventHelper } from 'src/utils/events';

  interface Props {
    targetSelector:
      | '[data-context-menu]'
      | '[data-item-id]'
      | '[data-activity-id]'
      | '[data-effect-id]'
      | (string & {});
  }

  let { targetSelector }: Props = $props();
</script>

<a
  class="tidy-table-button"
  onclick={(ev) => EventHelper.triggerContextMenu(ev, targetSelector)}
>
  <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
</a>
