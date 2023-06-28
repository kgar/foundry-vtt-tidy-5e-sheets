<script lang="ts">
  import type { Actor5e } from '../foundry/foundry-adapter';
  import { onMount } from 'svelte';
  import { FoundryAdapter } from '../foundry/foundry-adapter';
  import SheetEditor from './sheet-editor.svelte';
  import type { SheetFunctions } from 'src/types/types';

  export let actor: Actor5e;
  export let debug: any = 'Put any debug information here, if ya need it.';
  export let sheetFunctions: SheetFunctions;

  function submitWhenEnterKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      sheetFunctions.submit();
    }
  }

  console.log('Tidy5e KGar', debug);
  const actorReference = FoundryAdapter.getActorReference();
  const localize = FoundryAdapter.localize;

  onMount(() => {
    sheetFunctions.activateListeners();
  });
</script>

<div style="height: 100%; overflow-y: scroll; overflow-x: hidden">
  <article style="height: 200px;">
    <div>Test: Background Editor</div>

    <SheetEditor
      content={actor.system.details.background}
      target="system.details.background"
      editable={actor.isOwner || FoundryAdapter.userIsGm()}
    />
  </article>
  <article style="height: 200px;">
    <div>Test: Bond Editor</div>
    <SheetEditor
      content={actor.system.details.bond}
      target="system.details.bond"
      editable={actor.isOwner || FoundryAdapter.userIsGm()}
    />
  </article>
  <article style="height: 200px;">
    <div>Test: Flaw Editor</div>
    <SheetEditor
      content={actor.system.details.flaw}
      target="system.details.flaw"
      editable={actor.isOwner || FoundryAdapter.userIsGm()}
    />
  </article>

  {#if actor.isOwner}
    <h1
      contenteditable="true"
      spellcheck="false"
      data-placeholder={localize('DND5E.Name')}
      data-maxlength="40"
      bind:textContent={actor.name}
      on:blur={sheetFunctions.submit}
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
    placeholder={localize('DND5E.Name')}
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
