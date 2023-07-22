## Attributes Tab To Do's

- [x] Make a component
- [ ] HTML
  - [ ] Skills
  - [ ] Traits
  - [ ] Resources
  - [ ] Favorites - stub for now
- [ ] Functionality
  - [ ] configure skills
  - [ ] roll skills / support modifier keys (CTRL, SHIFT, ALT)
  - [ ] set skill proficiency
  - [ ] edit traits
  - [ ] configure special traits
  - [ ]
- [ ] Settings
  - [ ] traitsTogglePc : By default empty traits are always visible. Enable to add a toggle button.
  - [ ] traitsMovedBelowResource : Enable to move traits from the left side below resources.
  - [ ]
- [ ] Styles
  - [ ] `_mainTab.scss`

## Skills impl

```hbs
<div class="left-pane">

    {{!-- Skills --}}
    <ul class="skills-list">
    {{#each config.skills as |label s|}}
    {{#with (lookup ../skills s) as |skill|}}
    <li class="proficiency-row skill {{#if skill.value}}proficient{{/if}}" data-skill="{{s}}" data-property="skills" data-key="{{s}}">
            <a class="config-button" data-action="skill" data-tooltip="{{localize 'DND5E.SkillConfigure'}}">
                <i class="fas fa-cog"></i>
            </a>
            <input type="hidden" name="system.skills.{{s}}.value"
                value="{{skill.baseValue}}" data-dtype="Number">
            <input type="hidden" name="system.skills.{{s}}.ability" value="{{skill.ability}}">
            <a class="proficiency-toggle skill-proficiency" title="{{skill.hover}}">{{{skill.icon}}}</a>
            <h4 class="skill-name rollable">{{skill.label}}</h4>
            <span class="skill-ability">{{skill.abbreviation}}</span>
            <span class="skill-mod">{{numberFormat skill.total decimals=0 sign=true}}</span>
            <span class="skill-passive" title="{{skill.label}} ({{ localize 'DND5E.Passive' }})">({{skill.passive}})</span>
        </li>
    {{/with}}
    {{/each}}
    </ul>

    {{!-- Traits --}}
    {{> "modules/tidy5e-sheet/templates/actors/parts/tidy5e-traits.html"}}
</div>

<!-- Center Pane goes here -->

```

## Traits impl

