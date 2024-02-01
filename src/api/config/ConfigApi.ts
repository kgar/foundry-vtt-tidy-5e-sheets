import { ActorItemApi } from '../actor-item/ActorItemApi';
import { ActorPortraitApi } from '../actor-portrait/ActorPortraitApi';
import { ActionListApi } from '../action-list/ActionListApi';
import { SpellSchoolApi } from '../spell-school/SpellSchoolApi';

/**
 * Provides extensibility APIs for customizing various aspects of Tidy 5e Sheets.
 * @group Config
 * @category Config
 */
export class ConfigApi {
  /** {@inheritDoc ActionListApi} */
  actionList = new ActionListApi();

  /** {@inheritDoc ActorItemApi} */
  actorItem = new ActorItemApi();

  /** {@inheritDoc ActorPortraitApi} */
  actorPortrait = new ActorPortraitApi();

  /**{@inheritDoc SpellSchoolApi} */
  spellSchool = new SpellSchoolApi();
}
