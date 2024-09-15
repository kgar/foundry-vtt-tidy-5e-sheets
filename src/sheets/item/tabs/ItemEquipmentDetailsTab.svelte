<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemMountable from '../parts/ItemMountable.svelte';
  import ItemActivation from '../parts/ItemActivation.svelte';
  import ItemAction from '../parts/ItemAction.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import DetailsMountable from '../parts/DetailsMountable.svelte';
  import FieldUses from '../parts/FieldUses.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <h3 class="form-header">
    {localize('DND5E.ItemEquipmentDetails')}
  </h3>

  <!-- Equipment Type -->
  <!-- 
  {{ formField fields.type.fields.value value=source.type.value label="DND5E.ItemEquipmentType" blank=""
                 localize=true options=equipmentTypes }}
   -->

  <!-- Equipment Base -->
  <!-- 
   {{ formField fields.type.fields.baseItem value=source.type.baseItem label="DND5E.ItemEquipmentBase" blank=""
                 localize=true choices=baseItems }}
    -->

  <!-- Proficiency -->
  <!-- 
    {{ formField fields.proficient value=source.proficient blank="DND5E.Automatic" localize=true
                 choices=config.weaponAndArmorProficiencyLevels }}
     -->

  <!-- Armor -->
  <!--
      {{#if system.isArmor}}
    <div class="form-group split-group">
        <label>{{ localize "DND5E.Armor" }}</label>
        <div class="form-fields">

            <!-- Value --}}
            {{ formField fields.armor.fields.value value=source.armor.value step=1 label="DND5E.AC" localize=true
                         classes="label-top" }}

            <!-- Max Dex --}}
            {{#if hasDexModifier}}
            {{ formField fields.armor.fields.dex value=source.armor.dex label="DND5E.ItemEquipmentDexModAbbr"
                         placeholder="∞" localize=true classes="label-top" }}
            {{/if}}

            <!-- Strength Requirement --}}
            {{#if system.isArmor}}
            {{ formField fields.strength value=source.strength label="DND5E.AbilityStr" placeholder="—" localize=true
                         classes="label-top" }}
            {{/if}}
        </div>
    </div>
    {{/if}}
     -->

  <!-- Properties -->
  <!-- 
     {{ formField fields.properties options=properties.options label="DND5E.ItemEquipmentProperties" localize=true
                 input=inputs.createMultiCheckboxInput stacked=true classes="checkbox-grid checkbox-grid-3" }}
      -->

  <!-- Magical Properties -->

  <!-- 
    {{#if properties.object.mgc}}
        <div class="form-group split-group">
            <label>{{ localize "DND5E.Item.Property.Magical" }}</label>
            <div class="form-fields">

                <!-- Attunement --}}
                {{#unless isMountable}}
                <div class="form-group label-top">
                    <label>{{ localize "DND5E.Attunement" }}</label>
                    <div class="form-fields">

                        <!-- Attuned --}}
                        {{#if source.attunement}}
                        {{ formInput fields.attuned value=source.attuned input=inputs.createCheckboxInput
                                    ariaLabel=(localize "DND5E.Attuned") dataset=(dnd5e-object tooltip="DND5E.Attuned") }}
                        {{/if}}

                        <!-- Attunement --}}
                        {{ formInput fields.attunement value=source.attunement choices=config.attunementTypes
                                    blank="DND5E.AttunementNone" localize=true }}
                    </div>
                </div>
                {{/unless}}

                <!-- Magical Bonus --}}
                {{ formField fields.armor.fields.magicalBonus value=source.armor.magicalBonus step=1 placeholder="0"
                            label="DND5E.Bonus" localize=true classes="label-top" }}
            </div>
        </div>
        {{/if}}
    -->

  {#if $context.system.isMountable}
    <DetailsMountable />
  {/if}

  <FieldUses />
</ContentConcealer>
