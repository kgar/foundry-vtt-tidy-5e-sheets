<script lang="ts">
  import { EventHelper } from 'src/utils/events';

  interface Props {
    targetSelector: '[data-item-id]' | '[data-activity-id]';
  }

  let { targetSelector }: Props = $props();
</script>

<a
  class="tidy-table-button"
  onclick={(ev) => EventHelper.triggerContextMenu(ev, targetSelector)}
>
  <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
</a>
