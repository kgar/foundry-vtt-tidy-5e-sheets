<script lang="ts">
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.TargetPl')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Target Type -->
  <div class="form-group split-group">
    <label for="{appId}-target-affects-type">{localize('DND5E.Type')}</label>
    <div class="form-fields">
      <!-- Amount -->
      {#if context.system.target.affects.scalar}
        <div class="form-group label-top">
          <label for="{appId}-target-affects-count"
            >{localize('DND5E.Amount')}</label
          >
          <div class="form-fields">
            <TextInputQuadrone
              id="{appId}-target-affects-count"
              document={context.item}
              field="system.target.affects.count"
              value={context.source.target.affects.count}
              placeholder={context.affectsPlaceholder}
              disabled={!context.unlocked}
            />
          </div>
        </div>
      {/if}

      <!-- Type -->
      <div class="form-group label-top">
        <label for="{appId}-target-affects-type">{localize('DND5E.Type')}</label
        >
        <div class="form-fields">
          <SelectQuadrone
            id="{appId}-target-affects-type"
            document={context.item}
            field="system.target.affects.type"
            value={context.source.target.affects.type}
            blankValue=""
            disabled={!context.unlocked}
          >
            <SelectOptions
              data={context.config.individualTargetTypes}
              labelProp="label"
              blank=""
            />
          </SelectQuadrone>
        </div>
      </div>
    </div>

    <!-- Special -->
    {#if context.source.target.affects.type}
      <TextInputQuadrone
        id="{appId}-target-affects-special"
        document={context.item}
        field="system.target.affects.special"
        value={context.source.target.affects.special}
        class="full-width"
        placeholder={localize(
          'DND5E.TARGET.FIELDS.target.affects.special.label',
        )}
        disabled={!context.unlocked}
      />
    {/if}
  </div>

  <!-- Choose Targets  -->
  {#if context.system.target.template.type}
    <div class="form-group">
      <label for="{appId}-target-affects-choice"
        >{localize('DND5E.TARGET.FIELDS.target.affects.choice.label')}</label
      >
      <div class="form-fields">
        <CheckboxQuadrone
          id="{appId}-target-affects-choice"
          document={context.item}
          field="system.target.affects.choice"
          checked={context.source.target.affects.choice}
          disabledChecked={context.system.target.affects.choice}
          disabled={!context.unlocked}
        />
      </div>

      <p class="hint">
        {localize('DND5E.TARGET.FIELDS.target.affects.choice.hint')}
      </p>
    </div>
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.TargetTypeArea')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Template Type -->
  <div class="form-group">
    <label for="{appId}-target-template-type">{localize('DND5E.Shape')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-target-template-type"
        document={context.item}
        field="system.target.template.type"
        value={context.source.target.template.type}
        disabled={!context.unlocked}
        blankValue=""
      >
        <SelectOptions
          data={context.config.areaTargetOptions}
          labelProp="label"
          valueProp="value"
        />
      </SelectQuadrone>
    </div>
  </div>

  <!-- Dimensions -->
  {#if context.system.target.template.type && context.dimensions}
    <div class="form-group split-group">
      <label for="">{localize('DND5E.Dimensions')}</label>
      <div class="form-fields">
        <!-- Size -->
        <div class="form-group label-top">
          <label for="{appId}-target-template-size"
            >{localize(context.dimensions.size)}</label
          >
          <div class="form-fields">
            <TextInputQuadrone
              id="{appId}-target-template-size"
              document={context.item}
              field="system.target.template.size"
              value={context.source.target.template.size}
              disabled={!context.unlocked}
            />
          </div>
        </div>

        <!-- Width -->
        {#if context.dimensions?.width}
          <div class="form-group label-top">
            <label for="{appId}-target-template-width"
              >{localize(context.dimensions.width)}</label
            >
            <div class="form-fields">
              <TextInputQuadrone
                id="{appId}-target-template-width"
                document={context.item}
                field="system.target.template.width"
                value={context.source.target.template.width}
                disabled={!context.unlocked}
              />
            </div>
          </div>
        {/if}

        <!-- Height -->
        {#if context.dimensions?.height}
          <div class="form-group label-top">
            <label for="{appId}-target-template-height"
              >{localize(context.dimensions.height)}</label
            >
            <div class="form-fields">
              <TextInputQuadrone
                id="{appId}-target-template-height"
                document={context.item}
                field="system.target.template.height"
                value={context.source.target.template.height}
                disabled={!context.unlocked}
              />
            </div>
          </div>
        {/if}

        <!-- Units -->
        <div class="form-group label-top">
          <label for="{appId}-target-template-units"
            >{localize('DND5E.MovementUnits')}</label
          >
          <div class="form-fields">
            <SelectQuadrone
              id="{appId}-target-template-units"
              document={context.item}
              field="system.target.template.units"
              value={context.source.target.template.units}
              disabled={!context.unlocked}
            >
              <SelectOptions
                data={context.config.movementUnits}
                labelProp="label"
              />
            </SelectQuadrone>
          </div>
        </div>
      </div>
    </div>

    <!-- Multiple -->
    <div class="form-group split-group">
      <label for="{appId}-target-template-count"
        >{localize('DND5E.Multiple')}</label
      >
      <div class="form-fields">
        <!-- Amount -->
        <div class="form-fields label-top">
          <label for="{appId}-target-template-count"
            >{localize('DND5E.Amount')}</label
          >
          <div class="form-fields">
            <TextInputQuadrone
              id="{appId}-target-template-count"
              document={context.item}
              field="system.target.template.count"
              value={context.source.target.template.count}
              placeholder="1"
              disabled={!context.unlocked}
            />
          </div>
        </div>

        <!-- Contiguous -->
        {#if context.system.target.template.type && context.system.target.template.count > 1}
          <div class="form-group checkbox">
            <label for="{appId}-target-template-contiguous"
              >{localize('DND5E.Contiguous')}</label
            >
            <div class="form-fields">
              <label class="checkbox" for="{appId}-target-template-contiguous">
                <CheckboxQuadrone
                  id="{appId}-target-template-contiguous"
                  document={context.item}
                  field="system.target.template.contiguous"
                  checked={context.source.target.template.contiguous}
                  disabledChecked={context.system.target.template.contiguous}
                  disabled={!context.unlocked}
                />
              </label>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</fieldset>