```hbs
<div class="traits {{#if actor.flags.tidy5e-sheet.traitsExpanded}}expanded{{/if}}">
	{{#unless @root.isVehicle}}
	<div class="form-group">
		<article title="{{localize 'DND5E.Senses'}}">
			<label for="traits.traits.senses">
				<i class="fas fa-eye"></i>
				<span>{{localize 'DND5E.Senses'}}</span>
			</label>
			<ul class="traits-list">
				{{#each senses as |v k|}}
				<li class="tag {{k}}">{{v}}</li>
				{{/each}}
			</ul>
		</article>
		<a class="config-button" data-action="senses" title="{{localize 'DND5E.SensesConfig'}}">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>

	<div class="form-group {{traits.traits.languages.cssClass}}">
		<article title="{{localize 'DND5E.Languages'}}">
			<label for="traits.traits.languages">
				<i class="fas fa-comment"></i>
				<span>{{localize 'DND5E.Languages'}}</span>
			</label>
			<ul class="traits-list">
				{{#each traits.traits.languages.selected as |v k|}}
				<li class="tag {{k}}">{{v}}</li>
				{{/each}}
			</ul>
		</article>
		<a class="trait-selector" data-trait="languages" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.Languages')}}" tabindex="0">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>
	{{/unless}}

	<div class="form-group {{traits.traits.di.cssClass}}">
		<article title="{{localize 'DND5E.DamImm'}}">
			<label for="traits.traits.di">
				<i class="fas fa-heart"></i>
				<span>{{localize 'DND5E.DamImm'}}</span>
			</label>
			<ul class="traits-list">
				{{#each traits.traits.di.selected as |v k|}}
				<li class="tag {{k}}">{{v}}</li>
				{{/each}}
			</ul>
		</article>
		<a class="trait-selector" data-trait="di" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.DamImm')}}" tabindex="0">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>

	<div class="form-group {{traits.traits.dr.cssClass}}">
		<article title="{{localize 'DND5E.DamRes'}}">
			<label for="traits.traits.dr">
				<i class="far fa-heart"></i>
				<span>{{localize 'DND5E.DamRes'}}</span>
			</label>
			<ul class="traits-list">
				{{#each traits.traits.dr.selected as |v k|}}
				<li class="tag {{k}}">{{v}}</li>
				{{/each}}
			</ul>
		</article>
		<a class="trait-selector" data-trait="dr" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.DamRes')}}" tabindex="0">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>

	<div class="form-group {{traits.traits.dv.cssClass}}">
		<article title="{{localize 'DND5E.DamVuln'}}">
			<label for="traits.traits.dv">
				<i class="fas fa-heart-broken"></i>
				<span>{{localize 'DND5E.DamVuln'}}</span>
			</label>
			<ul class="traits-list">
				{{#each traits.traits.dv.selected as |v k|}}
				<li class="tag {{k}}">{{v}}</li>
				{{/each}}
			</ul>
		</article>
		<a class="trait-selector" data-trait="dv" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.DamVuln')}}">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>

	<div class="form-group {{traits.traits.ci.cssClass}}">
		<article title="{{localize 'DND5E.ConImm'}}">
			<label for="traits.traits.ci">
				<i class="fas fa-shield-virus"></i>
				<span>{{localize 'DND5E.ConImm'}}</span>
			</label>
			<ul class="traits-list">
				{{#each traits.traits.ci.selected as |v k|}}
				<li class="tag {{k}}">{{v}}</li>
				{{/each}}
			</ul>
		</article>
		<a class="trait-selector" data-trait="ci" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.ConImm')}}">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>

	{{#if @root.isCharacter}}
	<div class="form-group {{traits.traits.weaponProf.cssClass}}">
		<article title="{{localize 'DND5E.TraitWeaponProf'}}">
			<label for="traits.traits.weaponProf">
				<svg x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve">
					<path
						d="M443.7,2.6c-2.2-2.5-5.8-3.3-8.8-1.8C417.9,9,358.8,36.1,304.4,43.5c-4.1,0.6-8-0.3-11.3-2.1c-1.5-0.8-2.4-2.5-2.4-4.2v0
  c0-10.7-8.7-19.4-19.5-19.4h-30.5c-10.7,0-19.5,8.7-19.5,19.4v0c0,1.7-0.9,3.4-2.4,4.2c-3.3,1.8-7.2,2.7-11.3,2.1
  C153.2,36.1,94.2,9,77.1,0.7c-3-1.5-6.6-0.7-8.8,1.8C56.3,16.4,21,64.9,21,154.9c0,83.4,30.3,143.6,44.3,166.9
  c2.9,4.9,10,4.7,12.8-0.2c10.5-19,34-59.1,62-91.7c0.4-0.5,0.9-1,1.3-1.5c28.3-30.7,79.9-9.8,79.9,32v232.2
  c0,10.7,8.7,19.4,19.5,19.4h30.5c10.7,0,19.5-8.7,19.5-19.4V260.4c0-41.8,51.5-62.7,79.9-32c0.4,0.5,0.9,1,1.3,1.5
  c28,32.6,51.5,72.7,62,91.7c2.8,5,9.9,5.1,12.8,0.2c14-23.3,44.3-83.4,44.3-166.9C491,64.9,455.7,16.4,443.7,2.6z"
					/>
				</svg>
				<span>{{localize 'DND5E.TraitWeaponProf'}}</span>
			</label>
			<ul class="traits-list">
				{{#each traits.traits.weaponProf.selected as |v k|}}
				<li class="tag {{k}}">{{v}}</li>
				{{/each}}
			</ul>
		</article>
		<a class="trait-selector" data-trait="weapon" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.TraitWeaponProf')}}">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>

	<div class="form-group {{traits.traits.armorProf.cssClass}}">
		<article title="{{localize 'DND5E.TraitArmorProf'}}">
			<label for="traits.traits.armorProf">
				<svg x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve">
					<path
						d="M471.7,198.8c0-56.6-37.8-107.3-81.7-147.1c-76-68.9-191.9-68.9-268,0c-43.9,39.8-81.7,90.5-81.7,147.1
          c0,93-3.2,163.9-12.5,203c-3.9,16.2,4,33,18.3,39.6l113.6,66.3c27.9,13.6,60.3-6.7,60.3-37.7V258.3c0-5.2-3.3-9.8-8.3-11.5
          l-91.3-30.4c-4.9-1.6-8.3-6.3-8.3-11.5v-15.1c0-6.7,5.4-12.1,12.1-12.1h263.4c6.7,0,12.1,5.4,12.1,12.1v15.1c0,5.2-3.3,9.8-8.3,11.5
          l-91.3,30.4c-4.9,1.6-8.3,6.3-8.3,11.5V470c0,31,32.5,51.3,60.3,37.7l113.6-66.3c14.3-6.6,22.2-23.4,18.3-39.6
          C474.9,362.7,471.7,291.8,471.7,198.8L471.7,198.8z"
					/>
				</svg>
				<span>{{localize 'DND5E.TraitArmorProf'}}</span>
			</label>
			<ul class="traits-list">
				{{#each traits.traits.armorProf.selected as |v k|}}
				<li class="tag {{k}}">{{v}}</li>
				{{/each}}
			</ul>
		</article>
		<a class="trait-selector" data-trait="armor" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.TraitArmorProf')}}">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>

	<div class="form-group {{traits.traits.toolProf.cssClass}}">
		<article title="{{localize 'DND5E.TraitToolProf'}}">
			<label for="traits.traits.toolProf">
				<i class="fas fa-hammer"></i>
				<span>{{localize 'DND5E.TraitToolProf'}}</span>
			</label>
			<ul class="traits-list">
				{{#each tools}}
					<li class="tag tool proficiency-row" data-property="tools" data-key="{{@key}}">
						<input type="hidden" name="system.tools.{{@key}}.value" value="{{baseValue}}" data-dtype="Number">
						<input type="hidden" name="system.tools.{{@key}}.ability" value="{{ability}}">
						<a class="proficiency-toggle tool-proficiency" data-tooltip="{{hover}}">{{{icon}}}</a>
						<h4 class="tool-name rollable">{{label}}</h4>
						<a class="config-button" data-action="tool" data-tooltip="DND5E.ToolConfigure">
							<i class="fas fa-cog"></i>
						</a>
					</li>
				{{/each}}
				</ul>
		</article>
		<a class="trait-selector" data-trait="tool" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.TraitToolProf')}}">
			<i class="fas fa-pencil-alt"></i>
		</a>
	</div>
	{{/if}}
	<div class="toggle-traits" data-show-traits="{{localize 'TIDY5E.Show'}}" data-hide-traits="{{localize 'TIDY5E.Hide'}}">{{localize "TIDY5E.TraitsEmpty"}}</div>
	{{#unless @root.isVehicle}}
	<a class="config-button configure-flags" data-action="flags" title="{{localize 'DND5E.TraitConfig' trait=(localize 'DND5E.SpecialTraits')}}">
		<i class="fas fa-cog"></i>
	</a>
	{{/unless}}
</div>

```

