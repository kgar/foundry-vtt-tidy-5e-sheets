<script lang="ts">
  export let checked = false;
</script>

<label class="field-toggle">
  <span class="checked-icon-container">
    <i class="checked-icon fas fa-check"></i>
  </span>
  <span class="unchecked-icon-container">
    <i class="unchecked-icon fas fa-xmark"></i>
  </span>
  <span class="thumb-container">
    <i class="thumb fas fa-circle"></i>
  </span>
  <input type="checkbox" on:change {checked} class="toggle hidden" />
</label>
