import { ActorItemApi } from './actor-item/ActorItemApi';
import { ActorPortraitApi } from './actor-portrait/ActorPortraitApi';
import { ActionListApi } from './action-list/ActionListApi';
import { SpellSchoolApi } from './spell-school-deprecated/SpellSchoolApi';
import { ItemSummaryApi } from './item-summary/ItemSummaryApi';
import { ExhaustionApi } from './exhaustion/ExhaustionApi.svelte';
import { ActorTraitsApi } from './actor-traits/ActorTraitsApi';
import { ItemConfigApi } from './item/ItemConfigApi';
import { ActorInspirationApi } from './actor-inspiration/ActorInspirationApi';

/**
 * Provides extensibility APIs for customizing various aspects of Tidy 5e Sheets.
 *
 * @category Configuration
 */
export class ConfigApi {
  /** {@inheritDoc ActionListApi} */
  actionList = new ActionListApi();
  
  /** {@inheritDoc ActorInspirationApi} */
  actorInspiration = new ActorInspirationApi();

  /** {@inheritDoc ActorItemApi} */
  actorItem = new ActorItemApi();

  /** {@inheritDoc ActorPortraitApi} */
  actorPortrait = new ActorPortraitApi();

  /** {@inheritDoc ActorTraitsApi} */
  actorTraits = new ActorTraitsApi();
  
  /** {@inheritDoc ExhaustionApi} */
  exhaustion = new ExhaustionApi();
  
  /** {@inheritDoc ItemConfigApi} */
  item = new ItemConfigApi();

  /** {@inheritDoc ItemSummaryApi} */
  itemSummary = new ItemSummaryApi();

  /**{@inheritDoc SpellSchoolApi} */
  spellSchool = new SpellSchoolApi();
}
