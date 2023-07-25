## Temp HP To Do

- [ ] HTML
- [ ] SCSS
- [ ] Functionality
- [ ] Config Button
- [ ] Settings?
  - [ ] Allow Temp HP Override

## Temp HP impl

```hbs
{{!-- Temp Hit Points --}}
<div class="portrait-temp">
    <input name="system.attributes.hp.temp" type="text" class="temphp" placeholder="+{{ localize 'DND5E.Temp' }}"
    value="{{#if (eq hp.temp 0)}}{{else}}{{hp.temp}}{{/if}}" title="{{localize 'DND5E.HitPointsTemp'}}" data-dtype="Number" maxlength="5">
    <input name="system.attributes.hp.tempmax" type="text" class="max-temphp" placeholder="+{{ localize 'DND5E.Max' }}"
    value="{{#if (eq hp.tempmax 0)}}{{else}}{{hp.tempmax}}{{/if}}" title="{{localize 'DND5E.HitPointsTempMax'}}" data-dtype="Number" maxlength="5">
    {{#if @root.allowHpConfigOverride}}
    <a class="config-button hit-points-tidy" data-tooltip="{{localize 'DND5E.HitPointsConfig'}}">
        <i class="fas fa-cog"></i>
    </a>
    {{else}}
    <a class="config-button" data-action="hit-points" data-tooltip="{{localize 'DND5E.HitPointsConfig'}}">
        <i class="fas fa-cog"></i>
    </a>
    {{/if}}
</div>
```

```scss
.profile-temp {
  display: flex;
  justify-content: center;
}

.profile-temp input {
  display: flex;
  font-size: 12px;
  line-height: 12px;
  height: 14px;
  padding: 1px 0;
  width: 35px;
}

input.temphp {
  text-align: center;
}

input.max-temphp {
  text-align: center;
}

```