## Resurces impl, Alt Traits, and Favorites -> Center Pane

```hbs
<section class='center-pane flexcol'>
  {{! Body Attributes }}
  <ul class='attributes'>
    {{! Resources }}
    <ul class='resources'>
      {{#each resources as |res|}}
        <li class='resource'>
          <header class='resource-header'>
            <span class='res-options'><i class='fas fa-cog'></i></span>
            <div class='res-rest'>
              <h4>{{localize 'TIDY5E.RestoreOnRest'}}</h4>
              <input
                id='{{@root/appId}}-{{res.name}}.sr'
                name='system.resources.{{res.name}}.sr'
                type='checkbox'
                {{checked res.sr}}
              />
              <label
                for='{{@root/appId}}-{{res.name}}.sr'
                class='checkbox'
                title='{{localize "TIDY5E.RestS"}}'
              >
                {{localize 'DND5E.RestS'}}
              </label>
              <input
                id='{{@root/appId}}-{{res.name}}.lr'
                name='system.resources.{{res.name}}.lr'
                type='checkbox'
                {{checked res.lr}}
              />
              <label
                for='{{@root/appId}}-{{res.name}}.lr'
                class='checkbox'
                title='{{localize "TIDY5E.RestL"}}'
              >
                {{localize 'DND5E.RestL'}}
              </label>
            </div>
          </header>
          <h4 class='resource-name'>
            <input
              name='system.resources.{{res.name}}.label'
              type='text'
              value='{{res.label}}'
              placeholder='{{res.placeholder}}'
            />
          </h4>
          <div class='resource-value multiple'>
            <input
              class='res-value'
              type='text'
              name='system.resources.{{res.name}}.value'
              value='{{res.value}}'
              placeholder='0'
              data-dtype='Number'
              maxlength='3'
            />
            <span class='sep'> / </span>
            <input
              class='res-max'
              type='text'
              name='system.resources.{{res.name}}.max'
              value='{{res.max}}'
              placeholder='0'
              data-dtype='Number'
              maxlength='3'
            />
          </div>
        </li>
      {{/each}}
    </ul>

    {{! Counters }}

    {{! Traits }}
    <div class='alt-trait-pos'></div>

    {{! Actions }}
    <div class='actions-target list-layout'></div>
    {{! Favorites }}
    <div class='favorites-target'></div>
  </ul>
</section>
```

