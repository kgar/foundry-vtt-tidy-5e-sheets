import { CONSTANTS } from "src/constants";
import ItemDescription from "./parts/ItemDescription.svelte";
import type { Tab } from "src/types/types";

const allTabs = {
    description: {
        id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
        displayName: 'DND5E.Description',
        content: {
          component: ItemDescription,
          cssClass: 'flexcol',
        },
      },
      // TODO: Continue here
} as const;


export default allTabs;