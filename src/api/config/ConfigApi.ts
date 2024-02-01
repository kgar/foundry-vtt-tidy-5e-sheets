import { ActorItemApi } from './actor-item/ActorItemApi';
import { ActorPortraitApi } from './actor-portrait/ActorPortraitApi';
import { ActionListApi } from './action-list/ActionListApi';
import { SpellSchoolApi } from './spell-school/SpellSchoolApi';
import { ItemSummaryApi } from './item-summary/ItemSummaryApi';
import { ExhaustionApi } from './exhaustion/ExhaustionApi';

/**
 * Provides extensibility APIs for customizing various aspects of Tidy 5e Sheets.
 *
 * @category Configuration
 */
export class ConfigApi {
  /** {@inheritDoc ActionListApi} */
  actionList = new ActionListApi();

  /** {@inheritDoc ActorItemApi} */
  actorItem = new ActorItemApi();

  /** {@inheritDoc ActorPortraitApi} */
  actorPortrait = new ActorPortraitApi();
  
  /** {@inheritDoc ExhaustionApi} */
  exhaustion = new ExhaustionApi();

  /** {@inheritDoc ItemSummaryApi} */
  itemSummary = new ItemSummaryApi();

  /**{@inheritDoc SpellSchoolApi} */
  spellSchool = new SpellSchoolApi();
}
