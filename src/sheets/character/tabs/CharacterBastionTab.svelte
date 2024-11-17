<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="bastion-container scroll-container">
  <section class="name">
    {#if $context.unlocked}
      <TextInput
        document={$context.actor}
        field="system.bastion.name"
        value={$context.system.bastion.name}
        selectOnFocus={true}
      />
    {:else}
      <div class="document-name">{$context.system.bastion.name}</div>
    {/if}
  </section>
  <section class="contents">
    <section class="facilities special">
      <h3>
        <i class="fas fa-building-columns"></i>
        {localize('DND5E.FACILITY.Types.Special.Label.other')}
        <span class="count">
          <span class="added">2</span> / <span class="total">2</span>
        </span>
      </h3>
      <ul>
        <li class="facility special">
          <div class="facility-header">
            <div class="title-and-subtitle">
              <a class="title highlight-on-hover"> Barrack </a>
              <span class="subtitle">
                Recruit &bull; Roomy &bull; Level 5
              </span>
            </div>
            <a class="facility-menu highlight-on-hover">
              <i class="fas fa-ellipsis-vertical"></i>
            </a>
          </div>
          <div class="sub-header">
            {localize('DND5E.FACILITY.FIELDS.hirelings.max.label')}
          </div>
          <div class="slots hirelings">
            <div
              data-actor-uuid="Actor.q2zeMwiDSCq2rcso"
              class="slot occupant-slot hireling"
              data-index="0"
            >
              <img
                src="systems/dnd5e/tokens/humanoid/Hobgoblin.webp"
                alt="Hobgoblin (Tidy)"
              />
            </div>
            <div
              data-actor-uuid="Actor.q2zeMwiDSCq2rcso"
              class="slot occupant-slot hireling"
              data-index="1"
            >
              <img
                src="systems/dnd5e/tokens/humanoid/Hobgoblin.webp"
                alt="Hobgoblin (Tidy)"
              />
            </div>
            <div
              data-actor-uuid="Actor.q2zeMwiDSCq2rcso"
              class="slot occupant-slot hireling"
              data-index="2"
            >
              <img
                src="systems/dnd5e/tokens/humanoid/Hobgoblin.webp"
                alt="Hobgoblin (Tidy)"
              />
            </div>
            <div class="slot occupant-slot hireling empty" data-index="3"></div>
          </div>
          <div class="sub-header">
            {localize('DND5E.FACILITY.FIELDS.defenders.max.label')}
          </div>
          <div class="slots defenders">
            <div
              data-actor-uuid="Actor.q2zeMwiDSCq2rcso"
              class="slot occupant-slot defender"
              data-index="0"
            >
              <img
                src="systems/dnd5e/tokens/humanoid/Hobgoblin.webp"
                alt="Hobgoblin (Tidy)"
              />
            </div>
            <div
              data-actor-uuid="Actor.q2zeMwiDSCq2rcso"
              class="slot occupant-slot defender"
              data-index="1"
            >
              <img
                src="systems/dnd5e/tokens/humanoid/Hobgoblin.webp"
                alt="Hobgoblin (Tidy)"
              />
            </div>
            <div
              data-actor-uuid="Actor.q2zeMwiDSCq2rcso"
              class="slot occupant-slot defender"
              data-index="2"
            >
              <img
                src="systems/dnd5e/tokens/humanoid/Hobgoblin.webp"
                alt="Hobgoblin (Tidy)"
              />
            </div>
            <div class="slot occupant-slot defender empty" data-index="3"></div>
          </div>
          <div class="sub-header">Order</div>
          <div class="meter progress">
            <span class="order"> Recruit </span>
            <span>
              <span class="elapsed">45</span> / <span class="total">80</span>
            </span>
          </div>
        </li>
        <li class="facility special"></li>
        <li class="facility empty">
          <a class="highlight-on-hover">
            <i class="fas fa-building-columns"></i>
            {localize('DND5E.FACILITY.AvailableFacility.special.free')}
          </a>
        </li>
      </ul>
    </section>
    <section class="facilities basic">
      <h3>
        <i class="fas fa-chess-rook"></i>
        {localize('DND5E.FACILITY.Types.Basic.Label.other')}
      </h3>
      <ul>
        <li class="facility">
          <div class="facility-header">
            <a class="title">Keeping Room</a>
            <ul>
              <li>Unbuilt</li>
            </ul>
          </div>
        </li>
        <li class="facility">
          <div class="facility-header">
            <a class="title">Bedchambers</a>
            <ul>
              <li>Cramped</li>
              <li>Bedroom</li>
            </ul>
            <a class="transparent-icon-button">
              <i class="fas fa-ellipsis-vertical"></i>
            </a>
          </div>
          <div class="sub-header">Order</div>
          <div class="meter progress">
            <span class="order"> Enlarge </span>
            <span>
              <span class="elapsed">45</span> / <span class="total">80</span>
            </span>
          </div>
        </li>
        <li class="facility empty">
          <a class="highlight-on-hover">
            <i class="fa-solid fa-trowel"></i>
            {localize('DND5E.FACILITY.AvailableFacility.basic.build')}
          </a>
        </li>
        <li class="facility empty">
          <a class="highlight-on-hover">
            <i class="fas fa-chess-rook"></i>
            {localize('DND5E.FACILITY.AvailableFacility.basic.free')}
          </a>
        </li>
      </ul>
    </section>
    <section class="roster defenders">
      <h3>
        <i class="fa-solid fa-shield"></i>
        {localize('DND5E.FACILITY.FIELDS.defenders.max.label')}
      </h3>
      <ul>
        <li>Actor Image</li>
        <li>Actor Image</li>
        <li>Actor Image</li>
        <li>Actor Image</li>
      </ul>

      <ul>
        <li class="empty">{localize('DND5E.FACILITY.NoDefenders')}</li>
      </ul>
    </section>
    <section class="roster hirelings">
      <h3>
        <i class="fa-solid fa-users"></i>
        {localize('DND5E.FACILITY.FIELDS.hirelings.max.label')}
      </h3>
      <ul>
        <li>Actor Image</li>
        <li>Actor Image</li>
        <li>Actor Image</li>
        <li>Actor Image</li>
      </ul>

      <ul>
        <li></li>
      </ul>
    </section>
  </section>
  <section class="description">
    <h3><i class="fa-solid fa-feather"></i> Description</h3>
  </section>
</div>
