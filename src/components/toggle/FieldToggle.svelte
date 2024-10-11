<script lang="ts">
  export let checked = false;
</script>

<label class="field-toggle">
  <span class="track">
    <i class="checked-icon fas fa-check"></i>
    <i class="unchecked-icon fas fa-xmark"></i>
    <span class="thumb"></span>
  </span>
  <input type="checkbox" on:change {checked} class="toggle hidden" />
</label>
