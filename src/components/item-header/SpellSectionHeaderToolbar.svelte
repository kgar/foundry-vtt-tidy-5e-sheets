<!-- TODO: Consider inlining the components here, since this one component will go out to all spellbook item lists/grids. -->
<div class="item-header-toolbar">
  <div class="left">
    <slot name="left-content" />
  </div>
  <div class="right">
    <slot name="right-content" />
  </div>
</div>

<style lang="scss">
  .item-header-toolbar {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    margin-bottom: 0.125rem;
    margin-left: 0.0625rem;
    margin-right: 0.0625rem;

    .left,
    .right {
      display: flex;
      gap: 0.125rem;
    }
  }
</style>
