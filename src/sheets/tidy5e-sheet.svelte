<script lang="ts">
  export let actor: any;
  export let submit: () => void;
  export let owner: boolean;
  export let debug: any = '';

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      submit();
    }
  }
</script>

<div>
  {#if owner}
    <h1
      class="char-name"
      contenteditable="true"
      spellcheck="false"
      data-target="{actor._id}-name"
      data-placeholder="TODO: localize 'DND5E.Name'"
      data-maxlength="40"
      bind:textContent={actor.name}
      on:blur={submit}
      on:keypress={submitWhenEnterKey}
    />
  {:else}
    <h1
      class="char-name"
      data-target="{actor._id}-name"
      data-placeholder="TODO: localize 'DND5E.Name'"
      data-maxlength="40"
    >
      {actor.name}
    </h1>
  {/if}

  <input
    name="name"
    type="hidden"
    value={actor.name}
    placeholder="TODO: localize 'DND5E.Name'"
    maxlength="40"
  />

  <p>
    Actor Name: {actor.name}<br />
    Owner: {owner}
  </p>

  {JSON.stringify(actor, null, '\t')}
  {JSON.stringify(debug, null, '\t')}
</div>
