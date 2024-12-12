<script lang="ts">
  import type { Activity5e } from 'src/foundry/dnd5e.types';

  interface Props {
    activity: Activity5e;
  }

  let { activity }: Props = $props();
</script>

<header>
  {activity.name}
</header>

<div class="info-card-content">
  <dl>
    <dt>TODO</dt>
    <dd>Put stuff here</dd>
    <dt>TODO</dt>
    <dd>Put stuff here</dd>
    <dt>TODO</dt>
    <dd>Put stuff here</dd>
    <dt>TODO</dt>
    <dd>Put stuff here</dd>
    <dt>TODO</dt>
    <dd>Put stuff here</dd>
  </dl>
</div>