## Styles reference - `_main-tab.scss`

```scss
// Left Pane

.left-pane {
  display: flex;
  flex-wrap: wrap;
  width: 15rem;
}

// Skill List

.skills-list {
  border: 0.0625rem solid var(--t5e-faint-color);
  border-radius: 0.3125rem;
  overflow: visible;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;

  .skill {
    display: flex;
    justify-content: space-between;
    flex: 0 0 1.125rem;
    font-size: 0.75rem;
    line-height: 0.875rem;
    align-items: center;
    padding: 0.1875rem 0.25rem 0.0625rem 0.25rem;
    height: 1.125rem;
    flex-wrap: nowrap;

    &:nth-child(even) {
      background: var(--t5e-faint-color);
    }

    .skill-name {
      font-size: 0.75rem;
      line-height: 0.875rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
      margin: 0 0.25rem;
      font-weight: 400;
    }

    .config-button {
      font-size: 0.625rem;
      margin-right: 0.25rem;
      color: var(--t5e-tertiary-color);
      &:hover {
        color: var(--t5e-primary-color);
      }
    }

    &.proficient .skill-name {
      font-weight: 700;
    }

    .skill-proficiency {
      font-size: 0.625rem;
      color: var(--t5e-tertiary-color);

      &:hover {
        color: var(--t5e-primary-font);
      }

      i {
        vertical-align: baseline;
      }

      &:not(.proficiency-toggle) {
        cursor: default;
        &:hover {
          color: var(--t5e-tertiary-color);
        }
      }
    }

    .skill-mod,
    .skill-passive {
      text-align: right;
      flex: 0 0 1.5rem;
    }

    .skill-passive {
      color: var(--t5e-tertiary-color);
    }

    .skill-ability {
      flex: 0 0 1.5rem;
      text-transform: capitalize;
    }
  } //.skill
} //.skills-list

// Center Pane

.center-pane {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: initial;
  padding: 0;
  margin-left: 1rem;
  height: auto;
  overflow-x: inherit;
}

// Resources

.center-pane .resources {
  margin: 0;
  border: 0.0625rem solid var(--t5e-faint-color);
  border-radius: 0.3125rem;
  display: flex;
  flex-wrap: wrap;
}

.center-pane .resources .resource {
  margin: 0 0 0.0625rem 0;
  padding: 0.0625rem 0 0 0;
  height: 2.625rem;
  position: relative;
  border: none;
  border-radius: 0;
  border-left: 0.0625rem solid var(--t5e-faint-color);
  border-top: 0.0625rem solid var(--t5e-faint-color);
  flex: 1 0 33%;
}

.center-pane .resources .resource:nth-child(3n + 1) {
  border-left: 0;
}

.center-pane .resources .resource:nth-child(-n + 3) {
  border-top: 0;
  margin-bottom: 0;
  padding-top: 0;
}

// Resource Restoration Menu

.resources .resource .resource-header {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  z-index: 10;
}

.resources .resource .resource-header .res-options {
  position: relative;
  right: 0.125rem;
  bottom: 0;
  font-size: 0.75rem;
  color: var(--t5e-tertiary-color);
  transition: color 0.3s ease;
}

.resources .resource .resource-header .res-rest {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.3125rem;
}

.resources .resource .resource-header:hover {
  width: 100%;
  height: 100%;
}

.resources .resource .resource-header:hover ~ * {
  opacity: 0;
}

.resources .resource .resource-header:hover .res-rest {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.resources .resource .resource-header .res-rest h4 {
  margin: 0.25rem 0 0rem 0;
  font-size: 0.75rem;
  line-height: 1;
  color: #555;
  flex: 0 0 100%;
  text-align: center;
}

.resources .resource .resource-header label.checkbox {
  border: 0.0625rem solid var(--t5e-light-color);
  padding: 0.1875rem;
  margin: 0 0.125rem;
  border-radius: 0.3125rem;
  font-size: 0.6875rem;
  cursor: pointer;
  transition: background 0.3s ease;
  text-align: center;
  flex: 0 0 3.125rem;
  line-height: 1rem;
}

.resources .resource .resource-header label.checkbox:hover {
  background: var(--t5e-light-color);
}

.resources .resource .resource-header input:checked + label.checkbox {
  background: var(--t5e-tertiary-color);
  color: var(--t5e-background);
}

.resources .resource .resource-header:hover .res-options {
  color: var(--t5e-secondary-color);
}

.resources .resource .resource-header input {
  display: none;
}

// Resource Managment
.resources .resource .resource-name input {
  font-family: var(--t5e-modesto);
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  height: 1.125rem;
}

.resources .resource .resource-value {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.375rem;
  line-height: 1.5625rem;
  font-family: var(--t5e-modesto);
}

.resources .resource .attribute-name input[type='text'] {
  height: 1.25rem;
  margin: 0;
  line-height: 1.5rem;
}

.resources .resource .resource-value.multiple input {
  font-size: 1.375rem;
  max-width: 3.5ch;
  height: 1.375rem;
  padding-top: 0.125rem;
}

.resources .resource .resource-value span.sep {
  font-size: 1.3125rem;
  opacity: 0.5;
}

.resources .resource .resource-value .res-value {
  text-align: right;
}

.resources .resource .resource-value .res-max {
  text-align: left;
}

// Character Traits
.traits {
  border: 0.0625rem solid var(--t5e-faint-color);
  border-radius: 0.3125rem 0.3125rem 0 0;
  overflow: visible;
  margin: 0.5rem 0 1.0625rem 0;
  width: 100%;
  position: relative;

  .form-group,
  .form-group-stacked {
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 0.25rem;
  }

  .multiple {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .multiple > * {
    flex: unset;
  }

  .form-group:nth-child(odd) {
    background: none;
  }

  .form-group:nth-child(even) {
    background: var(--t5e-faint-color);
  }

  .form-group:last-child {
    margin: 0;
  }

  .form-group article {
    padding: 0.125rem 0;
    display: flex;
  }

  .form-group article div {
    margin-left: 0.25rem;
  }

  .traits-list {
    line-height: 0.875rem;
    padding: 0 0.5rem 0 0;
  }

  label {
    display: flex;
    justify-content: center;
    font-size: 0.75rem;
    line-height: 0.875rem;
    margin-right: 0.25rem;

    span {
      display: none;
    }
  }

  &.show-labels {
    .form-group article {
      flex-wrap: wrap;
    }

    label {
      span {
        display: inline-block;
        margin-left: 0.25rem;
        font-weight: 700;
        color: var(--t5e-secondary-color);
      }
    }

    .traits-list {
      flex: 1 0 100%;
      line-height: 0.875rem;
      padding: 0 0 0 1.125rem;
    }
  }

  .multiple label {
    margin-right: 8px;
  }

  .tag {
    font-size: 0.75rem;
    float: left;
    margin-right: 0.25rem;

    &::after {
      content: ',';
    }

    &:last-child::after {
      content: none;
    }

    .tool {
      display: inline-flex;
      align-items: center;
      gap: 0.125rem;
      padding: 0rem 0.125rem;
    }
  } //.tag

  .trait-selector,
  .proficiency-selector,
  .config-button {
    flex: 0 0 0.625rem;
    color: #999;
    margin-left: 0.25rem;
    font-size: 0.75rem;
    line-height: 0.875rem;
    padding: 0.125rem 0 0 0;
  }

  &:not(.expanded):not(.always-visible) .trait-selector,
  &:not(.expanded):not(.always-visible) .proficiency-selector,
  &:not(.expanded):not(.always-visible) .config-button {
    display: none;
  }

  .trait-selector:hover i.fas,
  .proficiency-selector:hover i.fas,
  .config-button:hover i.fas {
    color: var(--t5e-secondary-color);
    text-shadow: none;
  }

  i {
    float: none;
    margin-right: 0;
    text-align: center;
    color: var(--t5e-tertiary-color);
    line-height: 0.875rem;
    width: 0.875rem;
    vertical-align: bottom;
  }

  svg {
    height: 0.75rem;
    width: 0.875rem;

    path {
      fill: var(--t5e-tertiary-color);
    }
  }

  .toggle-traits {
    position: absolute;
    display: inline-block;
    top: calc(100% + 0.0625rem);
    left: -0.0625rem;
    border: 0.0625rem solid var(--t5e-faint-color);
    border-top: 0;
    border-radius: 0 0 0.1875rem 0.1875rem;
    padding: 0.125rem 0.25rem;
    width: auto;
    font-size: 0.625rem;
    color: var(--t5e-secondary-color);
    cursor: pointer;
  }

  &.always-visible .toggle-traits {
    display: none;
  }

  .toggle-traits::before {
    content: attr(data-show-traits);
  }

  &.expanded .toggle-traits::before {
    content: attr(data-hide-traits);
  }

  .toggle-traits:hover {
    color: var(--t5e-primary-font);
  }

  .configure-flags {
    flex: 0;
    position: absolute;
    display: inline-block;
    top: calc(100% + 0.0625rem);
    right: -0.0625rem;
    border: 0.0625rem solid var(--t5e-faint-color);
    border-top: 0;
    border-radius: 0 0 0.1875rem 0.1875rem;
    padding: 0.125rem 0.25rem;
    width: auto;
    font-size: 0.625rem;
    color: var(--t5e-secondary-color);
  }

  .configure-flags i.fas {
    line-height: 0.625rem;
    vertical-align: baseline;
    color: var(--t5e-tertiary-color);
  }

  .configure-flags:hover,
  .configure-flags:hover i.fas {
    color: var(--t5e-primary-font);
  }
} //.traits
```

