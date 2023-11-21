<script lang="ts">
  import { getContext } from 'svelte';

  const appId = getContext('appId');
</script>

<h2>Hello, world!</h2>
<p>This is {appId}</p>
