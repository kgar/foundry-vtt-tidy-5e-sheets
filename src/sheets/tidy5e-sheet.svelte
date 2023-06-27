<script lang="ts">
  export let actor: any;
  export let submit: () => void;
  export let owner: boolean;
  export let localize: (value: string) => string;
  export let debug: any = '';

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      submit();
    }
  }
</script>

{#if owner}
  <h1
    class="char-name"
    contenteditable="true"
    spellcheck="false"
    data-target="{actor._id}-name"
    data-placeholder={localize('DND5E.Name')}
    data-maxlength="40"
    bind:textContent={actor.name}
    on:blur={submit}
    on:keypress={submitWhenEnterKey}
  />
{:else}
  <h1
    class="char-name"
    data-target="{actor._id}-name"
    data-placeholder={localize('DND5E.Name')}
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

<style lang="scss">
  [contenteditable] {
    border: none;
    outline: none;
    display: inline-block;
    border-radius: 3px;
    -moz-user-select: text;
    -khtml-user-select: text;
    -webkit-user-select: text;
    -o-user-select: text;
    user-select: text;

    &:empty::before {
      content: attr(data-placeholder);
      pointer-events: none;
      display: block; // For Firefox
      color: var(--t5e-tertiary-color);
    }
  }
</style>
