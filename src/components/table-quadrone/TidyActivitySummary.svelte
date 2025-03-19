<script lang="ts">
  import type { Activity5e } from 'src/foundry/dnd5e.types';

  interface Props {
    activity: Activity5e;
  }

  let { activity }: Props = $props();
</script>

TODO: make cool summary for this activity: {activity.name}
