<script>
    import ButtonMenu from "src/components/button-menu/ButtonMenu.svelte";

</script>
<aside class="sidebar expanded">
  Sidebar likely holds group bastion content.
</aside>
<div class="tab-content">
  <div class="tab-actions button-bar">
    <button
      class="button button-secondary"
      type="button"
      onclick={() => {
        console.log('Take a bastion turn');
      }}
    >
      <i class="fa-solid fa-poo-storm"></i>
      Take a Bastion Turn
    </button>
    <button
    class="button button-secondary"
    type="button"
    onclick={() => {
      console.log('Take a bastion turn');
    }}
  >
    <i class="fa-solid fa-poo-storm"></i>
    Roll Bastion Event (Maintain)
  </button>
  </div>
  Table has individual player bastion content.
</div>