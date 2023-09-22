<script lang="ts">
  export let cssClass: string = '';
</script>

<li class="button-menu-item {cssClass}">
  <slot />
</li>
