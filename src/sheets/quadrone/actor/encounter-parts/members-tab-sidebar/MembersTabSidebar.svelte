<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import EncounterSkills from './EncounterSkills.svelte';

  const localize = FoundryAdapter.localize;
</script>

<div class="list traits">
  <!-- Languages -->
  <div class="list-entry">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-comments"></i>
        {localize('DND5E.Languages')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- TODO -->
        </ul>
      </div>
    </div>
  </div>

  <!-- Speeds -->
  <div class="list-entry">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-comments"></i>
        {localize('DND5E.Speed')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- TODO -->
        </ul>
      </div>
    </div>
  </div>

  <!-- Senses -->
  <div class="list-entry">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-comments"></i>
        {localize('DND5E.Senses')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- TODO -->
        </ul>
      </div>
    </div>
  </div>

  <!-- Skills -->
  <EncounterSkills />

  <!-- DR -->
  <div class="list-entry">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-comments"></i>
        {localize('DND5E.Resistances')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- TODO -->
        </ul>
      </div>
    </div>
  </div>

  <!-- DI -->
  <div class="list-entry">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-comments"></i>
        {localize('DND5E.TraitDIPlural.other')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- TODO -->
        </ul>
      </div>
    </div>
  </div>

  <!-- CI -->
  <div class="list-entry">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-comments"></i>
        {localize('DND5E.TraitCIPlural.other')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- TODO -->
        </ul>
      </div>
    </div>
  </div>

  <!-- DV -->
  <div class="list-entry">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-comments"></i>
        {localize('DND5E.Vulnerabilities')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- TODO -->
        </ul>
      </div>
    </div>
  </div>

  <!-- DM -->
  <div class="list-entry">
    <div class="list-label flexrow">
      <h4 class="font-weight-label">
        <i class="fa-solid fa-comments"></i>
        {localize('DND5E.DamageModification.Label')}
      </h4>
    </div>
    <div class="list-content">
      <div class="list-values">
        <ul class="pills">
          <!-- TODO -->
        </ul>
      </div>
    </div>
  </div>
</div>
