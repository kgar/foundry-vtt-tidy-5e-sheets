<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  interface Props {
    name: string;
    uuid: string;
  }

  let { name, uuid }: Props = $props();
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<a
  role="button"
  tabindex="0"
  class="bastion-facility-name truncate"
  data-action="showDocument"
  data-uuid={uuid}
  data-tooltip={name}
  {@attach InputAttachments.triggerClickOnKeydown}
>
  {name}
</a>
