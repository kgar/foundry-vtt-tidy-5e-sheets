<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import RemoveMemberControl from './RemoveMemberControl.svelte';
  import AcShieldBase from 'src/sheets/actor/AcShieldBase.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let member: Actor5e;
</script>

<div class="group-member-list-item flex-row small-gap">
  <button
    type="button"
    class="inline-transparent-button highlight-on-hover"
    on:click={() => member.sheet.render(true)}>{member.name}</button
  >
  <!-- TODO: Extract to own part component -->
  <AcShieldBase cssClass="group-ac-shield">
    <span class="ac-value">{member.system.attributes.ac.value}</span>
  </AcShieldBase>
  <RemoveMemberControl {member} />
</div>

<!-- TODO: To dedicated SCSS file(s) -->
<style lang="scss">
  .group-member-list-item {
    :global(.group-ac-shield .ac-shield) {
      width: 2.25rem;
    }
    .ac-value {
      font-family: var(--t5e-title-font-family);
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
</style>
