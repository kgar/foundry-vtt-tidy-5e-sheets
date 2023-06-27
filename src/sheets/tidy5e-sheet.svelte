<script lang="ts">
  export let actor: any;
  export let submit: () => void;
  export let owner: boolean;
  export let localize: (value: string) => string;
  export let debug: any = '';
  export let dnd5eConfig: any;

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      submit();
    }
  }
</script>

<div style="height: 100%; overflow-y: scroll; overflow-x: hidden">
  {#if owner}
    <h1
      contenteditable="true"
      spellcheck="false"
      data-placeholder={localize('DND5E.Name')}
      data-maxlength="40"
      bind:textContent={actor.name}
      on:blur={submit}
      on:keypress={submitWhenEnterKey}
    />
  {:else}
    <h1>
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

  <p>
    HP: {actor.system.attributes.hp.value} / {actor.system.attributes.hp.max}
  </p>

  {#each Object.entries(actor.system.abilities) as ability}
    <div style="display: flex;">
      <button on:click={(event) => actor.rollAbility(ability[0], { event })}
        >{dnd5eConfig.abilities[ability[0]].label}</button
      >
      <button on:click={(event) => actor.rollAbilityTest(ability[0], { event })}
        >Do a {dnd5eConfig.abilities[ability[0]].label} roll!</button
      >
      <button on:click={(event) => actor.rollAbilitySave(ability[0], { event })}
        >Make a {dnd5eConfig.abilities[ability[0]].label} save!</button
      >
    </div>
  {/each}
  <hr />
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
    {#each Object.entries(actor.system.skills) as skill}
      <button on:click={(event) => actor.rollSkill(skill[0], { event })}
        >{dnd5eConfig.skills[skill[0]].label}</button
      >
    {/each}
  </div>

  <pre style="height: 400px; overflow-y: scroll">
{JSON.stringify(actor, null, '  ')}
  </pre>
  {JSON.stringify(debug, null, '  ')}
</div>

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