## Skill cog button impl

```js
const skill = event.currentTarget.closest('[data-key]').dataset.key;
app = new ProficiencyConfig(this.actor, { property: 'skills', key: skill });
```

## Cycle proficiency impl

```js
  /* -------------------------------------------- */

  /**
   * Handle cycling proficiency in a skill or tool.
   * @param {Event} event     A click or contextmenu event which triggered this action.
   * @returns {Promise|void}  Updated data for this actor after changes are applied.
   * @protected
   */
  _onCycleProficiency(event) {
    if ( event.currentTarget.classList.contains("disabled") ) return;
    event.preventDefault();
    const parent = event.currentTarget.closest(".proficiency-row");
    const field = parent.querySelector('[name$=".value"]');
    const {property, key} = parent.dataset;
    const value = this.actor._source.system[property]?.[key]?.value ?? 0;

    // Cycle to the next or previous skill level.
    const levels = [0, 1, .5, 2];
    const idx = levels.indexOf(value);
    const next = idx + (event.type === "contextmenu" ? 3 : 1);
    field.value = levels[next % levels.length];

    // Update the field value and save the form.
    return this._onSubmit(event);
  }
```

## Config Button Handling

```js
_onConfigMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  const button = event.currentTarget;
  let app;
  switch ( button.dataset.action ) {
    case "armor":
      app = new ActorArmorConfig(this.actor);
      break;
    case "hit-dice":
      app = new ActorHitDiceConfig(this.actor);
      break;
    case "hit-points":
      app = new ActorHitPointsConfig(this.actor);
      break;
    case "initiative":
      app = new ActorInitiativeConfig(this.actor);
      break;
    case "movement":
      app = new ActorMovementConfig(this.actor);
      break;
    case "flags":
      app = new ActorSheetFlags(this.actor);
      break;
    case "senses":
      app = new ActorSensesConfig(this.actor);
      break;
    case "type":
      app = new ActorTypeConfig(this.actor);
      break;
    case "ability": {
      const ability = event.currentTarget.closest("[data-ability]").dataset.ability;
      app = new ActorAbilityConfig(this.actor, null, ability);
      break;
    }
    case "skill": {
      const skill = event.currentTarget.closest("[data-key]").dataset.key;
      app = new ProficiencyConfig(this.actor, {property: "skills", key: skill});
      break;
    }
    case "tool": {
      const tool = event.currentTarget.closest("[data-key]").dataset.key;
      app = new ProficiencyConfig(this.actor, {property: "tools", key: tool});
      break;
    }
  }
  app?.render(true);
}
```
```js
  /**
   * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options.
   * @param {Event} event      The click event which originated the selection.
   * @returns {TraitSelector}  Newly displayed application.
   * @private
   */
  _onTraitSelector(event) {
    event.preventDefault();
    const trait = event.currentTarget.dataset.trait;
    if ( trait === "tool" ) return new ToolSelector(this.actor, trait).render(true);
    return new TraitSelector(this.actor, trait).render(true);
  }
```