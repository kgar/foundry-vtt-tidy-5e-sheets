<script lang="ts">
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  interface Props {
    member: GroupMemberQuadroneContext;
  }

  let { member }: Props = $props();
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<a
  role="button"
  tabindex="0"
  class="bastion-member truncate"
  data-action="showDocument"
  data-uuid={member.actor.uuid}
  style:--t5e-theme-color-default={member.accentColor}
  onclick={() => {
    const document = game.documents.get(member.actor.uuid);
    if (document) {
      document.render(true);
    }
  }}
  onkeydown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      const document = game.documents.get(member.actor.uuid);
      if (document) {
        document.render(true);
      }
    }
  }}
>
  {#if member.portrait.isVideo}
    <video
      class="bastion-member-portrait {member.portrait.shape}"
      src={member.portrait.src}
      autoplay
      muted
      playsinline
      disablepictureinpicture
      loop
    ></video>
  {:else}
    <img
      class="bastion-member-portrait {member.portrait.shape}"
      src={member.portrait.src}
      alt={member.actor.name}
    />
  {/if}
  <span class="truncate">{member.actor.name}</span>
</a>
