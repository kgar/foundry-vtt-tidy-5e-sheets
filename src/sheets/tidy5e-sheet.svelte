<script lang="ts">
  import type { Actor5e, ActorReference } from 'src/foundry/foundry-adapter';

  export let actor: Actor5e;
  export let actorReference: ActorReference;
  export let submit: () => void;
  export let localize: (value: string) => string;
  export let debug: any = 'Put any debug information here, if ya need it.';

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      submit();
    }
  }

  console.log('Tidy5e KGar', debug);
</script>

<div style="height: 100%; overflow-y: scroll; overflow-x: hidden">
  {#if actor.isOwner}
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
    Owner: {actor.isOwner}
  </p>

  <p>
    HP: {actor.system.attributes.hp.value} / {actor.system.attributes.hp.max}
  </p>

  {#each actorReference.abilitiesList as ability}
    <div style="display: flex;">
      <button
        on:click={(event) => actor.rollAbility(ability.abbreviation, { event })}
        >{actorReference.abilities[ability.abbreviation].label}</button
      >
      <button
        on:click={(event) =>
          actor.rollAbilityTest(ability.abbreviation, { event })}
        >Do a {actorReference.abilities[ability.abbreviation].label} roll!</button
      >
      <button
        on:click={(event) =>
          actor.rollAbilitySave(ability.abbreviation, { event })}
        >Make a {actorReference.abilities[ability.abbreviation].label} save!</button
      >
    </div>
  {/each}
  <hr />
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
    {#each actorReference.skillsList as skill}
      <button
        on:click={(event) => actor.rollSkill(skill.abbreviation, { event })}
        >{actorReference.skills[skill.abbreviation].label}</button
      >
    {/each}
  </div>
</div>
