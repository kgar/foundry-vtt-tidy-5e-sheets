import type { ItemSheetContext } from 'src/types/item.types';
import type { RegisteredContent, RegisteredTab } from '../types';
import type { RegisteredEquipmentTypeGroup } from './item.types';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Tab } from 'src/types/types';
import { Activities } from 'src/features/activities/activities';
import ItemActivitiesQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemActivitiesTab.svelte';
import ItemAdvancementQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemAdvancementTab.svelte';
import ItemBackgroundDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemBackgroundDetailsTab.svelte';
import ItemClassDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemClassDetailsTab.svelte';
import ItemConsumableDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemConsumableDetailsTab.svelte';
import ItemContainerContentsQuadroneTab from 'src/sheets/quadrone/container/tabs/ContainerContentsTab.svelte';
import ItemContainerDetailsQuadronTab from 'src/sheets/quadrone/container/tabs/ContainerDetailsTab.svelte';
import ItemDescriptionsQuadroneTab from '../../sheets/quadrone/item/tabs/ItemDescriptionsTab.svelte';
import ItemEffectsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemEffectsTab.svelte';
import ItemEquipmentDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemEquipmentDetailsTab.svelte';
import ItemFacilityDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemFacilityDetailsTab.svelte';
import ItemFeatDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemFeatDetailsTab.svelte';
import ItemLootDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemLootDetailsTab.svelte';
import ItemSpeciesDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSpeciesDetailsTab.svelte';
import ItemSpellDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSpellDetailsTab.svelte';
import ItemSubclassDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSubclassDetailsTab.svelte';
import ItemToolDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemToolDetailsTab.svelte';
import ItemWeaponDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemWeaponDetailsTab.svelte';

class ItemSheetRuntimeQuadrone {
  private _content: RegisteredContent<ItemSheetContext>[] = $state([]);
  private _tabs: RegisteredTab<ItemSheetContext>[] = $state([]);
  private _customItemEquipmentTypeGroups: RegisteredEquipmentTypeGroup[] =
    $state([]);

  constructor(nativeTabs: RegisteredTab<ItemSheetContext>[]) {
    this._tabs = nativeTabs;
  }
}

const singleton = new ItemSheetRuntimeQuadrone([]);

export default singleton;
